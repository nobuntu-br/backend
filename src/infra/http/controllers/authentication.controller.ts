import { NextFunction, Request, Response } from "express";
import { RefreshTokenOutputDTO, RefreshTokenUseCase } from "../../../useCases/authentication/refreshToken.useCase";
import { NotFoundError } from "../../../errors/notFound.error";
import { IidentityService } from "../../../domain/services/Iidentity.service";
import { AzureADService } from "../../../domain/services/azureAD.service";
import { SignInOutputDTO, SignInUseCase } from "../../../useCases/authentication/signIn.useCase";
import { SendVerificationCodeToEmailUseCase } from "../../../useCases/authentication/sendVerificationCodeToEmail.useCase";
import { ValidateEmailVerificationCodeUseCase } from "../../../useCases/authentication/validateEmailVerificationCode.useCase";
import { EmailService } from "../../../domain/services/email.service";
import { ResetUserPasswordUseCase } from "../../../useCases/authentication/resetUserPassword.useCase";
import { SendPasswordResetLinkToEmailUseCase } from "../../../useCases/user/sendPasswordResetLinkToEmail.useCase";
import { InviteUserToApplicationUseCase } from "../../../useCases/user/inviteUserToApplication.useCase";
import { TokenGenerator } from "../../../utils/tokenGenerator";
import { RegisterUserUseCase } from "../../../useCases/user/registerUser.useCase";
import { CheckEmailExistUseCase } from "../../../useCases/authentication/checkEmailExist.useCase";
import { ValidateAccessTokenUseCase } from "../../../useCases/authentication/validateAccessToken.useCase";
import { UnauthorizedError } from "../../../errors/unauthorized.error";
import { SignOutUseCase } from "../../../useCases/authentication/signOut.useCase";
import DatabasePermissionRepository from "../../../domain/repositories/databasePermission.repository";
import UserRepository from "../../../domain/repositories/user.repository";
import VerificationEmailRepository from "../../../domain/repositories/verificationEmail.repository";
import TenantRepository from "../../../domain/repositories/tenant.repository";
import { SingleSignOnUseCase } from "../../../useCases/authentication/singleSignOn.useCase";

export class AuthenticationController {

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const verificationEmailRepository: VerificationEmailRepository = new VerificationEmailRepository(req.body.tenantConnection);
      const azureADService: AzureADService = new AzureADService();
      const tokenGenerator: TokenGenerator = new TokenGenerator();

