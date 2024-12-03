import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { IRole, Role } from "../models/role.model";
import BaseRepository from "./base.repository";


export default class RoleRepository extends BaseRepository<IRole, Role>{

  constructor(databaseType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<IRole, Role> = createDbAdapter<IRole, Role>(databaseType, databaseConnection.models["Role"], Role.fromJson);
    super(_adapter, databaseConnection);
  }

}