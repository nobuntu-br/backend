import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { FunctionSystem, IFunctionSystemDatabaseModel } from "../models/functionSystem.model";
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class FunctionSystemRepository extends BaseRepository<IFunctionSystemDatabaseModel, FunctionSystem> {
  private databaseModels: any;

  constructor(databaseType: DatabaseType, databaseConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IFunctionSystemDatabaseModel, FunctionSystem> = createDbAdapter<IFunctionSystemDatabaseModel, FunctionSystem>(databaseConnection.models!.get("FunctionSystem"), databaseType, databaseConnection.connection, FunctionSystem.fromJson);
    super(_adapter, databaseConnection);
    this.databaseModels = databaseConnection.models;
  }

}