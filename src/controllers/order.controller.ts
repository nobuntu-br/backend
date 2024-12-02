import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import OrderService from "../services/order.service";
import { Order } from "../models/order.model";
import { NotFoundError } from "../errors/notFound.error";

export class OrderController {

  async create(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.databaseConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const orderService: OrderService = new OrderService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Order> = new BaseController(orderService, "Order");

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
      const orderService: OrderService = new OrderService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Order> = new BaseController(orderService, "Order");

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
      const orderService: OrderService = new OrderService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Order> = new BaseController(orderService, "Order");

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
      const orderService: OrderService = new OrderService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Order> = new BaseController(orderService, "Order");

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
      const orderService: OrderService = new OrderService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Order> = new BaseController(orderService, "Order");

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
      const orderService: OrderService = new OrderService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Order> = new BaseController(orderService, "Order");

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
      const orderService: OrderService = new OrderService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Order> = new BaseController(orderService, "Order");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}