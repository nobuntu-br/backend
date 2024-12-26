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

  constructor(input: IDatabasePermission){
    super();
    this.id = input.id;
    this.user = input.user;
    this.tenant = input.tenant;
    this.databaseCredential = input.databaseCredential;
    this.isAdmin = input.isAdmin;
    this.userUID = input.userUID;
  }

  static fromJson(jsonData: any) : DatabasePermission {
    return new DatabasePermission(jsonData);
  }
}