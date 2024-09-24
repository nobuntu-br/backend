import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { ComponentStructure } from "../models/componentStructure.model";
import BaseRepository from "./base.repository";

export default class ComponentStructureRepository extends BaseRepository<ComponentStructure>{

  constructor(dbType: DbType, model: any, databaseConnection: any){
    const _adapter : IDatabaseAdapter<ComponentStructure> = createDbAdapter<ComponentStructure>(dbType, model, ComponentStructure.fromJson);
    super(_adapter, databaseConnection);
  }

}