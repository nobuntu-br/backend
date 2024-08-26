import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import TenantService from "../services/tenant.service";
import { Tenant } from "../models/tenant.model";
import TenantConnection from "../models/tenantConnection.model";
import UserTenantService from "../services/userTenant.service";

export class TenantController {

  async create(req: Request, res: Response) {

    try {

      if(req.databaseConnection == undefined){
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      //O Service será criado com base no tipo de banco de dados e o model usado
      const tenantService: TenantService = new TenantService(req.databaseConnection.databaseType, req.databaseConnection.models["tenant"]);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Tenant> = new BaseController(tenantService, "Tenant");

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
      const tenantService: TenantService = new TenantService(req.databaseConnection.databaseType, req.databaseConnection.models["tenant"]);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Tenant> = new BaseController(tenantService, "Tenant");

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
      const tenantService: TenantService = new TenantService(req.databaseConnection.databaseType, req.databaseConnection.models["tenant"]);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Tenant> = new BaseController(tenantService, "Tenant");

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
      const tenantService: TenantService = new TenantService(req.databaseConnection.databaseType, req.databaseConnection.models["tenant"]);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Tenant> = new BaseController(tenantService, "Tenant");

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
      const tenantService: TenantService = new TenantService(req.databaseConnection.databaseType, req.databaseConnection.models["tenant"]);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Tenant> = new BaseController(tenantService, "Tenant");

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
      const tenantService: TenantService = new TenantService(req.databaseConnection.databaseType, req.databaseConnection.models["tenant"]);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Tenant> = new BaseController(tenantService, "Tenant");

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
      const tenantService: TenantService = new TenantService(req.databaseConnection.databaseType, req.databaseConnection.models["tenant"]);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<Tenant> = new BaseController(tenantService, "Tenant");

      baseController.deleteAll(req, res);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
    }

  }

  async findByUserUID(req: Request, res: Response) {
    try {

      if (req.databaseConnection == undefined) {
        console.warn("Erro ao obter dados da conexão com tenant");
        return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor" });
      }

      const userTenantService: UserTenantService = new UserTenantService(req.databaseConnection.databaseType, req.databaseConnection.models["userTenant"]);

      const tenants = await userTenantService.findMany({UserUID: req.params.UID});

      if (tenants == null) {
        return res.status(404).json({ message: 'Usuário não possui tenant que pode acessar' });
      }
      return res.status(200).send(tenants);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor. " + error });
    }
  }
}