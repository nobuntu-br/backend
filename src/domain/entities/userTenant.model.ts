import { BaseResourceModel } from "./baseResource.model";
import { Role } from "./role.model";
import { User } from "./user.model";

export interface IUserTenantDatabaseModel extends BaseResourceModel{
  tenantId?: number;
  userId?: number;
  roleId?: number;
}

export interface IUserTenant extends BaseResourceModel{
  tenant: Tenant | number;
  user: User | number;
  role: Role | number;
}

/**
 * Classe que faz o controle de permissão que o usuário tem ao Tenant
 */
export class Tenant extends BaseResourceModel implements IUserTenant {
  tenant: Tenant | number;
  user: User | number;
  role: Role | number;

  constructor(data: IUserTenant){
    super();
    this.id = data.id;
    this.tenant = data.tenant;
    this.user = data.user;
    this.role = data.role;
  }

  static fromJson(jsonData: any): Tenant {
    return new Tenant(jsonData);
  }
}