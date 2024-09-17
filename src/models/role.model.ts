import { BaseResourceModel } from "./base-resource.model";

interface IRole {
  name?: string;
}

export class Role extends BaseResourceModel implements IRole {
  name?: string;

  static fromJson(jsonData: any) : Role {
    return Object.assign(new Role(), jsonData);
  }
}