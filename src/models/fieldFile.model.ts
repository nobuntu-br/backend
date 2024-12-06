import { BaseResourceModel } from "./baseResource.model"
import { File } from "./file.model";
import { User } from "./user.model";

export interface IFieldFileDatabaseModel extends BaseResourceModel {
  fieldType?: string;
  userId?: number;
  filesId?: number[];
}

export interface IFieldFile extends BaseResourceModel {
  fieldType?: string;
  user?: User;
  files?: File[] | number[];
}

export class FieldFile extends BaseResourceModel implements IFieldFile {
  fieldType?: string;
  user?: User;
  files?: File[] | number[];//eager loading | lazy loading

  static fromJson(jsonData: any): FieldFile {
    return Object.assign(new FieldFile(), jsonData);
  }
}
