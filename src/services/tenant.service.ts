import { DbType } from "../adapters/createDb.adapter";
import { Tenant } from "../models/tenant.model";
import { UserTenant } from "../models/userTenant.model";
import TenantRepository from "../repository/tenant.repository";
import UserTenantRepository from "../repository/userTenant.repository";
import BaseService from "./base.service";

export default class TenantService extends BaseService<Tenant> {
  private tenantRepository: TenantRepository;
  private userTenantRepository: UserTenantRepository;

  constructor(dbType: DbType, model: any, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository : TenantRepository = new TenantRepository(dbType, model, databaseConnection);
    super(repository, dbType, model, databaseConnection);

    this.tenantRepository = repository;

    var userTenantRepository: UserTenantRepository = new UserTenantRepository(dbType, "userTenant", databaseConnection);
    this.userTenantRepository = userTenantRepository;
  }

  /**
   * Retorna os tenants que o usuário é administrador
   * @param {*} userUID identificador universal do usuário
   * @returns "True" caso usuário for adminitrador, caso contrário, retorna "False"
   */
  async findTenantsUserIsAdmin(userUID: string): Promise<Tenant[]> {
    try {
      const userTenantsUserIsAdmin : UserTenant[] | null = await this.userTenantRepository.findMany({UserUID: userUID, isAdmin: true});

      if(userTenantsUserIsAdmin == null){
        throw new Error("O usuário não tem nenhum tenant que é administrador");
      }

      const tenantsUserIsAdmin : Tenant[] = [];

      //TODO tirar isso e fazer em uma query só
      userTenantsUserIsAdmin.forEach(async (userTenantUserIsAdmin : UserTenant) => {
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