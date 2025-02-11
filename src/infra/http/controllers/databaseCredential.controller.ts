import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { NotFoundError } from "../../../errors/notFound.error";
import { RegisterDatabaseCredentialUseCase } from "../../../useCases/tenant/registerDatabaseCredential.useCase";
import { IDatabaseCredentialDatabaseModel, DatabaseCredential } from "../../../domain/entities/databaseCredential.model";
import DatabaseCredentialRepository from "../../../domain/repositories/databaseCredential.repository";
import UserTenantRepository from "../../../domain/repositories/databasePermission.repository";
import UserRepository from "../../../domain/repositories/user.repository";
import TenantConnection from "../../../domain/entities/tenantConnection.model";


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
      const registerDatabaseCredentialUseCase: RegisterDatabaseCredentialUseCase = new RegisterDatabaseCredentialUseCase(tenantCredentialRepository, userTenantRepository, userRepository);

      const data = await registerDatabaseCredentialUseCase.execute({
        databaseCredential: new DatabaseCredential({
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
        }),
        tenantId: req.body.tenantId,
        userUID: req.body.userUID
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

      const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(req.body.tenantConnection as TenantConnection); 

      const baseController: BaseController<IDatabaseCredentialDatabaseModel, DatabaseCredential> = new BaseController(databaseCredentialRepository, "DatabaseCredential");

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
      const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(req.body.tenantConnection as TenantConnection); 

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredentialDatabaseModel, DatabaseCredential> = new BaseController(databaseCredentialRepository, "DatabaseCredential");

      baseController.findById(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async findByTenantId(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(req.body.tenantConnection as TenantConnection); 

      //Quem pode pegar esse dado? só o gerenciador desse tenant (o dono do tenant)

      const data = await databaseCredentialRepository.advancedSearches.getDatabaseCredentialByTenantId(req.body.tenantId, req.body.userId);

      return res.status(200).send(data);
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
      const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(req.body.tenantConnection as TenantConnection); 

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredentialDatabaseModel, DatabaseCredential> = new BaseController(databaseCredentialRepository, "DatabaseCredential");

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
      const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(req.body.tenantConnection as TenantConnection); 

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredentialDatabaseModel, DatabaseCredential> = new BaseController(databaseCredentialRepository, "DatabaseCredential");

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
      const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(req.body.tenantConnection as TenantConnection); 

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredentialDatabaseModel, DatabaseCredential> = new BaseController(databaseCredentialRepository, "DatabaseCredential");

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
      const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(req.body.tenantConnection as TenantConnection); 

      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IDatabaseCredentialDatabaseModel, DatabaseCredential> = new BaseController(databaseCredentialRepository, "DatabaseCredential");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}