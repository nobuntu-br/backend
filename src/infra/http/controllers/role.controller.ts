import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { NotFoundError } from "../../../errors/notFound.error";
import { IRole, Role } from "../../../domain/entities/role.model";
import TenantConnection from "../../../domain/entities/tenantConnection.model";
import RoleRepository from "../../../domain/repositories/role.repository";

export class RoleController {

  async create(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const roleRepository: RoleRepository = new RoleRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IRole, Role> = new BaseController(roleRepository, "Role");

      baseController.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      
      const roleRepository: RoleRepository = new RoleRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IRole, Role> = new BaseController(roleRepository, "Role");

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

      
      const roleRepository: RoleRepository = new RoleRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IRole, Role> = new BaseController(roleRepository, "Role");

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

      
      const roleRepository: RoleRepository = new RoleRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IRole, Role> = new BaseController(roleRepository, "Role");

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

      
      const roleRepository: RoleRepository = new RoleRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IRole, Role> = new BaseController(roleRepository, "Role");

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

      
      const roleRepository: RoleRepository = new RoleRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IRole, Role> = new BaseController(roleRepository, "Role");

      baseController.delete(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async findAllByUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      
      const roleRepository: RoleRepository = new RoleRepository(req.body.tenantConnection as TenantConnection);

      const userId = parseInt(req.query.userId as string || "0");
      res.status(200).json(await roleRepository.getUserRoles(userId));
    }
    catch (error) {
      next(error);
    }
  }


  async deleteAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      
      const roleRepository: RoleRepository = new RoleRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<IRole, Role> = new BaseController(roleRepository, "Role");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}