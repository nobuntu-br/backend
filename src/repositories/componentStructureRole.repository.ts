import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { ComponentStructureRole } from "../models/componentStructureRole.model";
import BaseRepository from "./base.repository";

export default class ComponentStructureRoleRepository extends BaseRepository<ComponentStructureRole>{

  constructor(databaseType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<ComponentStructureRole> = createDbAdapter<ComponentStructureRole>(databaseType, databaseConnection.models["ComponentStructureRole"], ComponentStructureRole.fromJson);
    super(_adapter, databaseConnection);
  }

}