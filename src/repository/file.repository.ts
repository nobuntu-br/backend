import createDbAdapter, { DbType } from "../adapters/createDb.adapter"; 
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter"; 
import { File } from "../models/file.model"; 
import BaseRepository from "./base.repository"; 

export default class FileRepository extends BaseRepository<File>{ 

  constructor(dbType: DbType, model: any, databaseConnection: any){ 
    const _adapter : IDatabaseAdapter<File> = createDbAdapter<File>(dbType, model, File.fromJson);
    super(_adapter, databaseConnection); 
  } 

}
