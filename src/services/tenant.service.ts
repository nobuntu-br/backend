import { DatabaseType } from "../adapters/createDb.adapter";
import { ITenant, Tenant } from "../models/tenant.model";
import { DatabasePermission } from "../models/databasePermission.model";
import TenantRepository from "../repositories/tenant.repository";
import DatabasePermissionRepository from "../repositories/databasePermission.repository";
import BaseService from "./base.service";

export default class TenantService extends BaseService<Tenant> {
  private tenantRepository: TenantRepository;
  private databasePermissionRepository: DatabasePermissionRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository : TenantRepository = new TenantRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

    this.tenantRepository = repository;

    var databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(databaseType, databaseConnection);
    this.databasePermissionRepository = databasePermissionRepository;
  }

  /**
   * Retorna os tenants que o usuário é administrador
   * @param {*} userUID identificador universal do usuário
   * @returns "True" caso usuário for adminitrador, caso contrário, retorna "False"
   */
  async findTenantsUserIsAdmin(userUID: string): Promise<ITenant[]> {
    try {
      const userTenantsUserIsAdmin : DatabasePermission[] | null = await this.databasePermissionRepository.findMany({userUID: userUID, isAdmin: true});

      if(userTenantsUserIsAdmin == null){
        throw new Error("O usuário não tem nenhum tenant que é administrador");
      }

      const tenantsUserIsAdmin : Tenant[] = [];

      //TODO tirar isso e fazer em uma query só
      userTenantsUserIsAdmin.forEach(async (userTenantUserIsAdmin : DatabasePermission) => {
        const _tenantUserIsAdmin = await this.tenantRepository.findOne({id: userTenantUserIsAdmin.id})

        if(_tenantUserIsAdmin != null){
          tenantsUserIsAdmin.push(_tenantUserIsAdmin);
        }
      });

      return tenantsUserIsAdmin;

    } catch (error) {
      throw error;
    }
  }

}