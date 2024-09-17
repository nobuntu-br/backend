import TenantConnection from "../models/tenantConnection.model";
import { connectSecurityTenant, tenantConnectionService } from "./database.config";

/**
* Obter a instância de conexão com o banco de dados. Sendo esse banco de dados do banco responsável por armazenar os tenants. Sendo chaamdo de banco 'default'.
* @returns retornar uma instância de conexão com o banco de dados
*/
export async function getSecurityTenantConnection(): Promise<TenantConnection> {

  const tenantId = process.env.SECURITY_TENANT_DATABASE_ID;

  if(tenantId == undefined){
    throw new Error(`Dados ausentes ao realizar a conexão com o banco security`);
  }

  try {

    const tenantConnection : TenantConnection = tenantConnectionService.findOneConnection(tenantId); 
    if (tenantConnection == null) {
      // await connectTenant(tenantId, tenantCredential);
      await connectSecurityTenant(tenantId);
    }

    return tenantConnection;

  } catch (error) {
    throw new Error(`Erro ao realizar a conexão com o banco security: ${error}`);
  }
}
