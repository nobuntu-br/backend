import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { DatabaseCredential, IDatabaseCredential } from "../models/databaseCredential.model";
import BaseRepository from "./base.repository";

export default class DatabaseCredentialRepository extends BaseRepository<DatabaseCredential>{

  constructor(databaseType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<DatabaseCredential> = createDbAdapter<DatabaseCredential>(databaseType, databaseConnection.models["DatabaseCredential"], DatabaseCredential.fromJson);
    super(_adapter, databaseConnection);
  }

}