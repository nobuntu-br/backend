import { ITenantDatabaseModel, Tenant } from "../../../../domain/entities/tenant.model";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import { ITenantRepository } from "../../../../domain/repositories/tenant.repository";
import { IDatabaseAdapter } from "../../IDatabase.adapter";


export class TenantRepositoryMongoose implements ITenantRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<ITenantDatabaseModel, Tenant>) { }

  async getTenantsByUserOwner(UserUID: string): Promise<ITenantDatabaseModel[]> {
    let query = [
      {
        $lookup: {
          from: "user",
          localField: "_id",
          foreignField: "ownerUserId",
          as: "User",
        },
      }
    ];

    const data = await this.adapter.findUsingCustomQuery(query);

    console.log("data obtidos da pesquisa com Mongoose: ", data);

    return data;
  }

}
