import { buildURI, connectToDatabase } from "./databaseConnection.config";
import { disconnectDatabase } from "./databaseDisconnection.config";
import { TenantCredential } from "../models/tenantCredential.model";
import TenantConnection from "../models/tenantConnection.model";
import { ValidationError } from "../errors/validation.error";

/**
 * Realiza teste de conexão com o banco de dados
 * @param tenantCredential Credenciais de acesso ao banco de dados
 * @returns Se ocorreu sucesso na conexão, retorna credenciais de acesso ao banco de dados
 */
export async function testConnectToDatabase(tenantCredential: TenantCredential): Promise<boolean> {
  var tenantConnection: TenantConnection | null = null;
  
  try {
    const uri: string = buildURI(tenantCredential);
    tenantConnection = await connectToDatabase(tenantCredential.dbType!, uri, false);

    if(tenantConnection != null){
      await disconnectDatabase(tenantConnection);
    }

    return true;
  } catch (error) {
    // throw new ValidationError("Não foi possível conectar ao banco de dados");
    return false;
  } 
}