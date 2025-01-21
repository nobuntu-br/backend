import { BaseResourceModel } from "./baseResource.model";

export interface IFunctionSystemDatabaseModel extends BaseResourceModel {
  description?: string;
  route?: string;
  method?: string;
  className?: string;
}

export interface IFunctionSystem extends BaseResourceModel {
  description?: string;
  route?: string;
  method?: string;
  className?: string;
}

export class FunctionSystem extends BaseResourceModel implements IFunctionSystem {
  description?: string;
  route?: string;
  method?: string;
  className?: string;

  constructor(data: IFunctionSystem){
    super();
    this.id = data.id;
    this.description = data.description;
    this.route = data.route;
    this.method = data.method;
    this.className = data.className;
  }

  static fromJson(jsonData: any) : FunctionSystem {
    return new FunctionSystem(jsonData);
  }
}