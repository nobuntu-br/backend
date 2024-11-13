import { BaseResourceModel } from "./base-resource.model" 


interface IFile { 
    name?: string,
    size?: number,
    extension?: string,
    dataBlob?: Blob,
    fieldFile?: number

} 
export class File extends BaseResourceModel implements IFile{ 
    name?: string;
    size?: number;
    extension?: string;
    dataBlob?: Blob;
    fieldFile?: number;

  static fromJson(jsonData: any) : File { 
    return Object.assign(new File(), jsonData); 
  } 
}
