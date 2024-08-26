import { DbType } from "../adapters/createDb.adapter";
import { FunctionSystemRole } from "../models/functionSystemRole.model";
import FunctionSystemRoleRepository from "../repository/functionSystemRole.repository";
import BaseService from "./base.service";

export class FunctionSystemRoleService extends BaseService<FunctionSystemRole> {
  private functionSystemRoleRepository: FunctionSystemRoleRepository;

  constructor(dbType: DbType, model: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: FunctionSystemRoleRepository = new FunctionSystemRoleRepository(dbType, model);
    super(repository, dbType, model);

    this.functionSystemRoleRepository = repository;
  }

  async isUserHaveAccessToRoute(userOID: string, method: string, route: string): Promise<boolean | null> {
    try {
      return await this.functionSystemRoleRepository.isUserHaveAccessToRoute(userOID, method, route, this.dbType);
    } catch (error) {
      throw new Error("Erro no método de verificação se a rota é pública")
    }
  }

}