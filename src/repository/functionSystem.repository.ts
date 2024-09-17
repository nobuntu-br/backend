import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { FunctionSystem } from "../models/functionSystem.model";
import BaseRepository from "./base.repository";

export default class FunctionSystemRepository extends BaseRepository<FunctionSystem> {

  constructor(dbType: DbType, model: any) {
    const _adapter: IDatabaseAdapter<FunctionSystem> = createDbAdapter<FunctionSystem>(dbType, model, FunctionSystem.fromJson);
    super(_adapter);
  }

  async isPublicRoute(method: string, route: string, dbType: DbType): Promise<boolean> {
    if (dbType == 'mongodb') {
      var isPublicRouteQuery: any;
      isPublicRouteQuery = [
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
      const role = await this.findCustom(isPublicRouteQuery);
      if (role != null) {
        return true;
      }

      return false;
    } else {
      //TODO implementar verificação de permissão de rota com o sequelize
      return false;
    }
  }

}