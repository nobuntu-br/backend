import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { ComponentStructureRole, IComponentStructureRoleDatabaseModel } from "../models/componentStructureRole.model";
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class ComponentStructureRoleRepository extends BaseRepository<IComponentStructureRoleDatabaseModel, ComponentStructureRole>{

  constructor(tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IComponentStructureRoleDatabaseModel, ComponentStructureRole> = createDbAdapter<IComponentStructureRoleDatabaseModel, ComponentStructureRole>(tenantConnection.models!.get("ComponentStructureRole"), tenantConnection.databaseType, tenantConnection.connection, ComponentStructureRole.fromJson);
    super(_adapter, tenantConnection);
  }

}