import { BaseResourceModel } from "./base-resource.model";

interface ITenant {
  name?: string;
}

export class Tenant extends BaseResourceModel implements ITenant {
  name?: string;

  static fromJson(jsonData: any): Tenant {
    return Object.assign(new Tenant(), jsonData);
  }
}