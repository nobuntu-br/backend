import { BaseResourceModel } from "./base-resource.model";

export interface IUserTenant {
  UserId?: string;
  TenantId?: string;
  TenantCredentialId?: string;
  isAdmin?: boolean;
  UserUID?: string;
}

/**
 * Classe responsável pelo controle de acesso entre o User ao Tenant com o uso de um TenantCredential
 */
export class UserTenant extends BaseResourceModel implements IUserTenant {
  UserId?: string;
  TenantId?: string;
  TenantCredentialId?: string;
  isAdmin?: boolean;
  UserUID?: string;

  static fromJson(jsonData: any) : UserTenant {
    return Object.assign(new UserTenant(), jsonData);
  }
}