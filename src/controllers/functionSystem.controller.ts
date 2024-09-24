import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { FunctionSystemService } from "../services/functionSystem.service";
import { FunctionSystem } from "../models/functionSystem.model";
import { NotFoundError } from "../errors/notFound.error";

export class FunctionSystemController {

  constructor() {

  }

  async create(req: Request, res: Response, next: NextFunction) {

    try {

      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["functionSystem"], req.body.databaseConnection.connection);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

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
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["functionSystem"], req.body.databaseConnection.connection);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

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
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["functionSystem"], req.body.databaseConnection.connection);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

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
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["functionSystem"], req.body.databaseConnection.connection);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

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
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["functionSystem"], req.body.databaseConnection.connection);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

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
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["functionSystem"], req.body.databaseConnection.connection);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

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
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.body.databaseConnection.databaseType, req.body.databaseConnection.models["functionSystem"], req.body.databaseConnection.connection);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}