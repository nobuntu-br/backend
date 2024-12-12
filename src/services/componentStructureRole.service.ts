import { ComponentStructureRole, IComponentStructureRoleDatabaseModel } from "../models/componentStructureRole.model";
import TenantConnection from "../models/tenantConnection.model";
import ComponentStructureRoleRepository from "../repositories/componentStructureRole.repository";
import BaseService from "./base.service";

export class ComponentStructureRoleService extends BaseService<IComponentStructureRoleDatabaseModel, ComponentStructureRole> {
  private componentStructureRoleRepository: ComponentStructureRoleRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: ComponentStructureRoleRepository = new ComponentStructureRoleRepository(tenantConnection);
    super(repository, tenantConnection);

    this.componentStructureRoleRepository = repository;

  }

}