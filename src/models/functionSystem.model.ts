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

  static fromJson(jsonData: any) : FunctionSystem {
    return Object.assign(new FunctionSystem(), jsonData);
  }
}