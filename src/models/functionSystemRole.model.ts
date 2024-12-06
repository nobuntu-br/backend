import { BaseResourceModel } from "./baseResource.model";
import { FunctionSystem } from "./functionSystem.model";

export interface IFunctionSystemRoleDatabaseModel extends BaseResourceModel{
  roleId?: number;
  functionSystemId?: number;
  authorized?: boolean;
}

export interface IFunctionSystemRole extends BaseResourceModel{
  role?: string;
  functionSystem?: FunctionSystem | number;
  authorized?: boolean;
}

export class FunctionSystemRole extends BaseResourceModel implements IFunctionSystemRole {
  role?: string
  functionSystem?: FunctionSystem | number;
  authorized?: boolean;

  static fromJson(jsonData: any) : FunctionSystemRole {
    return Object.assign(new FunctionSystemRole(), jsonData);
  }
}