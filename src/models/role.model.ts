import { BaseResourceModel } from "./baseResource.model";

export interface IRole extends BaseResourceModel{
  name?: string;
}

export class Role extends BaseResourceModel implements IRole {
  name?: string;

  static fromJson(jsonData: any) : Role {
    return Object.assign(new Role(), jsonData);
  }
}