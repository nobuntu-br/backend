import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { FunctionSystem, IFunctionSystemDatabaseModel } from "../models/functionSystem.model";
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class FunctionSystemRepository extends BaseRepository<IFunctionSystemDatabaseModel, FunctionSystem> {
  private databaseModels: any;

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IFunctionSystemDatabaseModel, FunctionSystem> = createDbAdapter<IFunctionSystemDatabaseModel, FunctionSystem>(tenantConnection.models!.get("FunctionSystem"), tenantConnection.databaseType, tenantConnection.connection, FunctionSystem.fromJson);
    super(_adapter, tenantConnection);
    this.databaseModels = tenantConnection.models;
  }

}