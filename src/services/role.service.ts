import { IRole, Role } from "../models/role.model";
import TenantConnection from "../models/tenantConnection.model";
import RoleRepository from "../repositories/role.repository";
import BaseService from "./base.service";

export default class RoleService extends BaseService<IRole, Role> {
  private roleRepository: RoleRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: RoleRepository = new RoleRepository(tenantConnection);
    super(repository, tenantConnection);

    this.roleRepository = repository;

  }

}