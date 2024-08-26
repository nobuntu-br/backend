import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { Role } from "../models/role.model";
import BaseRepository from "./base.repository";


export default class RoleRepository extends BaseRepository<Role>{

  constructor(dbType: DbType, model: any){
    const _adapter : IDatabaseAdapter<Role> = createDbAdapter<Role>(dbType, model, Role.fromJson)
    super(_adapter);
  }

}