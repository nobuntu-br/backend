import { BaseResourceModel } from "./baseResource.model";

export interface IComponentStructureDatabaseModel extends BaseResourceModel {
  structure?: string;
  componentName?: string;
  createdAt?: string;
}

export interface IComponentStructure extends BaseResourceModel {
  structure?: string;
  componentName?: string;
  createdAt?: string;
}

export class ComponentStructure extends BaseResourceModel implements IComponentStructure {
  structure?: string;
  componentName?: string;
  createdAt?: string;
 
  static fromJson(jsonData?: any): ComponentStructure {
    return Object.assign(new ComponentStructure(), jsonData);
  }
}