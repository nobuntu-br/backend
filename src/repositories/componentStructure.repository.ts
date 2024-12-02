import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { ComponentStructure } from "../models/componentStructure.model";
import BaseRepository from "./base.repository";

export default class ComponentStructureRepository extends BaseRepository<ComponentStructure>{

  constructor(databaseType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<ComponentStructure> = createDbAdapter<ComponentStructure>(databaseType, databaseConnection.models["ComponentStructure"], ComponentStructure.fromJson);
    super(_adapter, databaseConnection);
  }

}