import { ITenantDatabaseModel, Tenant } from "../../../../domain/entities/tenant.model";
import TenantConnection from "../../../../domain/entities/tenantConnection.model";
import { ITenantRepository } from "../../../../domain/repositories/tenant.repository";
import { IDatabaseAdapter } from "../../IDatabase.adapter";


export class TenantRepositorySequelize implements ITenantRepository {
  constructor(private tenantConnection: TenantConnection, private adapter: IDatabaseAdapter<ITenantDatabaseModel, Tenant>) {}
  
  async getTenantsByUserOwner(userUID: string): Promise<ITenantDatabaseModel[]> {
    //Procurar o tenant com base no usuário com o UID
    const data = await this.tenantConnection.models!.get("Tenant").findAll({
      include: [
        {
          model: this.tenantConnection.models!.get("User"),
          as: "user",
          required: true,
          attributes: [], //Isso é um array que define quais campos do usuário serão retornados. Como não tem nenhum, nada do usuário será retornado
          where: {
            UID: userUID
          }
        }
      ],
    });

    //A linha abaixo irá percorrer os resultados e irá com o ".get()" função do Sequelize, extrair apenas dados brutos do modelo, removendo métodos e metadados da instância do Sequelize
    const formattedResults = data.map((record : any) => record.get({ plain: true }));
    return formattedResults;
  }
  
}
