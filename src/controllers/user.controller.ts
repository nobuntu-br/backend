import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { UserService } from "../services/user.service";
import { IUser } from "../models/user.model";
import { RegisterUserUseCase } from "../useCases/user/registerUser.useCase";
import { NotFoundError } from "../errors/notFound.error";
import { CheckEmailExistUseCase } from "../useCases/user/checkEmailExist.useCase";
import { SendVerificationCodeToEmailUseCase } from "../useCases/user/sendVerificationCodeToEmail.useCase";
import { VerificationEmailService } from "../services/verificationEmail.service";
import { ChangeUserPasswordUseCase } from "../useCases/user/changeUserPassword.useCase";
import { AzureADService } from "../services/azureAD.service";
import { SignInUseCase } from "../useCases/user/signIn.useCase";
import { ValidateEmailVerificationCodeUseCase } from "../useCases/user/validateEmailVerificationCode.useCase";
import { SendChangeUserPasswordLinkToEmailUseCase } from "../useCases/user/sendChangeUserPasswordLinkToEmail.useCase";
import { EmailService } from "../services/email.service";
import { InviteUserToApplicationUseCase } from "../useCases/user/inviteUserToApplication.useCase";
import TenantService from "../services/tenant.service";
import { TokenGenerator } from "../utils/tokenGenerator";

export class UserController {

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }



      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const verificationEmailService: VerificationEmailService = new VerificationEmailService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const azureADService: AzureADService = new AzureADService();
      const tokenGenerator: TokenGenerator= new TokenGenerator();

      const registerUserUseCase: RegisterUserUseCase = new RegisterUserUseCase(userService, verificationEmailService, azureADService, tokenGenerator);

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

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const baseController: BaseController<IUser> = new BaseController(userService, "User");

      baseController.findAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const baseController: BaseController<IUser> = new BaseController(userService, "User");

      baseController.findById(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async getCount(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const baseController: BaseController<IUser> = new BaseController(userService, "User");

      baseController.getCount(req, res, next);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const baseController: BaseController<IUser> = new BaseController(userService, "User");

      baseController.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const baseController: BaseController<IUser> = new BaseController(userService, "User");

      baseController.delete(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async deleteAll(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const baseController: BaseController<IUser> = new BaseController(userService, "User");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async findByUID(req: Request, res: Response) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);

      const user = await userService.findOne({ UID: req.params.UID });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor. " + error });
    }
  }

  async checkEmailExist(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);

      const azureADService: AzureADService = new AzureADService();
      const checkEmailExistUseCase: CheckEmailExistUseCase = new CheckEmailExistUseCase(userService, azureADService);
      const emailIsValid = await checkEmailExistUseCase.execute(req.body);
      
      return res.status(200).send(emailIsValid);
    } catch (error) {
      next(error);
    }
  }
  
  async sendVerificationEmailCodeToEmail(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const verificationEmailService: VerificationEmailService = new VerificationEmailService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const sendVerificationCodeUseCase : SendVerificationCodeToEmailUseCase = new SendVerificationCodeToEmailUseCase(verificationEmailService);
      const result = await sendVerificationCodeUseCase.execute(req.body);

      return res.status(200).send(result);
    
    } catch (error) {
      next(error);
    }
  }

  async validateVerificationEmailCode(req: Request, res: Response, next: NextFunction){
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      
      const verificationEmailService: VerificationEmailService = new VerificationEmailService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      const validateEmailVerificationCodeUseCase: ValidateEmailVerificationCodeUseCase = new ValidateEmailVerificationCodeUseCase(verificationEmailService);
      const result = await validateEmailVerificationCodeUseCase.execute({
        verificationEmailCode: String(req.body.verificationEmailCode)
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  
  async createUserForSpecificTenant(req: Request, res: Response, next: NextFunction){
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      
      throw new Error("Função não finalizada");
      
      // return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Faz envio de um link para o email do usuário para ele realizar a alteração de senha na pagina da aplicação
   */
  async sendChangeUserPasswordLinkToEmail(req: Request, res: Response, next: NextFunction){
    try {

      //Definir o servico de email que será usado
      const emailService: EmailService = new EmailService();
      const sendChangeUserPasswordLinkToEmailUseCase : SendChangeUserPasswordLinkToEmailUseCase = new SendChangeUserPasswordLinkToEmailUseCase(emailService);
      const result = await sendChangeUserPasswordLinkToEmailUseCase.execute({
        email: req.body.email
      });
      
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction){
    try {

      const azureADService: AzureADService = new AzureADService();
      const changeUserPasswordUseCase: ChangeUserPasswordUseCase = new ChangeUserPasswordUseCase(azureADService);
      const result = await changeUserPasswordUseCase.execute({email: req.body.email, password: req.body.password});
      
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction){
    try {

      const azureADService: AzureADService = new AzureADService();
      const signInUseCase: SignInUseCase = new SignInUseCase(azureADService);
      const result = await signInUseCase.execute({email: req.body.email, password: req.body.password});
      
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserImage(){

  }

  async inviteUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Definir o servico de email que será usado
      const emailService: EmailService = new EmailService();
      //Serviço de geração de token
      const tokenGenerator = new TokenGenerator();
      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantService: TenantService = new TenantService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);

      const inviteUserToApplicationUseCase: InviteUserToApplicationUseCase = new InviteUserToApplicationUseCase(emailService, userService, tokenGenerator, tenantService);

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
}