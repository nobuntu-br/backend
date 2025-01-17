import { BaseResourceModel } from "./baseResource.model";

export interface ITenantDatabaseModel extends BaseResourceModel{
  name?: string;
}

export interface ITenant extends BaseResourceModel{
  name?: string;
}

export class Tenant extends BaseResourceModel implements ITenant {
  name?: string;

  constructor(data: ITenant){
    super();
    this.id = data.id;
    this.name = data.name;
  }

  static fromJson(jsonData: any): Tenant {
    return new Tenant(jsonData);
  }
}