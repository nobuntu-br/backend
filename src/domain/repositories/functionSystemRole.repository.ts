import { Op } from "sequelize";
import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { IFunctionSystemRoleDatabaseModel, FunctionSystemRole } from "../entities/functionSystemRole.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";
import UserRoleRepository from "./userRole.repository";

export default class FunctionSystemRoleRepository extends BaseRepository<IFunctionSystemRoleDatabaseModel, FunctionSystemRole> {

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IFunctionSystemRoleDatabaseModel, FunctionSystemRole> = createDbAdapter<IFunctionSystemRoleDatabaseModel, FunctionSystemRole>(tenantConnection.models!.get("FunctionSystemRole"), tenantConnection.databaseType, tenantConnection.connection, FunctionSystemRole.fromJson);
    super(_adapter, tenantConnection);
  }

  async isUserHaveAccessToRouteByUserId(userId: number, method: string, route: string): Promise<boolean | null> {

    const userRoleRepository: UserRoleRepository = new UserRoleRepository(this.tenantConnection);

    //Obtem as roles do usuário
    let roles = await userRoleRepository.findMany({userId: userId});

    let roleIds = roles.map(role => role.roleId!);

    try {
      if (this.adapter.databaseType == 'mongodb') {
        return await this.isRolesHasAccessToRouteMongooseImplementation(roleIds, method, route);
      } else {
        return await this.isRolesHasAccessToRouteSequelizeImplementation(roleIds, method, route);
      }
    } catch (error) {
      throw new Error("Error to check user have access to route. Detail: " + error);
    }
  }

  async isRolesHasAccessToRouteSequelizeImplementation(roleIds: number[], method: string, route: string): Promise<boolean | null> {

    route = route.toLowerCase();
    method = method.toLowerCase();

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      return false;
    }

    const routeUserHaveAccess = await this.adapter.model.findAll({
      where: {
        roleId: {
          [Op.in]: roleIds,
        }
      },
      include: [
        {
          model: this._tenantConnection.models!.get("FunctionSystem"),
          required: true,
          where: {
            method: method,
            route: route
          }
        },
      ],
    });
    
    console.log("Retorno da pesquisa se o usuário tem permissão na rota com sequelize: ", routeUserHaveAccess);

    if(routeUserHaveAccess.length > 0){
      return true;
    }
    
    return false;
  }

  async isRolesHasAccessToRouteMongooseImplementation(roleIds: number[], method: string, route: string): Promise<boolean | null> {

    route = route.toLowerCase();
    method = method.toLowerCase();

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      return false;
    }

    let checkUserHaveAccessToRouteByUserId = [
      {
        $match: {
          roleId: { $in: roleIds }, // Filtra pelos IDs de roles
        },
      },
      // Buscar os dados na tabela functionSystem e filtrar pela rota
      {
        $lookup: {
          from: "functionsystems",
          localField: "functionSystemId",
          foreignField: "_id",
          as: "functionSystem"
        }
      },
      {
        $unwind: "$functionSystem" // Desfaz arrays criados pelo $lookup
      },
      {
        $match: {
          $and: [
            { "functionSystem.method": { $eq: method } },
            { "functionSystem.route": { $eq: route } }
          ]
        },
      },
      // Projeção final (personalize conforme necessário)
      {
        $project: {
          userId: "$roleId",
          functionSystemId: "$functionSystemsId",
          authorized: "$authorized"
        }
      }
    ];

    const role : IFunctionSystemRoleDatabaseModel[] = await this._tenantConnection.models!.get("FunctionSystemRole").aggregate(checkUserHaveAccessToRouteByUserId);

    if (role.length > 0) {
      return true;
    }

    return false;
  }

  async isPublicRoute(method: string, route: string): Promise<boolean> {
    try {
      if (this.adapter.databaseType == 'mongodb') {
        return await this.isPublicRouteMongooseImplementation(method, route);
      } else {
        return await this.isPublicRouteSequelizeImplementation(method, route);
      }
    } catch (error) {
      throw new Error("Error to check route is public. Detail: " + error);
    }
  }

  async isPublicRouteMongooseImplementation(method: string, route: string): Promise<boolean> {
    
    //De functionSystem vai para role
    let isPublicRouteQuery = [
      {
        $match: {
          $and: [
            { "FunctionSystem.method": { $eq: method } },
            { "FunctionSystem.route": { $eq: route } }
          ]
        },
      },
      {
        $lookup: {
          from: "functionssystemroles",
          localField: "_id",
          foreignField: "functionSystemId",
          as: "FunctionSystemRoles",
        },
      },
      { $unwind: "$FunctionSystemRoles" },
      {
        $lookup: {
          from: "roles",
          localField: "FunctionSystemRoles",
          foreignField: "roleId",
          as: "FunctionSystemRoles",
        },
      },
    ];
   
    // const role = await dbAdapter.findUsingQuery(isPublicRouteQuery);
    const role = await this.findUsingCustomQuery(isPublicRouteQuery);

    if(Array.isArray(role) == true){
      if(role.length > 0){
        return true;
      } else {
        return false;
      }
    }

    return false;
  }

  async isPublicRouteSequelizeImplementation(method: string, route: string) {
    const userTenants = await this._tenantConnection.models!.get("FunctionSystem").findAll({
      where: {
        route: route,
        method: method
      },
      include: [
        {
          model: this._tenantConnection.models!.get("Role"),
          required: true,
          where: {
            name: "guest",
          }
        },
      ],
    });

    if (userTenants.length <= 0) {
      return false;
    }

    return true;
  }

}