import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { User } from "../models/user.model";
import BaseRepository from "./base.repository";

export default class UserRepository extends BaseRepository<User>{

  constructor(dbType: DbType, model: any){
    const _adapter : IDatabaseAdapter<User> = createDbAdapter<User>(dbType, model, User.fromJson);
    super(_adapter);
  }

}