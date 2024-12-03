import { BaseResourceModel } from "./baseResource.model";

export interface IComponentStructureRole {
  roleId?: number;
  componentStructureId?: number;
}

export class ComponentStructureRole extends BaseResourceModel implements IComponentStructureRole {
  roleId?: number;
  componentStructureId?: number;

  static fromJson(jsonData: any) : ComponentStructureRole {
    return Object.assign(new ComponentStructureRole(), jsonData);
  }
}