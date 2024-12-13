import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { UserService } from "../services/user.service";
import { IUser, User } from "../models/user.model";
import { NotFoundError } from "../errors/notFound.error";
import { CheckEmailExistUseCase } from "../useCases/user/checkEmailExist.useCase";
import { AzureADService } from "../services/azureAD.service";

export class UserController {

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userService, "User");

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
      const userService: UserService = new UserService(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userService, "User");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async findByUID(req: Request, res: Response) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userService: UserService = new UserService(req.body.tenantConnection);

      const user = await userService.findOne({ UID: req.params.UID });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor. " + error });
    }
  }

  /**
   * Cria o usuário dentro do banco de dados da aplicação da empresa
   */
  async createUserForSpecificTenant(req: Request, res: Response, next: NextFunction){
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      
      throw new Error("Função não finalizada");
      
      // return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserImage(){

  }
 
}