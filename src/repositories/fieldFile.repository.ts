import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter"; 
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter"; 
import { FieldFile, IFieldFileDatabaseModel } from "../models/fieldFile.model"; 
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository"; 

export default class FieldFileRepository extends BaseRepository<IFieldFileDatabaseModel, FieldFile>{ 

  constructor(databaseType: DatabaseType, tenantConnection: TenantConnection){ 
    const _adapter : IDatabaseAdapter<IFieldFileDatabaseModel, FieldFile> = createDbAdapter<IFieldFileDatabaseModel, FieldFile>(tenantConnection.models!.get("FieldFile"), databaseType, tenantConnection.connection, FieldFile.fromJson);
    super(_adapter, tenantConnection); 
    
  } 

  
  async upload(fieldFile: FieldFile): Promise<string> { 
    try { 
      // let files = fieldFile.files;
      // fieldFile.files = [];
      // return this.adapter.create(fieldFile).then((data) => {
      //     if (files) {
      //       for (let i = 0; i < files.length; i++) {
      //       files[i].fieldFile = data.id ? parseInt(data.id, 10) : undefined;
      //     }
      //     this.tenantConnection.models["file"].bulkCreate(files);
      //   }
      //   return data.id ? data.id.toString() : '';
      // });
      throw new Error("Method with error");
    } catch (error) { 
      throw error; 
    } 
  }

}
