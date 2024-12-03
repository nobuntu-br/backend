import { Op } from "sequelize";
import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { DatabasePermission, IDatabasePermission } from "../models/databasePermission.model";
import BaseRepository from "./base.repository";
import { DatabasePermissionDetailOutputDTO } from "../models/DTO/databasePermission.DTO";

export default class DatabasePermissionRepository extends BaseRepository<IDatabasePermission, DatabasePermission> {
  private databaseModels: any;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    const _adapter: IDatabaseAdapter<IDatabasePermission, DatabasePermission> = createDbAdapter<IDatabasePermission, DatabasePermission>(databaseType, databaseConnection.models["DatabasePermission"], DatabasePermission.fromJson);
    super(_adapter, databaseConnection);
    this.databaseModels = databaseConnection.models;
  }

  async getTenantsWithDefaultTenantByUserUID(UserUID: string): Promise<DatabasePermissionDetailOutputDTO[]> {

    if (this.adapter.databaseType == 'mongodb') {
      throw new Error("This method is not implemented yet");
    } else {
      try {

        var _userTenants: DatabasePermissionDetailOutputDTO[] = [];

        const userTenants = await this.adapter.model.findAll({
          where: {
            userUID: {
              [Op.or]: [UserUID, null],
            },
          },
          include: [
            {
              model: this.databaseModels["Tenant"],
              required: true,
            },
          ],
        });

        if (userTenants.length <= 0) {
          return _userTenants;
        }

        userTenants.forEach((userTenant: any) => {

          var _userTenantData = userTenant.dataValues;
          var _tenantData = userTenant.dataValues.Tenant;

          var _userTenant: DatabasePermissionDetailOutputDTO = {
            tenant: {
              id: _tenantData.id,
              name: _tenantData.name
            },
            databaseCredential: {
              id: _userTenantData.databaseCredentialId
            },
            userUID: _userTenantData.userUID,
            isAdmin: _userTenantData.isAdmin,
          }

          _userTenants.push(_userTenant);
        });

        return _userTenants;

      } catch (error) {
        throw new Error("Error to fetch userTenant data on database.")
      }
    }
  }

}
