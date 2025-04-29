import { NotFoundError } from "../../errors/notFound.error";
import { IidentityService } from "../../domain/services/Iidentity.service";
import { TokenGenerator } from "../../utils/tokenGenerator";
import { IUser, User } from "../../domain/entities/fixes/user.model";
import UserRepository from "../../domain/repositories/fixes/user.repository";
import VerificationEmailRepository from "../../domain/repositories/fixes/verificationEmail.repository";
import { checkEmailIsValid } from "../../utils/verifiers.util";
import { ValidationError } from "../../errors/validation.error";
import { JwtPayload } from "jsonwebtoken";
import { RegisterTenantPermissionUseCase } from "../tenant/registerTenantPermission.useCase";

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

    console.log(input);

    if (checkEmailIsValid(input.email) == false) {
      throw new ValidationError("Email is invalid.");
    };

    let user: IUser | null = null;

    try {
      user = await this.identityService.getUserByEmail(input.email);
    } catch (error) {
      
    }

    if (user != null) {
      throw new ValidationError("User already exists.");
    }

    //Verificar se dados do usuário são válidos novamente (verificar se o registro de confirmação de email foi validado)
    if (await this.verificationEmailRepository.ifEmailWasValidated(input.email) == false) {
      throw new NotFoundError("Verificação de email não realizada!");
    }

    let registeredUserOnIdentityServer: IUser;

    try {
      registeredUserOnIdentityServer = await this.identityService.createUser({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        userName: input.userName,
        password: input.password
      });
    } catch (error) {
      throw new Error("Error to register user on identity server.");
    }

    var userWillBeAdministrator: boolean = false;
    //Verificar se é o primeiro usuário da aplicação, para assim definir ele como admin
    if (await this.userRepository.isUserRegistered() == false) {
      userWillBeAdministrator = true;
    }

    const tenantUID = process.env.TENANT_ID;

    if (tenantUID == undefined) {
      throw new Error("TENANT_ID environment variables not populed");
    }

    let newUser: IUser | null = null;

    try {
      //Registra o usuário no banco de dados
      newUser = await this.userRepository.create(new User({
        UID: registeredUserOnIdentityServer.UID,//UID do servidor de identidade
        userName: input.userName,
        firstName: input.firstName,
        lastName: input.lastName,
        isAdministrator: userWillBeAdministrator,
        email: input.email,
        tenantUID: tenantUID
      }));

      
    } catch (error) {
      throw new Error("Error to create user. Details: "+ error);
    }

    if (input.invitedTenantsToken != null && input.invitedTenantsToken != undefined && input.invitedTenantsToken != "") {
      //Validar JWT e pegar o payload (dados contidos dentro do JWT)
      const data = this.tokenGenerator.verifyToken(input.invitedTenantsToken) as JwtPayload;
      
      const registerTenantPermissionUseCase: RegisterTenantPermissionUseCase = new RegisterTenantPermissionUseCase();
      registerTenantPermissionUseCase.execute({
        databaseCredentialId: data.databaseCredentialId,
        tenantId: data.databaseCredentialId,
        userId: newUser.id!
      });
    }

    return newUser;

  }

}