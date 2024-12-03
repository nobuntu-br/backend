import { BaseResourceModel } from "./baseResource.model";

export interface IFunctionSystemRole extends BaseResourceModel{
  Role?: string;
  FunctionSystem?: string;
  authorized?: boolean;
}

export class FunctionSystemRole extends BaseResourceModel implements IFunctionSystemRole {
  Role?: string
  FunctionSystem?: string
  authorized?: boolean;

  static fromJson(jsonData: any) : FunctionSystemRole {
    return Object.assign(new FunctionSystemRole(), jsonData);
  }
}