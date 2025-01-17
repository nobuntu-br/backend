import TenantConnection from "../../domain/entities/tenantConnection.model";
import { TenantConnectionService } from "../../domain/services/tenantConnection.service";

export async function disconnectDatabase(tenantConnection: TenantConnection){
  
  const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;
  tenantConnectionService.removeConnection(tenantConnection);
  
  if (tenantConnection.databaseType === 'mongodb') {
    await disconnectToDatabaseWithMongoose(tenantConnection);
  } else if (tenantConnection.databaseType === 'firebird') {
    // TODO: Implement Firebird connection
    throw new Error('Método não implementado no momento');
  } else {
    await disconnectToDatabaseWithSequelize(tenantConnection);
  }
}

/**
 * Encerra a conexão com o banco de dados, realizando o uso da biblioteca mongoose
 * @param tenantConnection Dados para realizar a conexão com o banco de dados
 */
async function disconnectToDatabaseWithMongoose(tenantConnection: TenantConnection){
  try {
    await tenantConnection.connection.close();
    console.log("Conexão encerrada com banco de dados usando a biblioteca mongoose!");
  } catch (error) {
    console.warn(error);
    throw new Error("Erro na desconexão com o banco de dados com a biblioteca mongoose");
  }
}

/**
 * Encerra a conexão com o banco de dados, realizando o uso da biblioteca sequelize
 * @param tenantConnection Dados para realizar a conexão com o banco de dados
 */
async function disconnectToDatabaseWithSequelize(tenantConnection: TenantConnection){
  try {
    await tenantConnection.connection.close();
    console.log("Conexão encerrada com banco de dados usando a biblioteca do sequelize!");
  } catch (error) {
    console.warn(error);
    throw new Error("Erro na desconexão com o banco de dados com a biblioteca sequelize");
  }
} 
