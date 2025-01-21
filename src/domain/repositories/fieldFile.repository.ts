import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { IFieldFileDatabaseModel, FieldFile } from "../entities/fieldFile.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository"; 

export default class FieldFileRepository extends BaseRepository<IFieldFileDatabaseModel, FieldFile>{ 

  constructor(tenantConnection: TenantConnection){ 
    const _adapter : IDatabaseAdapter<IFieldFileDatabaseModel, FieldFile> = createDbAdapter<IFieldFileDatabaseModel, FieldFile>(tenantConnection.models!.get("FieldFile"), tenantConnection.databaseType, tenantConnection.connection, FieldFile.fromJson);
    super(_adapter, tenantConnection);
  } 
  
  async upload(fieldFile: FieldFile): Promise<string> { 
    try {
      let files = fieldFile.files;
      fieldFile.files = [];
      return this.adapter.create(fieldFile).then((data) => {
          if (files) {
            for (let i = 0; i < files.length; i++) {
            files[i].fieldFile = data.id ? data.id : undefined;
          }
          // this.tenantConnection.models["file"].bulkCreate(files);

          //TODO fazer a verificaçào do "this.adapter.databaseType", se for mongodb, usa a função de bulk do mongoose, se for outros usa a função de bulk do sequelize


          this.tenantConnection.models?.get("File");
        }
        return data.id ? data.id.toString() : '';
      });
      throw new Error("Method with error");
    } catch (error) { 
      throw error; 
    } 
  }

}
