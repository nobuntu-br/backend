import { BaseResourceModel } from "./baseResource.model";

export interface IDatabasePermission {
  userId?: string;
  tenantId?: string;
  databaseCredentialId?: string;
  isAdmin?: boolean;
  userUID?: string;
}

export class DatabasePermission extends BaseResourceModel implements IDatabasePermission {
  userId?: string;
  tenantId?: string;
  databaseCredentialId?: string;
  isAdmin?: boolean;
  userUID?: string;

  static fromJson(jsonData: any) : DatabasePermission {
    return Object.assign(new DatabasePermission(), jsonData);
  }
}