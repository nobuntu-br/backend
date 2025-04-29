import { createDbAdapter } from "../../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../../infra/database/IDatabase.adapter";
import BaseRepository from "./base.repository";
import { File, IFileDatabaseModel } from "../../entities/fixes/file.model";
import TenantConnection from "../../entities/fixes/tenantConnection.model";

export default class FileRepository extends BaseRepository<IFileDatabaseModel, File>{ 

  constructor(tenantConnection: TenantConnection){ 
    const _adapter : IDatabaseAdapter<IFileDatabaseModel, File> = createDbAdapter<IFileDatabaseModel, File>(tenantConnection.models!.get("File"), tenantConnection.databaseType, tenantConnection.connection, File.fromJson);
    super(_adapter, tenantConnection); 
  } 

}
