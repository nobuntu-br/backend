import { where } from "sequelize";
import { createDbAdapter } from "../../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../../infra/database/IDatabase.adapter";
import BaseRepository from "./base.repository";
import { RoleRepositoryMongoose } from "../../../infra/database/mongoose/repositories/role.repository";
import { RoleRepositorySequelize } from "../../../infra/database/sequelize/repositories/role.repository";
import { IRoleDataBaseModel, Role } from "../../entities/fixes/role.model";
import TenantConnection from "../../entities/fixes/tenantConnection.model";

export interface IRoleRepository {
  isPublicRoute(method: string, route: string): Promise<boolean>;
}

export default class RoleRepository extends BaseRepository<IRoleDataBaseModel, Role> {
  advancedSearches: IRoleRepository;

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IRoleDataBaseModel, Role> = createDbAdapter<IRoleDataBaseModel, Role>(tenantConnection.models!.get("nfRole"), tenantConnection.databaseType, tenantConnection.connection, Role.fromJson);
    super(_adapter, tenantConnection);

    if (tenantConnection.databaseType === 'mongodb') {
      this.advancedSearches = new RoleRepositoryMongoose(this.tenantConnection, this.adapter);
    } else {
      this.advancedSearches = new RoleRepositorySequelize(this.tenantConnection, this.adapter);
    }
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    try {
      if (this.adapter.databaseType == 'mongodb') {
        return await this.getUserRolesMongooseImplementation();
      } else {
        return await this.getUserRolesSequelizeImplementation(userId);
      }
    } catch (error) {
      throw new Error("Error get user Roles. Detail: " + error);
    }
  }

  async getUserRolesSequelizeImplementation(userId: number): Promise<Role[]> {
    let userRoles = await this._tenantConnection.models!.get("nfUserRole").findAll({
      where: {
      userId: userId
      },
      include: [{all: true}]
    });

    let roleIds = userRoles.map((userRole: any) => userRole.roleId);

    let _roles = await this._tenantConnection.models!.get("nfRole").findAll({
      where: {
      id: roleIds
      },
    });

    let roles: Role[] = [];

    if (Array.isArray(_roles) && _roles.length == 0) {
      return [];
    }

    for (let role of _roles) {
      roles.push({
        id: role.dataValues.id,
        name: role.dataValues.name,
      });
    }

    return roles;
  }

  async getUserRolesMongooseImplementation() {
    return [];
  }
}