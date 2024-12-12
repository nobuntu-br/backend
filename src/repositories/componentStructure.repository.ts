import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { ComponentStructure, IComponentStructureDatabaseModel } from "../models/componentStructure.model";
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class ComponentStructureRepository extends BaseRepository<IComponentStructureDatabaseModel, ComponentStructure>{

  constructor(tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IComponentStructureDatabaseModel, ComponentStructure> = createDbAdapter<IComponentStructureDatabaseModel, ComponentStructure>(tenantConnection.models!.get("ComponentStructure"), tenantConnection.databaseType, tenantConnection.connection, ComponentStructure.fromJson);
    super(_adapter, tenantConnection);
  }

}