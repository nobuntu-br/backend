import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { FunctionSystemRole } from "../models/functionSystemRole.model";
import BaseRepository from "./base.repository";

export default class FunctionSystemRoleRepository extends BaseRepository<FunctionSystemRole> {

  constructor(dbType: DbType, model: any) {
    const _adapter: IDatabaseAdapter<FunctionSystemRole> = createDbAdapter<FunctionSystemRole>(dbType, model, FunctionSystemRole.fromJson);
    super(_adapter);
  }

  async isUserHaveAccessToRoute(userOID: string, method: string, route: string, dbType: DbType): Promise<boolean | null> {
    if (dbType == 'mongodb') {
      var isUserHaveAccessToRouteQuery: any;
      isUserHaveAccessToRouteQuery = [
        // Filtrar pelo UID do usuário
        { $match: { UID: userOID } },
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

      const role = await this.findCustom(isUserHaveAccessToRouteQuery);
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