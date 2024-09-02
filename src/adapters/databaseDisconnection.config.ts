import TenantConnection from "../models/tenantConnection.model";

export async function disconnectTenant(tenantConnection: TenantConnection){
  //TODO remover tenant da lista de tenans
  
  if (tenantConnection.databaseType === 'mongodb') {
    await disconnectToDatabaseWithMongoose(tenantConnection);
  } else if (tenantConnection.databaseType === 'postgres') {
    await disconnectToDatabaseWithSequelize(tenantConnection);
  } else if (tenantConnection.databaseType === 'mysql') {
    await disconnectToDatabaseWithSequelize(tenantConnection);
  } else if (tenantConnection.databaseType === 'firebird') {
    // TODO: Implement Firebird connection
    throw new Error('Método não implementado no momento');
  } else {
    throw new Error('Erro na desconexão com o banco de dados');
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
