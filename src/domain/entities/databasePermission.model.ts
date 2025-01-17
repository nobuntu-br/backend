import { BaseResourceModel } from "./baseResource.model";
import { DatabaseCredential } from "./databaseCredential.model";
import { Tenant } from "./tenant.model";
import { User } from "./user.model";

export interface IDatabasePermissionDatabaseModel extends BaseResourceModel{
  userId?: number;
  tenantId?: number;
  databaseCredentialId?: number;
  isAdmin?: boolean;
  userUID?: string;
}

export interface IDatabasePermission extends BaseResourceModel{
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

  constructor(data: IDatabasePermission){
    super();
    this.id = data.id;
    this.user = data.user;
    this.tenant = data.tenant;
    this.databaseCredential = data.databaseCredential;
    this.isAdmin = data.isAdmin;
    this.userUID = data.userUID;

  }

  static fromJson(jsonData: any) : DatabasePermission {
    return new DatabasePermission(jsonData);
  }
}