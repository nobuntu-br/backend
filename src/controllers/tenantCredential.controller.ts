import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { TenantCredentialService } from "../services/tenantCredential.service";
import { TenantCredential } from "../models/tenantCredential.model";
import { RegisterTenantCredentialUseCase } from "../useCases/tenant/registerTenantCredential.useCase";
import { NotFoundError } from "../errors/notFound.error";

export class TenantCredentialController {

  async create(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["tenantCredential"], req.body.databaseConnection.connection);
      //Use case para realizar operações mais complexas
      const registerTenantCredentialUseCase: RegisterTenantCredentialUseCase = new RegisterTenantCredentialUseCase(tenantCredentialService);

      const data = await registerTenantCredentialUseCase.execute({
        dbName: req.body.dbName,
        dbType: req.body.dbType,
        dbUsername: req.body.dbUsername,
        dbPassword: req.body.dbPassword,
        dbHost: req.body.dbHost,
        dbPort: req.body.dbPort,
      });

      return res.status(200).send(data);

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
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["tenantCredential"], req.body.databaseConnection.connection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

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
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["tenantCredential"], req.body.databaseConnection.connection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

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
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["tenantCredential"], req.body.databaseConnection.connection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

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
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["tenantCredential"], req.body.databaseConnection.connection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

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
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["tenantCredential"], req.body.databaseConnection.connection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

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
      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["tenantCredential"], req.body.databaseConnection.connection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<TenantCredential> = new BaseController(tenantCredentialService, "TenantCredential");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}