import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RegisterTenantPermissionUseCase } from "../useCases/tenant/registerTenantPermission.useCase";
import { DatabasePermission, IDatabasePermission } from "../models/databasePermission.model";
import { NotFoundError } from "../errors/notFound.error";
import DatabasePermissionRepository from "../repositories/databasePermission.repository";
import UserRepository from "../repositories/user.repository";
import DatabasePermissionService from "../services/databasePermission.service";


export class DatabasePermissionController {

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection);
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const registerTenantPermissionUseCase : RegisterTenantPermissionUseCase = new RegisterTenantPermissionUseCase(databasePermissionRepository, userRepository);

      const registeredUserTenant : IDatabasePermission  = await registerTenantPermissionUseCase.execute({
        tenant: req.body.tenant,
        databaseCredential: req.body.databaseCredential,
        userUID: req.body.UID
      });

      res.status(200).send(registeredUserTenant);

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
      const databasePermissionService: DatabasePermissionService = new DatabasePermissionService(req.body.tenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionService, "DatabasePermission");

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
      const databasePermissionService: DatabasePermissionService = new DatabasePermissionService(req.body.tenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionService, "DatabasePermission");

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
      const databasePermissionService: DatabasePermissionService = new DatabasePermissionService(req.body.tenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionService, "DatabasePermission");

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
      const databasePermissionService: DatabasePermissionService = new DatabasePermissionService(req.body.tenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionService, "DatabasePermission");

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
      const databasePermissionService: DatabasePermissionService = new DatabasePermissionService(req.body.tenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionService, "DatabasePermission");

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
      const databasePermissionService: DatabasePermissionService = new DatabasePermissionService(req.body.tenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionService, "DatabasePermission");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async executeQuery(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const databasePermissionService: DatabasePermissionService = new DatabasePermissionService(req.body.tenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionService, "DatabasePermission");

      baseController.findAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}