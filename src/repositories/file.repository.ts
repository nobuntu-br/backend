import createDbAdapter from "../adapters/createDb.adapter"; 
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter"; 
import { File, IFileDatabaseModel } from "../models/file.model"; 
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository"; 

export default class FileRepository extends BaseRepository<IFileDatabaseModel, File>{ 

  constructor(tenantConnection: TenantConnection){ 
    const _adapter : IDatabaseAdapter<IFileDatabaseModel, File> = createDbAdapter<IFileDatabaseModel, File>(tenantConnection.models!.get("File"), tenantConnection.databaseType, tenantConnection.connection, File.fromJson);
    super(_adapter, tenantConnection); 
  } 

}
