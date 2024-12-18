import { BaseResourceModel } from "./baseResource.model"

export interface IFileDatabaseModel extends BaseResourceModel {
  name?: string,
  size?: number,
  extension?: string,
  dataBlob?: Blob,
  fieldFile?: number
}

export interface IFile extends BaseResourceModel {
  name?: string,
  size?: number,
  extension?: string,
  dataBlob?: Blob,
  fieldFile?: number
}

export class File extends BaseResourceModel implements IFile {
  name?: string;
  size?: number;
  extension?: string;
  dataBlob?: Blob;
  fieldFile?: number;

  constructor(input: IFile){
    super();
    this.id = input.id;
    this.size = input.size;
    this.extension = input.extension;
    this.dataBlob = input.dataBlob;
    this.fieldFile = input.fieldFile;
  }

  static fromJson(jsonData: any): File {
    return new File(jsonData);
  }
}
