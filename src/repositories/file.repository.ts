import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter"; 
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter"; 
import { File, IFile } from "../models/file.model"; 
import BaseRepository from "./base.repository"; 

export default class FileRepository extends BaseRepository<IFile, File>{ 

  constructor(databaseType: DatabaseType, databaseConnection: any){ 
    const _adapter : IDatabaseAdapter<IFile, File> = createDbAdapter<IFile, File>(databaseType, databaseConnection.models["File"], File.fromJson);
    super(_adapter, databaseConnection); 
  } 

}
