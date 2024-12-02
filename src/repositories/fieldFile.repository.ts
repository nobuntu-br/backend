import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter"; 
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter"; 
import { FieldFile } from "../models/fieldFile.model"; 
import BaseRepository from "./base.repository"; 

export default class FieldFileRepository extends BaseRepository<FieldFile>{ 

  constructor(databaseType: DatabaseType, databaseConnection: any){ 
    const _adapter : IDatabaseAdapter<FieldFile> = createDbAdapter<FieldFile>(databaseType, databaseConnection.models["FieldFile"], FieldFile.fromJson);
    super(_adapter, databaseConnection); 
    
  } 

  async upload(fieldFile: FieldFile): Promise<string> { 
    try { 
      let files = fieldFile.files;
      fieldFile.files = [];
      return this.adapter.create(fieldFile).then((data) => {
          if (files) {
            for (let i = 0; i < files.length; i++) {
            files[i].fieldFile = data.id ? parseInt(data.id, 10) : undefined;
          }
          this.databaseConnection.models["file"].bulkCreate(files);
        }
        return data.id ? data.id.toString() : '';
      });
    } catch (error) { 
      throw error; 
    } 
  }

}
