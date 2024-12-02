import { connectSecurityTenant } from "../../config/database.config";
import TenantConnection from "../../models/tenantConnection.model";
import { TenantConnectionService } from "../../services/tenantConnection.service";

export class GetSecurityTenantConnectionUseCase {
  constructor() { }

  /**
  * Obter a instância de conexão com o banco de dados. Sendo esse banco de dados do banco responsável por armazenar os tenants. Sendo chaamdo de banco 'default'.
  * @returns retornar uma instância de conexão com o banco de dados
  */
  async execute(): Promise<TenantConnection> {
    const tenantId = process.env.SECURITY_TENANT_DATABASE_ID;

    if (tenantId == undefined) {
      throw new Error(`Dados ausentes ao realizar a conexão com o banco security`);
    }

    try {

      const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance; 

      const tenantConnection: TenantConnection = tenantConnectionService.findOneConnection(tenantId);
      if (tenantConnection != null) {
        return tenantConnection;
      }

      return await connectSecurityTenant(tenantId);

    } catch (error) {
      throw new Error(`Erro ao obter a instância da conexão com o banco de dados de controle de tenants: ${error}`);
    }
  }

}