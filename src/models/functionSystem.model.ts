import { BaseResourceModel } from "./base-resource.model";

interface IFunctionSystem {
  description?: string;
  route?: string;
  method?: string;
  classname?: string;
}

export class FunctionSystem extends BaseResourceModel implements IFunctionSystem {
  description?: string;
  route?: string;
  method?: string;
  classname?: string;

  static fromJson(jsonData: any) : FunctionSystem {
    return Object.assign(new FunctionSystem(), jsonData);
  }
}