      const registerUserUseCase: RegisterUserUseCase = new RegisterUserUseCase(userRepository, verificationEmailRepository, azureADService, tokenGenerator);

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

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {

      let acceptedCookieDomains = process.env.ACCEPTED_COOKIE_DOMAINS == undefined ? "" : process.env.ACCEPTED_COOKIE_DOMAINS;

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const azureADService: AzureADService = new AzureADService();
      const signInUseCase: SignInUseCase = new SignInUseCase(azureADService, userRepository);
      const result: SignInOutputDTO = await signInUseCase.execute({ email: req.body.email, password: req.body.password });

      //Token de acesso é enviado para o cookie
      res.cookie('accessToken_' + result.user.id, 'Bearer ' + result.tokens.accessToken, {
        httpOnly: true, // Previne acesso pelo JavaScript do lado do cliente
        secure: true, // garante que o cookie só seja enviado por HTTPS
        sameSite: 'none',
        // domain: acceptedCookieDomains,
        maxAge: 60 * 60 * 1000, // 1 hora (horas * minutos * segundos * milisegundos)
      });

      res.cookie('refreshToken_' + result.user.id, result.tokens.refreshToken, {
        httpOnly: true, // Previne acesso pelo JavaScript do lado do cliente
        secure: true,
        sameSite: 'none',
        // domain: acceptedCookieDomains, 
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
      });

      //Só será enviado dados do usuário
      return res.status(200).send(result.user);
    } catch (error) {
      next(error);
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {

      //Obter usuário da sessão atual
      const sessionUserId = req.headers["usersession"];

      if (sessionUserId == undefined || sessionUserId == null || isNaN(Number(sessionUserId))) {
        throw new UnauthorizedError("usersession not defined or invalid.");
      }

      //Obter o token de acesso
      let accessToken = req.cookies["accessToken_" + sessionUserId];

      if (accessToken == undefined) {
        throw new UnauthorizedError("accessToken not defined or invalid.");
      }

      accessToken = accessToken.split(' ')[1]; // Obtém o token após "Bearer"

      let refreshToken = req.cookies["refreshToken_" + sessionUserId];

      const azureADService: AzureADService = new AzureADService();
      const signoutUseCase: SignOutUseCase = new SignOutUseCase(azureADService);

      await signoutUseCase.execute({
        accessToken,
        refreshToken
      });

      res.clearCookie('accessToken_' + sessionUserId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.clearCookie('refreshToken_' + sessionUserId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      //Só será enviado dados do usuário
      return res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {

      //Obter os tokens
      let cookies = req.cookies;

      if (cookies == undefined) {
        throw new UnauthorizedError("refreshToken not defined or invalid.");
      }

      // console.log(cookies);

      let refreshTokens: Map<string, string> = new Map<string, string>();

      for (const [key, refreshToken] of Object.entries(cookies)) {
        if (key.startsWith("refreshToken_")) {
          // Extrai o texto após "_"
          const userSessionId = key.split("refreshToken_")[1];

          if(isNaN(Number(refreshToken)) == true){
            refreshTokens.set(userSessionId, refreshToken as string);
          }
        }
      }

      // console.log("valores do map de refreshtokens: ", refreshTokens);

      let acceptedCookieDomains = process.env.ACCEPTED_COOKIE_DOMAINS == undefined ? "" : process.env.ACCEPTED_COOKIE_DOMAINS;

      //Define o serviço de servidor de Identidade
      const identityService: IidentityService = new AzureADService();

      let newAccessData : RefreshTokenOutputDTO[] = [];

      const refreshTokenUseCase: RefreshTokenUseCase = new RefreshTokenUseCase(identityService);

      for (const [userSessionId, refreshToken] of refreshTokens) {

        let refreshTokenResponse = await refreshTokenUseCase.execute({
          refreshToken: refreshToken
        });

        //Token de acesso é enviado
        res.cookie('accessToken_' + userSessionId, 'Bearer ' + refreshTokenResponse.tokens.accessToken, {
          httpOnly: true, // Previne acesso pelo JavaScript do lado do cliente
          secure: true,
          sameSite: 'none', // Essa opção em 'strict' Protege contra CSRF
          // path: '/',
          domain: acceptedCookieDomains,
          maxAge: 10 * 60 * 1000, // 10 minutos (dias * horas * minutos * segundos * milisegundos )
        });

        res.cookie('refreshToken_' + userSessionId, refreshTokenResponse.tokens.refreshToken, {
          httpOnly: true, // Previne acesso pelo JavaScript do lado do cliente
          secure: true,
          sameSite: 'none',
          domain: acceptedCookieDomains,
          maxAge: 24 * 60 * 60 * 1000, // 1 dia
        });

        refreshTokenResponse.user.id = Number(userSessionId);
        
        newAccessData.push(refreshTokenResponse);
      }

      if(newAccessData.length == 0){
        throw new UnauthorizedError("Error to refresh token");
      }

      return res.status(200).send(newAccessData.map(_newAccessData => _newAccessData.user));
    } catch (error) {
      next(error);
    }
  }

  async singleSignOn(req: Request, res: Response, next: NextFunction) {

    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //Obter os tokens
      let cookies = req.cookies;

      if (cookies == undefined) {
        throw new UnauthorizedError("refreshToken not defined or invalid.");
      }

      let refreshTokens: Map<string, string> = new Map<string, string>();

      for (const [key, refreshToken] of Object.entries(cookies)) {
        if (key.startsWith("refreshToken_")) {
          // Extrai o texto após "_"
          const userSessionId = key.split("refreshToken_")[1];

          if(isNaN(Number(refreshToken)) == true){
            refreshTokens.set(userSessionId, refreshToken as string);
          }
        }
      }

      let acceptedCookieDomains = process.env.ACCEPTED_COOKIE_DOMAINS == undefined ? "" : process.env.ACCEPTED_COOKIE_DOMAINS;

      //Define o serviço de servidor de Identidade
      const identityService: IidentityService = new AzureADService();

      let newAccessData : RefreshTokenOutputDTO[] = [];
      
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const singleSignOnUseCase: SingleSignOnUseCase = new SingleSignOnUseCase(identityService, userRepository);

      for (const [userSessionId, refreshToken] of refreshTokens) {

        let refreshTokenResponse = await singleSignOnUseCase.execute({
          refreshToken: refreshToken
        });

        //Token de acesso é enviado
        res.cookie('accessToken_' + userSessionId, 'Bearer ' + refreshTokenResponse.tokens.accessToken, {
          httpOnly: true, // Previne acesso pelo JavaScript do lado do cliente
          secure: true,
          sameSite: 'none', // Essa opção em 'strict' Protege contra CSRF
          path: '/',
          domain: acceptedCookieDomains,
          maxAge: 10 * 60 * 1000, // 10 minutos (dias * horas * minutos * segundos * milisegundos )
        });

        res.cookie('refreshToken_' + userSessionId, refreshTokenResponse.tokens.refreshToken, {
          httpOnly: true, // Previne acesso pelo JavaScript do lado do cliente
          secure: true,
          sameSite: 'none',
          domain: acceptedCookieDomains,
          maxAge: 24 * 60 * 60 * 1000, // 1 dia
        });

        refreshTokenResponse.user.id = Number(userSessionId);
        
        newAccessData.push(refreshTokenResponse);
      }

      if(newAccessData.length == 0){
        throw new UnauthorizedError("Error to refresh token");
      }

      return res.status(200).send(newAccessData.map(_newAccessData => _newAccessData.user));
    } catch (error) {
      next(error);
    }
  }

  async sendVerificationEmailCodeToEmail(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const verificationEmailRepository: VerificationEmailRepository = new VerificationEmailRepository(req.body.tenantConnection);
      const azureADService: AzureADService = new AzureADService();
      const sendVerificationCodeUseCase: SendVerificationCodeToEmailUseCase = new SendVerificationCodeToEmailUseCase(verificationEmailRepository, azureADService);
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
      const azureADService: AzureADService = new AzureADService();
      const sendPasswordResetLinkToEmailUseCase: SendPasswordResetLinkToEmailUseCase = new SendPasswordResetLinkToEmailUseCase(azureADService, emailService, tokenGenerator);
      const result = await sendPasswordResetLinkToEmailUseCase.execute({
        email: req.body.email
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const azureADService: AzureADService = new AzureADService();
      const tokenGenerator: TokenGenerator = new TokenGenerator();
      const resetUserPasswordUseCase: ResetUserPasswordUseCase = new ResetUserPasswordUseCase(azureADService, tokenGenerator);
      const result = await resetUserPasswordUseCase.execute({ password: req.body.password, resetPasswordToken: req.body.resetPasswordToken });

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
      const tenantRepository = new TenantRepository(req.body.tenantConnection);

      const inviteUserToApplicationUseCase: InviteUserToApplicationUseCase = new InviteUserToApplicationUseCase(emailService, userRepository, tokenGenerator, tenantRepository);

      const response = await inviteUserToApplicationUseCase.execute({
        invitedUserEmail: req.body.invitedUserEmail,
        invitedUserTenantIds: req.body.invitedUserTenantIds,
        invitingUserEmail: req.body.invitingUserEmail,
        invitingUserId: req.body.invitingUserId
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
