import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { NotFoundError } from "../../../errors/notFound.error";
import { IFunctionSystem, FunctionSystem } from "../../../domain/entities/functionSystem.model";
import FunctionSystemRepository from "../../../domain/repositories/functionSystem.repository";

export class FunctionSystemController {

  constructor() {

  }

  async create(req: Request, res: Response, next: NextFunction) {

    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemRepository: FunctionSystemRepository = new FunctionSystemRepository(req.body.tenantConnection);
      const baseController: BaseController<IFunctionSystem, FunctionSystem> = new BaseController(functionSystemRepository, "FunctionSystem");

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
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemRepository: FunctionSystemRepository = new FunctionSystemRepository(req.body.tenantConnection);
      const baseController: BaseController<IFunctionSystem, FunctionSystem> = new BaseController(functionSystemRepository, "FunctionSystem");

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
      const functionSystemRepository: FunctionSystemRepository = new FunctionSystemRepository(req.body.tenantConnection);
      const baseController: BaseController<IFunctionSystem, FunctionSystem> = new BaseController(functionSystemRepository, "FunctionSystem");

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
      const functionSystemRepository: FunctionSystemRepository = new FunctionSystemRepository(req.body.tenantConnection);
      const baseController: BaseController<IFunctionSystem, FunctionSystem> = new BaseController(functionSystemRepository, "FunctionSystem");

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
      const functionSystemRepository: FunctionSystemRepository = new FunctionSystemRepository(req.body.tenantConnection);
      const baseController: BaseController<IFunctionSystem, FunctionSystem> = new BaseController(functionSystemRepository, "FunctionSystem");

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
      const functionSystemRepository: FunctionSystemRepository = new FunctionSystemRepository(req.body.tenantConnection);
      const baseController: BaseController<IFunctionSystem, FunctionSystem> = new BaseController(functionSystemRepository, "FunctionSystem");

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
      const functionSystemRepository: FunctionSystemRepository = new FunctionSystemRepository(req.body.tenantConnection);
      const baseController: BaseController<IFunctionSystem, FunctionSystem> = new BaseController(functionSystemRepository, "FunctionSystem");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}