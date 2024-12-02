import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { FunctionSystem } from "../models/functionSystem.model";
import BaseRepository from "./base.repository";

export default class FunctionSystemRepository extends BaseRepository<FunctionSystem> {
  private databaseModels: any;

  constructor(dbType: DatabaseType, databaseConnection: any) {
    console.log(databaseConnection.models);
    const _adapter: IDatabaseAdapter<FunctionSystem> = createDbAdapter<FunctionSystem>(dbType, databaseConnection.models["FunctionSystem"], FunctionSystem.fromJson);
    super(_adapter, databaseConnection);
    this.databaseModels = databaseConnection.models;
  }

}