import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { FunctionSystemRole, IFunctionSystemRoleDatabaseModel } from "../models/functionSystemRole.model";
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class FunctionSystemRoleRepository extends BaseRepository<IFunctionSystemRoleDatabaseModel ,FunctionSystemRole> {
  private _tenantConnection: TenantConnection;

  constructor(tenantConnection: TenantConnection) {
    const _adapter: IDatabaseAdapter<IFunctionSystemRoleDatabaseModel ,FunctionSystemRole> = createDbAdapter<IFunctionSystemRoleDatabaseModel ,FunctionSystemRole>(tenantConnection.models!.get("FunctionSystemRole"), tenantConnection.databaseType, tenantConnection.connection, FunctionSystemRole.fromJson);
    super(_adapter, tenantConnection);
    this._tenantConnection = tenantConnection;
  }

  async isUserHaveAccessToRoute(userUID: string, method: string, route: string): Promise<boolean | null> {
    if (this.adapter.databaseType == 'mongodb') {
      var isUserHaveAccessToRouteQuery: any;
      isUserHaveAccessToRouteQuery = [
        // Filtrar pelo UID do usuário
        { $match: { UID: userUID } },
        // Fazer o lookup para obter os detalhes das roles
        {
          $lookup: {
            from: "roles",
            localField: "Roles",
            foreignField: "_id",
            as: "Roles",
          },
        },

        // Desconstruir o array de rolesDetails
        { $unwind: "$Roles" },
        // Fazer o lookup para obter os detalhes das functionSystemRoles
        {
          $lookup: {
            from: "functionssystemroles",
            localField: "Roles.FunctionSystemRoles",
            foreignField: "_id",
            as: "FunctionSystemRoles",
          },
        },

        { $unwind: "$FunctionSystemRoles" },

        {
          $match: {
            "FunctionSystemRoles.authorized": true,
          },
        },
        {
          $lookup: {
            from: "functionssystems",
            localField: "FunctionSystemRoles.FunctionSystem",
            foreignField: "_id",
            as: "FunctionSystem",
          },
        },

        { $unwind: "$FunctionSystem" },

        {
          $match: {
            $and: [
              { "FunctionSystem.method": { $eq: method } },
              { "FunctionSystem.route": { $eq: route } }
            ]
          },
        },

        {
          $project: {
            UID: 1,
            NomeDaRole: "$Roles.name",
            isAuthorized: "$FunctionSystemRoles.authorized",
            FunctionSystemRoute: "$FunctionSystem.route",
          },
        },
      ];

      const role = await this.findUsingCustomQuery(isUserHaveAccessToRouteQuery);
      if (role != null) {
        return true;
      }

      return false;
    } else {
      //TODO implementar verificação de permissão de rota com o sequelize
      var isUserHaveAccessToRouteQuery: any;

      const userWithPermissions = await this.adapter.model.findAll({
        where: {
          UID: userUID
        },
        include: [
          {
            model: this._tenantConnection.models!.get("UserRole"),
            required: true,
            include: {
              model: this._tenantConnection.models!.get("FunctionSystemRole"),
              required: true,
              include: {
                model: this._tenantConnection.models!.get("FunctionSystem"),
                where: {
                  method: method,
                  route: route
                }
              }
            }
          },
        ],
      });
      //User <- UserRole -> FunctionSystemRole -> FuctionSystem


      return false;
    }
  }

  async isPublicRoute(method: string, route: string): Promise<boolean> {
    try {
      if (this.adapter.databaseType == 'mongodb') {
        return await this.isPublicRouteMongooseImplementation(method, route);
      } else {
        return await this.isPublicRouteSequelizeImplementation(method, route);
      }
    } catch (error) {
      throw new Error("Error to check route is public. Detail: "+ error);
    }
  }

  async isPublicRouteMongooseImplementation(method: string, route: string): Promise<boolean>{
    var isPublicRouteQuery: any;
    isPublicRouteQuery = [

      //Encotrar documento com nome "guest"
      { $match: { name: "guest" } },

      {
        $lookup: {
          from: "functionssystemroles",
          localField: "FunctionSystemRoles",
          foreignField: "_id",
          as: "FunctionSystemRoles",
        },
      },

      { $unwind: "$FunctionSystemRoles" },

      {
        $match: {
          "FunctionSystemRoles.authorized": true,
        },
      },
      {
        $lookup: {
          from: "functionssystems",
          localField: "FunctionSystemRoles.FunctionSystem",
          foreignField: "_id",
          as: "FunctionSystem",
        },
      },

      { $unwind: "$FunctionSystem" },

      {
        $match: {
          $and: [
            { "FunctionSystem.method": { $eq: method } },
            { "FunctionSystem.route": { $eq: route } }
          ]
        },
      },

      {
        $project: {
          name: 1,
          NomeDaRole: "$Roles.name",
          isAuthorized: "$FunctionSystemRoles.authorized",
          FunctionSystemRoute: "$FunctionSystem.route",
        },
      },
    ];

    // const role = await dbAdapter.findUsingQuery(isPublicRouteQuery);
    const role = await this.findUsingCustomQuery(isPublicRouteQuery);
    if (role != null) {
      return true;
    }

    return false;
  }

  async isPublicRouteSequelizeImplementation(method: string, route: string){
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