import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { ComponentStructure, IComponentStructure } from "../models/componentStructure.model";
import BaseRepository from "./base.repository";

export default class ComponentStructureRepository extends BaseRepository<IComponentStructure, ComponentStructure>{

  constructor(databaseType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<IComponentStructure, ComponentStructure> = createDbAdapter<IComponentStructure, ComponentStructure>(databaseType, databaseConnection.models["ComponentStructure"], ComponentStructure.fromJson);
    super(_adapter, databaseConnection);
  }

}