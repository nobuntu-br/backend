import TenantConnection from "../models/tenantConnection.model";
import { ITenantCredential, validateTenantCredential } from "../models/tenantCredential.model";
import connectTenant, { tenantConnectionService } from "./database.config";

/**
* Obter a instância de conexão com o banco de dados. Sendo esse banco de dados do banco responsável por armazenar os tenants. Sendo chaamdo de banco 'default'.
* @returns retornar uma instância de conexão com o banco de dados
*/
export async function getSecurityTenantConnection(): Promise<TenantConnection> {

  const tenantId = process.env.SECURITY_TENANT_DATABASE_ID;

  const tenantCredential : ITenantCredential = {
    dbType: process.env.SECURITY_TENANT_DATABASE_TYPE,
    dbName: process.env.SECURITY_TENANT_DATABASE_NAME,
    dbUsername: process.env.SECURITY_TENANT_DATABASE_USERNAME,
    dbPassword: process.env.SECURITY_TENANT_DATABASE_PASSWORD,
    dbHost: process.env.SECURITY_TENANT_DATABASE_HOST,
    dbPort: process.env.SECURITY_TENANT_DATABASE_PORT,
    dbConfig: process.env.SECURITY_TENANT_DATABASE_CONFIG
  }

  //TODO fazer a verificação para que todos os campos estejam preechidos
  if(validateTenantCredential(tenantCredential) == false ||  tenantId == undefined){
    throw new Error(`Dados ausentes ao realizar a conexão com o banco security`);
  }

  try {

    const tenantConnection : TenantConnection = tenantConnectionService.findOneConnection(tenantId); 
    if (tenantConnection == null) {
      await connectTenant(tenantId, tenantCredential);
      console.log("Realizado conexão com o banco de dados Security. Responsável pelo controle de Tenants.");
    }

    return tenantConnection;

  } catch (error) {
    throw new Error(`Erro ao realizar a conexão com o banco security: ${error}`);
  }
}
