import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { ComponentStructure } from "../entities/componentStructure.model";
import { IComponentStructureRoleDatabaseModel, ComponentStructureRole } from "../entities/componentStructureRole.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class ComponentStructureRoleRepository extends BaseRepository<IComponentStructureRoleDatabaseModel, ComponentStructureRole> {

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IComponentStructureRoleDatabaseModel, ComponentStructureRole> = createDbAdapter<IComponentStructureRoleDatabaseModel, ComponentStructureRole>(tenantConnection.models!.get("ComponentStructureRole"), tenantConnection.databaseType, tenantConnection.connection, ComponentStructureRole.fromJson);
    super(_adapter, tenantConnection);
  }

  async getPageStructure(userUID: string, pageName: string): Promise<ComponentStructure> {
    try {
      if (this.adapter.databaseType == 'mongodb') {
        return await this.getPageStructureMongooseImplementation(userUID, pageName);
      } else {
        return await this.getPageStructureSequelizeImplementation(userUID, pageName);
      }
    } catch (error) {
      throw new Error("Error to check route is public. Detail: "+ error);
    }
  }

  async getPageStructureSequelizeImplementation(userUID: string, pageName: string): Promise<ComponentStructure> {
    const componentStructure = await this.tenantConnection.models!.get("User").findAll({
      where: {
        userUID: userUID,
      },
      include: [
        {
          model: this.tenantConnection.models!.get("Role"),
          required: true,
          include: {
            model: this.tenantConnection.models!.get("ComponentStructure"),
            required: false
          }
        },
      ],
    });

    console.log(componentStructure);

    return new ComponentStructure({
      componentName: pageName,
      structure: ""
    });
  }
  

  async getPageStructureMongooseImplementation(userUID: string, pageName: string): Promise<ComponentStructure> {
    throw new Error("Not implemented function");
  }
}