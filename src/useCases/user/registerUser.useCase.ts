import { NotFoundError } from "../../errors/notFound.error";
import { RegisterNewUserDTO } from "../../models/DTO/registerNewUser.DTO";
import { IUser } from "../../models/user.model";
import { IidentityService } from "../../services/Iidentity.service";
import { UserService } from "../../services/user.service";
import { VerificationEmailService } from "../../services/verificationEmail.service";
import { TokenGenerator } from "../../utils/tokenGenerator";

export class RegisterUserUseCase {

  constructor(
    private userService: UserService,
    private verificationEmailService: VerificationEmailService,
    private identityService: IidentityService,
    private tokenGenerator: TokenGenerator
  ) { }

  async execute(input: RegisterNewUserDTO): Promise<IUser> {
    try {

      if (input.invitedTenantsToken != null) {
        //TODO tem que verificar se contém o JWT que informa se o usuário será cadastrado em um tenant diretamente
        const data = this.tokenGenerator.verifyToken(input.invitedTenantsToken);

        console.log(data);
      }



      //Verifica se usuário já existe
      const isUserExist = await this.userService.findOne({
        email: input.email,
      });

      if (isUserExist != null) {
        throw new Error("Usuário já existe");
      }

      //Verificar se dados do usuário são válidos novamente (verificar se o registro de confirmação de email foi validado)
      if (await this.verificationEmailService.ifEmailWasValidated(input.email) == false) {
        throw new NotFoundError("Verificação de email não realizada!");
      }

      const user = await this.registerUserOnIdentifyServer(input);

      var userWillBeAdministrator: boolean = false;
      //Verificar se é o primeiro usuário da aplicação, para assim definir ele como admin
      if (await this.userService.IfApplicationHasRegisteredUsers() == false) {
        userWillBeAdministrator = true;
      }

      //Registra o usuário no banco de dados
      const newUser: IUser = await this.userService.create({
        UID: user.UID,//UID do servidor de identidade
        userName: input.userName,
        firstName: input.firstName,
        lastName: input.lastName,
        isAdministrator: userWillBeAdministrator,
        email: input.email,
        tenantUID: process.env.TENANT_ID
      });

      return newUser;

    } catch (error) {
      console.log("Erro ao realizar o cadastro do usuário. Detalhes: ", error);
      throw error;
    }
  }

  async registerUserOnIdentifyServer(input: RegisterNewUserDTO): Promise<IUser> {
    return await this.identityService.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      userName: input.userName,
      password: input.password
    });
  }

}