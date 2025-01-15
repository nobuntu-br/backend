import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import TenantConnection from "../models/tenantConnection.model";
import { IUserRoleDatabaseModel, UserRole } from "../models/userRole.model";
import BaseRepository from "./base.repository";

export default class UserRoleRepository extends BaseRepository<IUserRoleDatabaseModel, UserRole> {

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IUserRoleDatabaseModel, UserRole> = createDbAdapter<IUserRoleDatabaseModel, UserRole>(tenantConnection.models!.get("UserRole"), tenantConnection.databaseType, tenantConnection.connection, UserRole.fromJson);
    super(_adapter, tenantConnection);
  }
}  