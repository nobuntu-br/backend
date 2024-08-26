import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { ComponentStructureRole } from "../models/componentStructureRole.model";
import BaseRepository from "./base.repository";

export default class ComponentStructureRoleRepository extends BaseRepository<ComponentStructureRole>{

  constructor(dbType: DbType, model: any){
    const _adapter : IDatabaseAdapter<ComponentStructureRole> = createDbAdapter<ComponentStructureRole>(dbType, model, ComponentStructureRole.fromJson)
    super(_adapter);
  }

}