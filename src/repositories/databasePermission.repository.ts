import { Op } from "sequelize";
import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { DatabasePermission, IDatabasePermissionDatabaseModel } from "../models/databasePermission.model";
import BaseRepository from "./base.repository";
import { DatabasePermissionDetailOutputDTO } from "../models/DTO/databasePermission.DTO";
import TenantConnection from "../models/tenantConnection.model";
import { Tenant } from "../models/tenant.model";
import { UnknownError } from "../errors/unknown.error";

export default class DatabasePermissionRepository extends BaseRepository<IDatabasePermissionDatabaseModel, DatabasePermission> {
  private _tenantConnection: TenantConnection;

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IDatabasePermissionDatabaseModel, DatabasePermission> = createDbAdapter<IDatabasePermissionDatabaseModel, DatabasePermission>(tenantConnection.models!.get("DatabasePermission"), tenantConnection.databaseType, tenantConnection.connection, DatabasePermission.fromJson);
    super(_adapter, tenantConnection);
    this._tenantConnection = tenantConnection;
  }

  async getTenantsUserHasAccess(UserUID: string): Promise<DatabasePermissionDetailOutputDTO[]> {

    if (this.adapter.databaseType == 'mongodb') {
      // throw new Error("This method is not implemented yet");
      try {

        let _userTenants: DatabasePermissionDetailOutputDTO[] = [];

        let getTenantsUserHasAccessQuery: any;
        getTenantsUserHasAccessQuery = [

          { $match: { userUID: { $or: [UserUID, null] } } },

          {
            $lookup: {
              from: "tenants",
              localField: "tenantId",
              foreignField: "_id",
              as: "Tenants",
            },
          },

        ];

        const tenantsUserHasAccess = await this.findUsingCustomQuery(getTenantsUserHasAccessQuery);

        if (tenantsUserHasAccess.length <= 0) {
          return _userTenants;
        }

        tenantsUserHasAccess.forEach((tenant: any) => {

          var _userTenantData = tenant.dataValues;
          var _tenantData = tenant.dataValues.Tenant;

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

        // return tenantsUserHasAccess;
        throw new Error("Not Implemented");

      } catch (error) {
        throw new Error("Error to fetch tenants user has access on database.")
      }
    } else {
      try {

        let _userTenants: DatabasePermissionDetailOutputDTO[] = [];

        const userTenants = await this._tenantConnection.models!.get("DatabasePermission").findAll({
          where: {
            userUID: {
              [Op.or]: [UserUID, null],
            },
          },
          include: [
            {
              model: this._tenantConnection.models!.get("Tenant"),
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
        throw new Error("Error to fetch tenants user has access on database.")
      }
    }
  }

  /**
   * Retorna os tenants que o usuário é administrador
   * @param {*} userUID identificador universal do usuário
   */
  async findTenantsUserIsAdmin(userUID: string): Promise<Tenant[]> {
    try {
      if (this.adapter.databaseType == 'mongodb') {
        return await this.findTenantsUserIsAdminMongooseImplementation(userUID);
      } else {
        return await this.findTenantsUserIsAdminSequelizeImplementation(userUID);
      }
    } catch (error) {
      throw new UnknownError("Error to find tenants this user is admin. Detail: " + error);
    }
  }

  async findTenantsUserIsAdminMongooseImplementation(userUID: string): Promise<Tenant[]> {
    let findTenantsUserIsAdminQuery = [
      //Encotrar documento com nome "guest"
      {
        $match: {
          userUID: userUID,
          isAdmin: true
        }
      },

      {
        $lookup: {
          from: "Tenant",
          localField: "tenantId",
          foreignField: "_id",
          as: "Tenant",
        },
      },

      // { $unwind: "$Tenant" },

    ];

    const tenantsUserIsAdmin = await this.findUsingCustomQuery(findTenantsUserIsAdminQuery);

    let tenants: Tenant[] = [];

    tenantsUserIsAdmin.forEach((tenant: Tenant) => {
      tenants.push({
        id: tenant.id,
        name: tenant.name
      });
    });

    return tenants;
  }

  async findTenantsUserIsAdminSequelizeImplementation(userUID: string): Promise<Tenant[]> {
    const tenantsUserIsAdmin = await this._tenantConnection.models!.get("DatabasePermission").findAll({
      where: {
        userUID: userUID,
        isAdmin: true
      },
      include: [
        {
          model: this._tenantConnection.models!.get("Tenant"),
          required: true,
        },
      ],
    });

    let tenants: Tenant[] = [];

    tenantsUserIsAdmin.forEach((tenant: Tenant) => {
      tenants.push({
        id: tenant.id,
        name: tenant.name
      });
    });

    return tenants;

  }
}
