import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { RegisterTenantPermissionUseCase } from "../../../useCases/tenant/registerTenantPermission.useCase";
import { NotFoundError } from "../../../errors/notFound.error";
import { IDatabasePermission, DatabasePermission } from "../../../domain/entities/databasePermission.model";
import DatabasePermissionRepository from "../../../domain/repositories/databasePermission.repository";
import TenantConnection from "../../../domain/entities/tenantConnection.model";

export class DatabasePermissionController {

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      const registerTenantPermissionUseCase : RegisterTenantPermissionUseCase = new RegisterTenantPermissionUseCase();

      const registeredUserTenant : IDatabasePermission  = await registerTenantPermissionUseCase.execute({
        tenantId: req.body.tenantId,
        databaseCredentialId: req.body.databaseCredentialId,
        userId: req.body.userId
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
      
      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection as TenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionRepository, "DatabasePermission");

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
      
      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection as TenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionRepository, "DatabasePermission");

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
      
      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection as TenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionRepository, "DatabasePermission");

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
      
      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection as TenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionRepository, "DatabasePermission");

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
      
      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection as TenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionRepository, "DatabasePermission");

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
      
      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection as TenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionRepository, "DatabasePermission");

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
      
      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection as TenantConnection);
      const baseController: BaseController<IDatabasePermission, DatabasePermission>  = new BaseController(databasePermissionRepository, "DatabasePermission");

      baseController.findAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}