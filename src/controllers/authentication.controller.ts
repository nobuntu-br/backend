import { NextFunction, Request, Response } from "express";
import { RefreshTokenUseCase } from "../useCases/authentication/refreshToken.useCase";
import UserRepository from "../repositories/user.repository";
import { NotFoundError } from "../errors/notFound.error";
import { IidentityService } from "../services/Iidentity.service";
import { AzureADService } from "../services/azureAD.service";
import { SignInUseCase } from "../useCases/authentication/signIn.useCase";
import VerificationEmailRepository from "../repositories/verificationEmail.repository";
import { SendVerificationCodeToEmailUseCase } from "../useCases/user/sendVerificationCodeToEmail.useCase";
import { ValidateEmailVerificationCodeUseCase } from "../useCases/user/validateEmailVerificationCode.useCase";
import { EmailService } from "../services/email.service";
import { ChangeUserPasswordUseCase } from "../useCases/user/changeUserPassword.useCase";
import { SendPasswordResetLinkToEmailUseCase } from "../useCases/user/sendPasswordResetLinkToEmail.useCase";
import DatabasePermissionRepository from "../repositories/databasePermission.repository";
import { InviteUserToApplicationUseCase } from "../useCases/user/inviteUserToApplication.useCase";
import { TokenGenerator } from "../utils/tokenGenerator";
import { VerificationEmailService } from "../services/verificationEmail.service";
import { RegisterUserUseCase } from "../useCases/user/registerUser.useCase";
import { CheckEmailExistUseCase } from "../useCases/user/checkEmailExist.useCase";

export class AuthenticationController {

  async signup(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const verificationEmailService: VerificationEmailService = new VerificationEmailService(req.body.tenantConnection);
      const azureADService: AzureADService = new AzureADService();
      const tokenGenerator: TokenGenerator = new TokenGenerator();

      const registerUserUseCase: RegisterUserUseCase = new RegisterUserUseCase(userRepository, verificationEmailService, azureADService, tokenGenerator);

      const user = await registerUserUseCase.execute({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        userName: req.body.userName,
        invitedTenantsToken: req.body.invitedTenantsToken
      });

      res.status(200).send(user);

    } catch (error) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {

      const azureADService: AzureADService = new AzureADService();
      const signInUseCase: SignInUseCase = new SignInUseCase(azureADService);
      const result = await signInUseCase.execute({ email: req.body.email, password: req.body.password });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const identityService: IidentityService = new AzureADService();

      const refreshTokenUseCase: RefreshTokenUseCase = new RefreshTokenUseCase(userRepository, identityService);
      const response = refreshTokenUseCase.execute({
        refreshToken: req.body.refreshToken
      });

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  async sendVerificationEmailCodeToEmail(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const verificationEmailRepository: VerificationEmailRepository = new VerificationEmailRepository(req.body.tenantConnection);
      const sendVerificationCodeUseCase: SendVerificationCodeToEmailUseCase = new SendVerificationCodeToEmailUseCase(verificationEmailRepository);
      const result = await sendVerificationCodeUseCase.execute(req.body);

      return res.status(200).send(result);

    } catch (error) {
      next(error);
    }
  }

  async validateVerificationEmailCode(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const verificationEmailRepository: VerificationEmailRepository = new VerificationEmailRepository(req.body.tenantConnection);
      const validateEmailVerificationCodeUseCase: ValidateEmailVerificationCodeUseCase = new ValidateEmailVerificationCodeUseCase(verificationEmailRepository);
      const result = await validateEmailVerificationCodeUseCase.execute({
        verificationEmailCode: String(req.body.verificationEmailCode)
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async sendPasswordResetLinkToEmail(req: Request, res: Response, next: NextFunction) {
    try {

      //Definir o servico de email que será usado
      const emailService: EmailService = new EmailService();
      const tokenGenerator: TokenGenerator = new TokenGenerator();

      const sendPasswordResetLinkToEmailUseCase: SendPasswordResetLinkToEmailUseCase = new SendPasswordResetLinkToEmailUseCase(emailService, tokenGenerator);
      const result = await sendPasswordResetLinkToEmailUseCase.execute({
        email: req.body.email
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {

      const azureADService: AzureADService = new AzureADService();
      const changeUserPasswordUseCase: ChangeUserPasswordUseCase = new ChangeUserPasswordUseCase(azureADService);
      const result = await changeUserPasswordUseCase.execute({ email: req.body.email, password: req.body.password });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async inviteUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      //Definir o servico de email que será usado
      const emailService: EmailService = new EmailService();
      //Serviço de geração de token
      const tokenGenerator = new TokenGenerator();
      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection);

      const inviteUserToApplicationUseCase: InviteUserToApplicationUseCase = new InviteUserToApplicationUseCase(emailService, userRepository, tokenGenerator, databasePermissionRepository);

      const response = await inviteUserToApplicationUseCase.execute({
        invitedUserEmail: req.body.invitedUserEmail,
        invitedUserTenantIds: req.body.invitedUserTenantIds,
        invitingUserEmail: req.body.invitingUserEmail,
        invitingUserUID: req.body.invitingUserUID
      });

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  async checkEmailExist(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      
      const azureADService: AzureADService = new AzureADService();
      const checkEmailExistUseCase: CheckEmailExistUseCase = new CheckEmailExistUseCase(azureADService);
      const emailIsValid = await checkEmailExistUseCase.execute(req.body);
      
      return res.status(200).send(emailIsValid);
    } catch (error) {
      next(error);
    }
  }

}