import { Op } from "sequelize";
import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { UserTenant } from "../models/userTenant.model";
import BaseRepository from "./base.repository";

export default class UserTenantRepository extends BaseRepository<UserTenant>{

  constructor(dbType: DbType, model: any, databaseConnection: any){
    const _adapter : IDatabaseAdapter<UserTenant> = createDbAdapter<UserTenant>(dbType, model, UserTenant.fromJson);
    super(_adapter, databaseConnection);
  }

  async getUserTenantsWithDefaultTenant(dbType: DbType, model: any, UserUID: string): Promise<UserTenant[] | null>{
    if(dbType == 'mongodb'){
      throw new Error("This method is not implemented yet");
    } else {
      try {
        const userTenants = await model.findAll({
          where: {
            UserUID: {
              [Op.or]: [UserUID, null],
            },
          },
        });
    
        var usersTenants : UserTenant[] = [];

        userTenants.forEach((userTenant: UserTenant) => {
          usersTenants.push(UserTenant.fromJson(userTenant));
        });

        return userTenants;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error("Erro ao obter os userTenants")
      }
    }
  }

}
