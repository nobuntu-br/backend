import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";
import { UserDTO } from "../models/DTO/user.DTO";
import { RegisterUserUseCase } from "../useCases/user/registerUser.useCase";
import UserTenantService from "../services/userTenant.service";
import TenantService from "../services/tenant.service";
import { TenantCredentialService } from "../services/tenantCredential.service";

export class UserController {

  async create(req: Request, res: Response) {
    try {

      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.databaseConnection.databaseType, req.databaseConnection.models["user"]);
      const tenantService: TenantService = new TenantService(req.databaseConnection.databaseType, req.databaseConnection.models["tenant"]);
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.databaseConnection.databaseType, req.databaseConnection.models["tenantCredential"]);
      const userTenantService: UserTenantService = new UserTenantService(req.databaseConnection.databaseType, req.databaseConnection.models["userTenant"]);

      const registerUserUseCase: RegisterUserUseCase = new RegisterUserUseCase(userService, tenantService, tenantCredentialService, userTenantService);

      
      const user = await registerUserUseCase.execute({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isAdministrator: req.body.isAdministrator,
        memberType: req.body.memberType,
        TenantUID: req.body.TenantUID,
        UID: req.body.UID,
      });

      res.status(200).send(user);

    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {

      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.databaseConnection.databaseType, req.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

      baseController.findAll(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async findById(req: Request, res: Response) {
    try {

      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.databaseConnection.databaseType, req.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

      baseController.findById(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async getCount(req: Request, res: Response) {
    try {

      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.databaseConnection.databaseType, req.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

      baseController.getCount(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }
  async update(req: Request, res: Response) {
    try {

      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.databaseConnection.databaseType, req.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

      baseController.update(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async delete(req: Request, res: Response) {
    try {

      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.databaseConnection.databaseType, req.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

      baseController.delete(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {

      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.databaseConnection.databaseType, req.databaseConnection.models["user"]);
      const baseController: BaseController<User> = new BaseController(userService, "User");

      baseController.deleteAll(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async findByUID(req: Request, res: Response) {
    try {

      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.databaseConnection.databaseType, req.databaseConnection.models["user"]);

      const user = await userService.findOne({ UID: req.params.UID });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor. " + error });
    }
  }

}
