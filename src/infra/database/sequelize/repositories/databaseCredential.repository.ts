import { DatabaseCredential, IDatabaseCredentialDatabaseModel } from "../../../../domain/entities/fixes/databaseCredential.model";
import TenantConnection from "../../../../domain/entities/fixes/tenantConnection.model";
import { IDatabaseCredentialRepository } from "../../../../domain/repositories/fixes/databaseCredential.repository";
import { IDatabaseAdapter } from "../../IDatabase.adapter";

export class DatabaseCredentialRepositorySequelize implements IDatabaseCredentialRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential>) {}
  
  async getDatabaseCredentialByTenantId(tenantId: number): Promise<DatabaseCredential[]> {
    const data = await this.tenantConnection.models!.get("nfDatabasePermission").findAll({
      where: {
        tenantId: tenantId
      },
      include: [
        {
          model: this.tenantConnection.models!.get("nfDatabaseCredential"),
          as: "databaseCredential",
          required: true,
        },
        {
          model: this.tenantConnection.models!.get("nfuser"),
          as: "user",
          required: true
        }
      ],
    });

    console.log("databaseCredentials obtidas da pesquisa com Sequelize: ", data);
    return [];
  }

}
