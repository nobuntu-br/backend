import { DbType } from "../adapters/createDb.adapter";
import { ComponentStructureRole } from "../models/componentStructureRole.model";
import ComponentStructureRoleRepository from "../repository/componentStructureRole.repository";
import BaseService from "./base.service";

export class ComponentStructureRoleService extends BaseService<ComponentStructureRole> {
  private componentStructureRoleRepository: ComponentStructureRoleRepository;

  constructor(dbType: DbType, model: any, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: ComponentStructureRoleRepository = new ComponentStructureRoleRepository(dbType, model, databaseConnection);
    super(repository, dbType, model, databaseConnection);

    this.componentStructureRoleRepository = repository;
  }

}