import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { DatabaseCredentialService } from "../services/databaseCredential.service";
import { DatabaseCredential, IDatabaseCredential } from "../models/databaseCredential.model";
import { RegisterTenantCredentialUseCase } from "../useCases/tenant/registerTenantCredential.useCase";
import { NotFoundError } from "../errors/notFound.error";
import DatabaseCredentialRepository from "../repositories/databaseCredential.repository";
import UserTenantRepository from "../repositories/databasePermission.repository";
import UserRepository from "../repositories/user.repository";


export class DatabaseCredentialController {

  async create(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const tenantCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(req.body.tenantConnection);
      const userTenantRepository: UserTenantRepository = new UserTenantRepository(req.body.tenantConnection);
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);

      //Use case para realizar operações mais complexas
      const registerTenantCredentialUseCase: RegisterTenantCredentialUseCase = new RegisterTenantCredentialUseCase(tenantCredentialRepository, userTenantRepository, userRepository);

      const data = await registerTenantCredentialUseCase.execute({
        name: req.body.databaseName,
        type: req.body.databaseType,
        username: req.body.databaseUsername,
        password: req.body.databasePassword,
        host: req.body.databaseHost,
        port: req.body.databasePort,
        srvEnabled: req.body.srvEnabled,
        options: req.body.options,
        storagePath: req.body.storagePath,
        sslEnabled: req.body.sslEnabled,
        poolSize: req.body.poolSize,
        timeOutTime: req.body.timeOutTime,
        //SSL data
        sslCertificateAuthority: req.body.sslCertificateAuthority,
        sslPrivateKey: req.body.sslPrivateKey,
        sslCertificate: req.body.sslCertificate
      });

      return res.status(200).send(data);

    } catch (error) {
      next(error);
    }

  }

  async findAll(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: DatabaseCredentialService = new DatabaseCredentialService(req.body.tenantConnection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredential, DatabaseCredential> = new BaseController(tenantCredentialService, "DatabaseCredential");

      baseController.findAll(req, res, next);
    } catch (error) {
      next(error);
    }

  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: DatabaseCredentialService = new DatabaseCredentialService(req.body.tenantConnection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredential, DatabaseCredential> = new BaseController(tenantCredentialService, "DatabaseCredential");

      baseController.findById(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: DatabaseCredentialService = new DatabaseCredentialService(req.body.tenantConnection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredential, DatabaseCredential> = new BaseController(tenantCredentialService, "DatabaseCredential");

      baseController.getCount(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: DatabaseCredentialService = new DatabaseCredentialService(req.body.tenantConnection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredential, DatabaseCredential> = new BaseController(tenantCredentialService, "DatabaseCredential");

      baseController.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: DatabaseCredentialService = new DatabaseCredentialService(req.body.tenantConnection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredential, DatabaseCredential> = new BaseController(tenantCredentialService, "DatabaseCredential");

      baseController.delete(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async deleteAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantCredentialService: DatabaseCredentialService = new DatabaseCredentialService(req.body.tenantConnection);

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredential, DatabaseCredential> = new BaseController(tenantCredentialService, "DatabaseCredential");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}