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

  constructor(input: IFunctionSystemRole){
    super();
    this.id = input.id;
    this.role = input.role;
    this.functionSystem = input.functionSystem;
    this.authorized = input.authorized;
  }

  static fromJson(jsonData: any) : FunctionSystemRole {
    return new FunctionSystemRole(jsonData);
  }
}