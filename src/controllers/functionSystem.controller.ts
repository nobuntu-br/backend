import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import TenantConnection from "../models/tenantConnection.model";
import { FunctionSystemService } from "../services/functionSystem.service";
import { FunctionSystem } from "../models/functionSystem.model";

export class FunctionSystemController {

  constructor() {

  }

  async create(req: Request, res: Response) {

    try {

      if(req.databaseConnection == undefined){
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.databaseConnection.databaseType, req.databaseConnection.models["functionSystem"]);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

      baseController.create(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {

      if(req.databaseConnection == undefined){
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.databaseConnection.databaseType, req.databaseConnection.models["functionSystem"]);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

      baseController.findAll(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async findById(req: Request, res: Response) {
    try {

      if(req.databaseConnection == undefined){
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.databaseConnection.databaseType, req.databaseConnection.models["functionSystem"]);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

      baseController.findById(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }

  }

  async getCount(req: Request, res: Response) {
    try {

      if(req.databaseConnection == undefined){
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.databaseConnection.databaseType, req.databaseConnection.models["functionSystem"]);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

      baseController.getCount(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async update(req: Request, res: Response) {
    try {

      if(req.databaseConnection == undefined){
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.databaseConnection.databaseType, req.databaseConnection.models["functionSystem"]);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

      baseController.update(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async delete(req: Request, res: Response) {
    try {

      if(req.databaseConnection == undefined){
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.databaseConnection.databaseType, req.databaseConnection.models["functionSystem"]);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

      baseController.delete(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {

      if(req.databaseConnection == undefined){
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const functionSystemService: FunctionSystemService = new FunctionSystemService(req.databaseConnection.databaseType, req.databaseConnection.models["functionSystem"]);
      const baseController: BaseController<FunctionSystem> = new BaseController(functionSystemService, "FunctionSystem");

      baseController.deleteAll(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }
  }

}