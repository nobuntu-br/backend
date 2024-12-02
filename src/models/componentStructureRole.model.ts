import { BaseResourceModel } from "./baseResource.model";

export interface IComponentStructureRole {
  roleId?: string;
  componentStructureId?: string;
}

export class ComponentStructureRole extends BaseResourceModel implements IComponentStructureRole {
  roleId?: string;
  componentStructureId?: string;

  static fromJson(jsonData: any) : ComponentStructureRole {
    return Object.assign(new ComponentStructureRole(), jsonData);
  }
}