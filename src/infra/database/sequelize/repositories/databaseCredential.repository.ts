import { where } from "sequelize";
import { DatabaseCredential, IDatabaseCredentialDatabaseModel } from "../../../../domain/entities/databaseCredential.model";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import { IDatabaseCredentialRepository } from "../../../../domain/repositories/databaseCredential.repository";
import { IDatabaseAdapter } from "../../IDatabase.adapter";

export class DatabaseCredentialRepositorySequelize implements IDatabaseCredentialRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<IDatabaseCredentialDatabaseModel, DatabaseCredential>) {}
  
  async getDatabaseCredentialByTenantId(tenantId: number, ownerUserId: number): Promise<DatabaseCredential[]> {

    const data = await this.tenantConnection.models!.get("DatabasePermission").findAll({
      where: {
        tenantId: tenantId
      },
      include: [
        {
          model: this.tenantConnection.models!.get("DatabaseCredential"),
          as: "databaseCredential",
          required: true,
          attributes: { exclude: ["password"] },
        },
        {
          model: this.tenantConnection.models!.get("User"),
          as: "user",
          required: true,
          where: {
            id: ownerUserId
          },
          attributes: [], // Oculta os dados da tabela User na resposta
        }
      ],
    });

    //A linha abaixo irá percorrer os resultados e irá com o ".get()" função do Sequelize, extrair apenas dados brutos do modelo, removendo métodos e metadados da instância do Sequelize
    const formattedResults = data.map((record : any) => record.get({ plain: true }));
    const databaseCredentials = formattedResults.map((formatedResult: any) => formatedResult.databaseCredential);
    return databaseCredentials;
  }

}
