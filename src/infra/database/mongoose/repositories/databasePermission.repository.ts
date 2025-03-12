import { where } from "sequelize";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import { IDatabaseAdapter } from "../../IDatabase.adapter";
import { IDatabasePermissionRepository } from "../../../../domain/repositories/databasePermission.repository";
import { IDatabasePermissionDatabaseModel, DatabasePermission } from "../../../../domain/entities/databasePermission.model";
import { IUser } from "../../../../domain/entities/user.model";

export class DatabasePermissionRepositoryMongoose implements IDatabasePermissionRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<IDatabasePermissionDatabaseModel, DatabasePermission>) {}
  
  async getUsersWithTenantAccess(tenantId: number, ownerUserId: number): Promise<IUser[]> {
    throw Error("Methos not implemented yet.");
  }

}
