import { where } from "sequelize";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import { IDatabaseAdapter } from "../../IDatabase.adapter";
import { IDatabasePermissionDatabaseModel, DatabasePermission } from "../../../../domain/entities/databasePermission.model";
import { IUser } from "../../../../domain/entities/user.model";
import { IDatabasePermissionRepository } from "../../../../domain/repositories/databasePermission.repository";

export class DatabasePermissionRepositorySequelize implements IDatabasePermissionRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<IDatabasePermissionDatabaseModel, DatabasePermission>) {}
  
  async getUsersWithTenantAccess(tenantId: number, ownerUserId: number): Promise<IUser[]> {

    const data = await this.tenantConnection.models!.get("DatabasePermission").findAll({
      where: {
        tenantId: tenantId
      },
      include: [
        {
          model: this.tenantConnection.models!.get("User"),
          as: "user",
          required: true,
          attributes: { exclude: ["password"] },
        }
      ],
    });

    //A linha abaixo irá percorrer os resultados e irá com o ".get()" função do Sequelize, extrair apenas dados brutos do modelo, removendo métodos e metadados da instância do Sequelize
    const formattedResults = data.map((record : any) => record.get({ plain: true }));
    const users = formattedResults.map((formatedResult: any) => formatedResult.user);
    return users;
  }

}
