import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { IComponentStructureDatabaseModel, ComponentStructure } from "../entities/componentStructure.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class ComponentStructureRepository extends BaseRepository<IComponentStructureDatabaseModel, ComponentStructure>{

  constructor(tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IComponentStructureDatabaseModel, ComponentStructure> = createDbAdapter<IComponentStructureDatabaseModel, ComponentStructure>(tenantConnection.models!.get("ComponentStructure"), tenantConnection.databaseType, tenantConnection.connection, ComponentStructure.fromJson);
    super(_adapter, tenantConnection);
  }

}