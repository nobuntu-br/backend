import { NotFoundError } from "../../errors/notFound.error";
import { IidentityService } from "../../domain/services/Iidentity.service";
import { TokenGenerator } from "../../utils/tokenGenerator";
import { IUser, User } from "../../domain/entities/user.model";
import UserRepository from "../../domain/repositories/user.repository";
import VerificationEmailRepository from "../../domain/repositories/verificationEmail.repository";

export type signupInputDTO = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  invitedTenantsToken: string
}

export class RegisterUserUseCase {

  constructor(
    private userRepository: UserRepository,
    private verificationEmailRepository: VerificationEmailRepository,
    private identityService: IidentityService,
    private tokenGenerator: TokenGenerator
  ) { }

  async execute(input: signupInputDTO): Promise<IUser> {
    try {

      if (input.invitedTenantsToken != null && input.invitedTenantsToken != undefined && input.invitedTenantsToken != "") {
        //TODO tem que verificar se contém o JWT que informa se o usuário será cadastrado em um tenant diretamente
        const data = this.tokenGenerator.verifyToken(input.invitedTenantsToken);
      }

      //Verifica se usuário já existe
      const isUserExist = await this.userRepository.findOne({
        email: input.email,
      });

      if (isUserExist != null) {
        throw new Error("Usuário já existe");
      }

      //Verificar se dados do usuário são válidos novamente (verificar se o registro de confirmação de email foi validado)
      if (await this.verificationEmailRepository.ifEmailWasValidated(input.email) == false) {
        throw new NotFoundError("Verificação de email não realizada!");
      }

      const user = await this.registerUserOnIdentifyServer(input);

      var userWillBeAdministrator: boolean = false;
      //Verificar se é o primeiro usuário da aplicação, para assim definir ele como admin
      if (await this.userRepository.isUserRegistered() == false) {
        userWillBeAdministrator = true;
      }

      const tenantUID = process.env.TENANT_ID;

      if(tenantUID == undefined){
        throw new Error("TENANT_ID environment variables not populed");
      }

      //Registra o usuário no banco de dados
      const newUser: IUser = await this.userRepository.create(new User({
        UID: user.UID,//UID do servidor de identidade
        userName: input.userName,
        firstName: input.firstName,
        lastName: input.lastName,
        isAdministrator: userWillBeAdministrator,
        email: input.email,
        tenantUID: tenantUID
      }));

      return newUser;

    } catch (error) {
      throw error;
    }
  }

  async registerUserOnIdentifyServer(input: signupInputDTO): Promise<IUser> {
    return await this.identityService.createUser({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      userName: input.userName,
      password: input.password
    });
  }

}