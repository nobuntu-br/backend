import DatabasePermissionRepository from "../repositories/databasePermission.repository";
import { DatabasePermissionDetailOutputDTO } from "../../useCases/tenant/getUserTenants.useCase";
import BaseService from "./base.service";
import { TenantConnectionService } from "./tenantConnection.service";
import { IDatabasePermissionDatabaseModel, DatabasePermission } from "../entities/databasePermission.model";
import TenantConnection from "../entities/tenantConnection.model";

export default class DatabasePermissionService extends BaseService<IDatabasePermissionDatabaseModel, DatabasePermission> {
  private databasePermissionRepository: DatabasePermissionRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: DatabasePermissionRepository = new DatabasePermissionRepository(tenantConnection);
    super(repository, tenantConnection);

    this.databasePermissionRepository = repository;

  }

  async userHasAccessToTenant(userUID: string, tenantId: number): Promise<boolean> {
    try {

      const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;

      return tenantConnectionService.checkUserPermissionTenant(userUID, tenantId);

    } catch (error) {
      throw new Error("Erro ao buscar o usuário e os tenants " + error);
    }

  }

  //TODO  um usuário X que deve ser administrador do tenant pode alterar quais usuários tem permissão no tenant. Ao ter feito alguma alteração, tem que ser alterado no cache.
  //TODO fazer a função que verifica se o usuário é admin do tenant para poder alterar a permissão dos outros ao tenant
  //TODO permitir o usuário passar o cargo de admin pra outra pessoa

  async getTenantsWithDefaultTenantByUserUID(UserUID: string) {
    try {
      return this.databasePermissionRepository.getTenantsUserHasAccess(UserUID);
    } catch (error) {
      throw new Error("Erro ao obter userTenants com o tenant padrão");
    }
  }

  async saveDatabasePermissionsOnMemory() {
    const usersPermissions : DatabasePermissionDetailOutputDTO[] = await this.databasePermissionRepository.getTenantsUsersHasAccess();
    
    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;
    tenantConnectionService.permissions = usersPermissions;
  }

}