import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import RoleService from "../services/role.service";
import { Role } from "../models/role.model";
import { NotFoundError } from "../errors/notFound.error";

export class RoleController {

  async create(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const roleService: RoleService = new RoleService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Role> = new BaseController(roleService, "Role");

      baseController.create(req, res, next);
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
      const roleService: RoleService = new RoleService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Role> = new BaseController(roleService, "Role");

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
      const roleService: RoleService = new RoleService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Role> = new BaseController(roleService, "Role");

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
      const roleService: RoleService = new RoleService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Role> = new BaseController(roleService, "Role");

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
      const roleService: RoleService = new RoleService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Role> = new BaseController(roleService, "Role");

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
      const roleService: RoleService = new RoleService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Role> = new BaseController(roleService, "Role");

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
      const roleService: RoleService = new RoleService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Role> = new BaseController(roleService, "Role");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}