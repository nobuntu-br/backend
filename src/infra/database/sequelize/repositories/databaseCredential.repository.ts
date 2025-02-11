import { DatabaseCredential, IDatabaseCredentialDatabaseModel } from "../../../../domain/entities/databaseCredential.model";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import { IDatabaseCredentialRepository } from "../../../../domain/repositories/databaseCredential.repository";
import { IDatabaseAdapter } from "../../IDatabase.adapter";

export class DatabaseCredentialRepositorySequelize implements IDatabaseCredentialRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential>) {}
  
  async getDatabaseCredentialByTenantId(tenantId: number): Promise<DatabaseCredential[]> {
    const data = await this.tenantConnection.models!.get("DatabasePermission").findAll({
      where: {
        tenantId: tenantId
      },
      include: [
        {
          model: this.tenantConnection.models!.get("DatabaseCredential"),
          as: "databaseCredential",
          required: true,
        },
        {
          model: this.tenantConnection.models!.get("user"),
          as: "user",
          required: true
        }
      ],
    });

    console.log("databaseCredentials obtidas da pesquisa com Sequelize: ", data);
    return [];
  }

}
