import { DatabaseType } from "../adapters/createDb.adapter";
import { FunctionSystemRole } from "../models/functionSystemRole.model";
import FunctionSystemRoleRepository from "../repositories/functionSystemRole.repository";
import BaseService from "./base.service";

export class FunctionSystemRoleService extends BaseService<FunctionSystemRole> {
  private functionSystemRoleRepository: FunctionSystemRoleRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: FunctionSystemRoleRepository = new FunctionSystemRoleRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

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