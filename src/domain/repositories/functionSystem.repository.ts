import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { IFunctionSystemDatabaseModel, FunctionSystem } from "../entities/functionSystem.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class FunctionSystemRepository extends BaseRepository<IFunctionSystemDatabaseModel, FunctionSystem> {
  private databaseModels: any;

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IFunctionSystemDatabaseModel, FunctionSystem> = createDbAdapter<IFunctionSystemDatabaseModel, FunctionSystem>(tenantConnection.models!.get("FunctionSystem"), tenantConnection.databaseType, tenantConnection.connection, FunctionSystem.fromJson);
    super(_adapter, tenantConnection);
    this.databaseModels = tenantConnection.models;
  }

}