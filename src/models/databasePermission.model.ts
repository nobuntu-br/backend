import { BaseResourceModel } from "./baseResource.model";
import { DatabaseCredential } from "./databaseCredential.model";
import { Tenant } from "./tenant.model";
import { User } from "./user.model";

export interface IDatabasePermissionDatabaseModel {
  userId?: number;
  tenantId?: number;
  databaseCredentialId?: number;
  isAdmin?: boolean;
  userUID?: string;
}

export interface IDatabasePermission {
  user?: User | number;
  tenant?: Tenant | number;
  databaseCredential?: DatabaseCredential | number;
  isAdmin?: boolean;
  userUID?: string;
}

export class DatabasePermission extends BaseResourceModel implements IDatabasePermission {
  user?: User | number;
  tenant?: Tenant | number;
  databaseCredential?: DatabaseCredential | number;
  isAdmin?: boolean;
  userUID?: string;

  static fromJson(jsonData: any) : DatabasePermission {
    return Object.assign(new DatabasePermission(), jsonData);
  }
}