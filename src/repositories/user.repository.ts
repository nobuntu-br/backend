import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { IUser, User } from "../models/user.model";
import BaseRepository from "./base.repository";

export default class UserRepository extends BaseRepository<IUser, User>{

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    const _adapter : IDatabaseAdapter<IUser, User> = createDbAdapter<IUser, User>(databaseType, databaseConnection.models["User"], User.fromJson);
    super(_adapter, databaseConnection);
  }

}