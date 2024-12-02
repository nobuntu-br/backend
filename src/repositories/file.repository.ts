import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter"; 
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter"; 
import { File } from "../models/file.model"; 
import BaseRepository from "./base.repository"; 

export default class FileRepository extends BaseRepository<File>{ 

  constructor(databaseType: DatabaseType, databaseConnection: any){ 
    const _adapter : IDatabaseAdapter<File> = createDbAdapter<File>(databaseType, databaseConnection.models["File"], File.fromJson);
    super(_adapter, databaseConnection); 
  } 

}
