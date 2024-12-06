import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import TenantConnection from "../models/tenantConnection.model";
import { IUserDatabaseModel, User } from "../models/user.model";
import BaseRepository from "./base.repository";

export default class UserRepository extends BaseRepository<IUserDatabaseModel, User>{

  constructor(databaseType: DatabaseType, tenantConnection: TenantConnection) {
    const _adapter : IDatabaseAdapter<IUserDatabaseModel, User> = createDbAdapter<IUserDatabaseModel, User>(tenantConnection.models!.get("User"), databaseType, tenantConnection.connection, User.fromJson);
    super(_adapter, tenantConnection);
  }

}