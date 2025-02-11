import { Op } from "sequelize";
import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { UnknownError } from "../../errors/unknown.error";
import { DatabasePermissionDetailOutputDTO } from "../../useCases/tenant/getUserTenants.useCase";
import { IDatabasePermissionDatabaseModel, DatabasePermission } from "../entities/databasePermission.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class DatabasePermissionRepository extends BaseRepository<IDatabasePermissionDatabaseModel, DatabasePermission> {

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IDatabasePermissionDatabaseModel, DatabasePermission> = createDbAdapter<IDatabasePermissionDatabaseModel, DatabasePermission>(tenantConnection.models!.get("DatabasePermission"), tenantConnection.databaseType, tenantConnection.connection, DatabasePermission.fromJson);
    super(_adapter, tenantConnection);
  }

  async getTenantsUserHasAccess(UserUID: string): Promise<DatabasePermissionDetailOutputDTO[]> {

    if (this.adapter.databaseType == 'mongodb') {
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
            userId: _userTenantData.userId,
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
              as: "tenant",
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
          var _tenantData = userTenant.dataValues.tenant;

          var _userTenant: DatabasePermissionDetailOutputDTO = {
            tenant: {
              id: _tenantData.id,
              name: _tenantData.name
            },
            databaseCredential: {
              id: _userTenantData.databaseCredentialId
            },
            userUID: _userTenantData.userUID,
            userId: _userTenantData.userId,
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

  async getTenantsUsersHasAccess(): Promise<DatabasePermissionDetailOutputDTO[]> {

    if (this.adapter.databaseType == 'mongodb') {
      try {

        let _userTenants: DatabasePermissionDetailOutputDTO[] = [];

        let getTenantsUserHasAccessQuery = [

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
            userId: _userTenantData.userId,
            isAdmin: _userTenantData.isAdmin,
          }

          _userTenants.push(_userTenant);
        });


        return _userTenants;

      } catch (error) {
        throw new Error("Error to fetch tenants user has access on database.")
      }
    } else {
      try {

        let _userTenants: DatabasePermissionDetailOutputDTO[] = [];

        const userTenants = await this._tenantConnection.models!.get("DatabasePermission").findAll({
          include: [
            {
              as:"tenant",
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
          var _tenantData = userTenant.dataValues.tenant;

          var _userTenant: DatabasePermissionDetailOutputDTO = {
            tenant: {
              id: _tenantData.id,
              name: _tenantData.name
            },
            databaseCredential: {
              id: _userTenantData.databaseCredentialId
            },
            userUID: _userTenantData.userUID,
            userId: _userTenantData.userId,
            isAdmin: _userTenantData.isAdmin,
          }

          _userTenants.push(_userTenant);
        });

        return _userTenants;

      } catch (error) {
        throw new Error("Error to fetch tenants user has access on database." + error);
      }
    }
  }

  async findDatabaseCredentialByUserUID(userUID: string): Promise<DatabasePermission[]> {
    try {
      if (this.adapter.databaseType == 'mongodb') {
        throw new Error("Not implemented function.");
        // return await this.findTenantsUserIsAdminMongooseImplementation(userUID);
      } else {
        return await this.findDatabaseCredentialByUserUIDSequelizeImplementation(userUID);
      }
    } catch (error) {
      throw new UnknownError("Error to find tenants this user is admin. Detail: " + error);
    }
  }

  async findDatabaseCredentialByUserUIDSequelizeImplementation(userUID: string): Promise<DatabasePermission[]> {
    let databasePermissions = await this.adapter.findManyWithEagerLoading({userUID: userUID});

    return databasePermissions;
  }

  //TODO  um usuário X que deve ser administrador do tenant pode alterar quais usuários tem permissão no tenant. Ao ter feito alguma alteração, tem que ser alterado no cache.
  //TODO fazer a função que verifica se o usuário é admin do tenant para poder alterar a permissão dos outros ao tenant
  //TODO permitir o usuário passar o cargo de admin pra outra pessoa

  //TODO

  async getDatabaseCredentialByTenantId(tenantId: number){
    //Cada databaseCredential é associado a um tenant, entào tem que ir com base no Id do tenant e Id do dono do tenant
    const data : IDatabasePermissionDatabaseModel[] = await this.adapter.findMany({tenantId: tenantId});

    
  }
}
