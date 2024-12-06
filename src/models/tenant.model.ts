import { BaseResourceModel } from "./baseResource.model";

export interface ITenantDatabaseModel extends BaseResourceModel{
  name?: string;
}

export interface ITenant extends BaseResourceModel{
  name?: string;
}

export class Tenant extends BaseResourceModel implements ITenant {
  name?: string;

  static fromJson(jsonData: any): Tenant {
    return Object.assign(new Tenant(), jsonData);
  }
}