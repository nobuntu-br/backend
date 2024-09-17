import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { RegisterUserUseCase } from "../useCases/user/registerUser.useCase";
import UserTenantService from "../services/userTenant.service";
import TenantService from "../services/tenant.service";
import { TenantCredentialService } from "../services/tenantCredential.service";
import { NotFoundError } from "../errors/notFound.error";
import { CheckEmailExistUseCase } from "../useCases/user/checkEmailExist.useCase";
import { SendVerificationCodeToEmailUseCase } from "../useCases/user/sendVerificationCodeToEmail.useCase";
import { VerifyCodeSendToEmailUseCase } from "../useCases/user/verifyCodeSentToEmail.useCase";
import { VerificationEmailService } from "../services/verificationEmail.service";

export class UserController {

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["user"]);

      const registerUserUseCase: RegisterUserUseCase = new RegisterUserUseCase(userService);

      //TODO usar o DTO para passar para o UseCase os dados corretamente
      const user = await registerUserUseCase.execute({
        UID: req.body.UID,
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        memberType: req.body.memberType
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
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["user"]);

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
    const { email } = req.body;

    try {
      
      const checkEmailExistUseCase: CheckEmailExistUseCase = new CheckEmailExistUseCase();
      const emailIsValid = await checkEmailExistUseCase.execute(email);
      
      return res.status(200).send(emailIsValid);
    } catch (error) {
      next(error);
    }
  }
  
  async sendVerificationEmailCodeToEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const verificationEmailService: VerificationEmailService = new VerificationEmailService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["verificationEmail"]);
      const sendVerificationCodeUseCase : SendVerificationCodeToEmailUseCase = new SendVerificationCodeToEmailUseCase(verificationEmailService);
      const result = await sendVerificationCodeUseCase.execute(email);

      return res.status(200).send(result);
    
    } catch (error) {
      next(error);
    }
  }

  async validateVerificationEmailCode(req: Request, res: Response, next: NextFunction){
    const { email, verificationEmailCode } = req.body;
    
    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      
      const verificationEmailService: VerificationEmailService = new VerificationEmailService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["verificationEmail"]);
      const verifyCodeSendToEmailUseCase: VerifyCodeSendToEmailUseCase = new VerifyCodeSendToEmailUseCase(verificationEmailService);
      const result = await verifyCodeSendToEmailUseCase.execute(email, verificationEmailCode);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  
}