import { BaseResourceModel } from "./base-resource.model" 
import { File } from "./file.model";
import { User } from "./user.model";


interface IFieldFile { 
    fieldType?: string;
    user?: User;
    files?: File[];
} 
export class FieldFile extends BaseResourceModel implements IFieldFile{ 
    fieldType?: string;
    user?: User;
    files?: File[];

  static fromJson(jsonData: any) : FieldFile { 
    return Object.assign(new FieldFile(), jsonData); 
  } 
}
