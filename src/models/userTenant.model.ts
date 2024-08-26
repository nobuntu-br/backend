import { BaseResourceModel } from "./base-resource.model";

export interface IUserTenant {
  UserId?: string;
  TenantId?: string;
  TenantCredentialId?: string;
  isAdmin?: boolean;
}

export class UserTenant extends BaseResourceModel implements IUserTenant {
  UserId?: string;
  TenantId?: string;
  TenantCredentialId?: string;
  isAdmin?: boolean;

  static fromJson(jsonData: any) : UserTenant {
    return Object.assign(new UserTenant(), jsonData);
  }
}