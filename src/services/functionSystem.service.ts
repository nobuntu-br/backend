import { DatabaseType } from "../adapters/createDb.adapter";
import { FunctionSystem, IFunctionSystem } from "../models/functionSystem.model";
import TenantConnection from "../models/tenantConnection.model";
import FunctionSystemRepository from "../repositories/functionSystem.repository";
import BaseService from "./base.service";

export class FunctionSystemService extends BaseService<IFunctionSystem, FunctionSystem> {
  private functionSystemRepository: FunctionSystemRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: FunctionSystemRepository = new FunctionSystemRepository(tenantConnection);
    super(repository, tenantConnection);

    this.functionSystemRepository = repository;

  }

}