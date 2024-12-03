import { DatabaseType } from "../adapters/createDb.adapter";
import { myCache } from "../config/database.config";
import { DatabasePermission, IDatabasePermission } from "../models/databasePermission.model";
import DatabasePermissionRepository from "../repositories/databasePermission.repository";
import BaseService from "./base.service";

export default class DatabasePermissionService extends BaseService<IDatabasePermission, DatabasePermission> {
  private databasePermissionRepository: DatabasePermissionRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository = new DatabasePermissionRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

    this.databasePermissionRepository = repository;
  }

  async userHasAccessToTenant(userUID: string, tenantId: string): Promise<boolean> {
    try {

      if (this.getUserAcessToTenantOnCache(userUID, tenantId) != null) {
        return true;
      }

      const databasePermission = await this.getTenantsWithDefaultTenantByUserUID(userUID);

      if (databasePermission == null) {
        return false;
      }

      this.saveUserAcessToTenantOnCache(userUID, tenantId, databasePermission);
      return true;

    } catch (error) {
      throw new Error("Erro ao buscar o usuário e os tenants " + error);
    }

  }

  saveUserAcessToTenantOnCache(userUID: string, tenantId: string, databasePermission: Object) {
    try {
      myCache.set(userUID + tenantId, databasePermission);
    } catch (error) {
      console.warn(error);
      throw new Error("Erro ao salvar databasePermission no cache")
    }
  }

  getUserAcessToTenantOnCache(userUID: string, tenantId: string): string | null {
    //TODO se não encontrar nada do cache, retornar null
    return myCache.get(userUID + tenantId);
  }

  //TODO  um usuário X que deve ser administrador do tenant pode alterar quais usuários tem permissão no tenant. Ao ter feito alguma alteração, tem que ser alterado no cache.
  //TODO fazer a função que verifica se o usuário é admin do tenant para poder alterar a permissão dos outros ao tenant
  //TODO permitir o usuário passar o cargo de admin pra outra pessoa

  async getTenantsWithDefaultTenantByUserUID(UserUID: string){
    try {
      return this.databasePermissionRepository.getTenantsWithDefaultTenantByUserUID(UserUID);
    } catch (error) {
      throw new Error("Erro ao obter userTenants com o tenant padrão");
    }
  }

}