import { DatabaseType } from "../adapters/createDb.adapter";
import { ComponentStructureRole } from "../models/componentStructureRole.model";
import ComponentStructureRoleRepository from "../repositories/componentStructureRole.repository";
import BaseService from "./base.service";

export class ComponentStructureRoleService extends BaseService<ComponentStructureRole> {
  private componentStructureRoleRepository: ComponentStructureRoleRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository: ComponentStructureRoleRepository = new ComponentStructureRoleRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

    this.componentStructureRoleRepository = repository;
  }

}