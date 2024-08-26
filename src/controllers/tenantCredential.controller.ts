import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { TenantCredentialService } from "../services/tenantCredential.service";
import { TenantCredential } from "../models/tenantCredential.model";
import { RegisterTenantCredentialUseCase } from "../useCases/registerTenantCredential/registerTenantCredential.useCase";

export class TenantCredentialController {

  async create(req: Request, res: Response) {

    try {
      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.databaseConnection.databaseType, req.databaseConnection.models["tenantCredential"]);
      //Use case para realizar operações mais complexas
      const registerTenantCredentialUseCase: RegisterTenantCredentialUseCase = new RegisterTenantCredentialUseCase(tenantCredentialService);

      const data = await registerTenantCredentialUseCase.execute(req.body);
      return res.status(200).send(data);

    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Ocorreu um erro de servidor ao tentar salvar o tenant." });
    }

  }

  async findAll(req: Request, res: Response) {

    try {
      if (req.databaseConnection == undefined) {
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.databaseConnection.databaseType, req.databaseConnection.models["tenantCredential"]);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

      baseController.findAll(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }

  }

  async findById(req: Request, res: Response) {
    try {
      if (req.databaseConnection == undefined) {
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.databaseConnection.databaseType, req.databaseConnection.models["tenantCredential"]);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

      baseController.findById(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }   
  }

  async getCount(req: Request, res: Response) {
    try {
      if (req.databaseConnection == undefined) {
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.databaseConnection.databaseType, req.databaseConnection.models["tenantCredential"]);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

      baseController.getCount(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (req.databaseConnection == undefined) {
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.databaseConnection.databaseType, req.databaseConnection.models["tenantCredential"]);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

      baseController.update(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (req.databaseConnection == undefined) {
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.databaseConnection.databaseType, req.databaseConnection.models["tenantCredential"]);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

      baseController.delete(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      if (req.databaseConnection == undefined) {
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.databaseConnection.databaseType, req.databaseConnection.models["tenantCredential"]);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

      baseController.deleteAll(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

}