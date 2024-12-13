import { BaseResourceModel } from "./baseResource.model";

export interface IComponentStructureDatabaseModel extends BaseResourceModel {
  structure?: string;
  componentName?: string;
  createdAt?: string;
}

export interface IComponentStructure extends BaseResourceModel {
  structure: string;
  componentName: string;
  createdAt?: string;
}

export class ComponentStructure extends BaseResourceModel implements IComponentStructure {
  structure: string;
  componentName: string;
  createdAt?: string;
 
  constructor(data: IComponentStructure){
    super();
    this.structure = data.structure;
    this.componentName = data.componentName;
  }

  static fromJson(jsonData?: any): ComponentStructure {
    return new ComponentStructure(jsonData);
  }
}