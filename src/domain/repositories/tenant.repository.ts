import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { TenantRepositoryMongoose } from "../../infra/database/mongoose/repositories/tenant.repository";
import { TenantRepositorySequelize } from "../../infra/database/sequelize/repositories/tenant.repository";
import { ITenantDatabaseModel, Tenant } from "../entities/tenant.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";

export interface ITenantRepository {
  getTenantsByUserOwner(UserUID: string): Promise<ITenantDatabaseModel[]>;
}

export default class TenantRepository extends BaseRepository<ITenantDatabaseModel, Tenant> {
  advancedSearches: ITenantRepository;

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<ITenantDatabaseModel, Tenant> = createDbAdapter<ITenantDatabaseModel, Tenant>(tenantConnection.models!.get("Tenant"), tenantConnection.databaseType, tenantConnection.connection, Tenant.fromJson);
    super(_adapter, tenantConnection);

    if (tenantConnection.databaseType === 'mongodb') {
      this.advancedSearches = new TenantRepositoryMongoose(this.tenantConnection, this.adapter);
    } else {
      this.advancedSearches = new TenantRepositorySequelize(this.tenantConnection, this.adapter);
    }
  }

}