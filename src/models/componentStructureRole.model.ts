import { BaseResourceModel } from "./base-resource.model";

export interface IComponentStructureRole {
  RoleId?: string;
  ComponentStructureId?: string;
}

export class ComponentStructureRole extends BaseResourceModel implements IComponentStructureRole {
  RoleId?: string;
  ComponentStructureId?: string;

  static fromJson(jsonData: any) : ComponentStructureRole {
    return Object.assign(new ComponentStructureRole(), jsonData);
  }
}