import { where } from "sequelize";
import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { IRoleDataBaseModel, Role } from "../entities/role.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class RoleRepository extends BaseRepository<IRoleDataBaseModel, Role>{

  constructor(tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IRoleDataBaseModel, Role> = createDbAdapter<IRoleDataBaseModel, Role>(tenantConnection.models!.get("Role"), tenantConnection.databaseType, tenantConnection.connection, Role.fromJson);
    super(_adapter, tenantConnection);
  }

  async getUserRoles(userId: number): Promise<Role[]>{
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

  async getUserRolesSequelizeImplementation(userId: number): Promise<Role[]>{
    let _roles = await this._tenantConnection.models!.get("Role").findAll({
      include: [
        {
          model: this._tenantConnection.models!.get("User"),
          as: "user",
          required: true,
          where: {
            id: userId
          }
        },
      ],
    });

    let roles : Role[] = [];

    if(Array.isArray(_roles) &&  _roles.length == 0){
      return [];
    }

    for(let role of _roles){
      roles.push({
        id: role.dataValues.id,
        name: role.dataValues.name,
        updatedAt: role.dataValues.updatedAt
      });
    }

    return roles;
  }

  async getUserRolesMongooseImplementation() {
    return [];
  }
}