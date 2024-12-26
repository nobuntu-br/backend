import { FunctionSystemRole, IFunctionSystemRoleDatabaseModel } from "../models/functionSystemRole.model";
import TenantConnection from "../models/tenantConnection.model";
import FunctionSystemRoleRepository from "../repositories/functionSystemRole.repository";
import BaseService from "./base.service";

export class FunctionSystemRoleService extends BaseService<IFunctionSystemRoleDatabaseModel, FunctionSystemRole> {
  private functionSystemRoleRepository: FunctionSystemRoleRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: FunctionSystemRoleRepository = new FunctionSystemRoleRepository(tenantConnection);
    super(repository, tenantConnection);

    this.functionSystemRoleRepository = repository;

  }


  async isPublicRoute(method: string, url: string): Promise<boolean> {
    try {
      return await this.functionSystemRoleRepository.isPublicRoute(method, url);
    } catch (error) {
      throw new Error("Erro no método de verificação se a rota é pública")
    }
  }

}