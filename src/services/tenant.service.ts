import { ITenant, Tenant } from "../models/tenant.model";
import TenantRepository from "../repositories/tenant.repository";
import DatabasePermissionRepository from "../repositories/databasePermission.repository";
import BaseService from "./base.service";
import TenantConnection from "../models/tenantConnection.model";

export default class TenantService extends BaseService<ITenant, Tenant> {
  private tenantRepository: TenantRepository;
  private databasePermissionRepository: DatabasePermissionRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: TenantRepository = new TenantRepository(tenantConnection);
    super(repository, tenantConnection);

    this.tenantRepository = repository;

    var databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(tenantConnection);
    this.databasePermissionRepository = databasePermissionRepository;

  }

  /**
   * Retorna os tenants que o usuário é administrador
   * @param {*} userUID identificador universal do usuário
   * @returns "True" caso usuário for adminitrador, caso contrário, retorna "False"
   */
  async findTenantsUserIsAdmin(userUID: string): Promise<Tenant[]> {
    return this.databasePermissionRepository.findTenantsUserIsAdmin(userUID);
  }

}