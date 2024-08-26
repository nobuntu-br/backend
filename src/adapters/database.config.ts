import getMongooseSecurityModels from "../models/mongoose/indexSecurity";
import getSequelizeSecurityModels from "../models/sequelize/indexSecurity.model";
import getMongooseModels from "../models/mongoose";
import getSequelizeModels from "../models/sequelize";
import mongoose, { Connection } from 'mongoose';
import { Dialect, Sequelize } from 'sequelize';
import TenantConnection from '../models/tenantConnection.model';
import UserTenantService from "../services/userTenant.service";
import { TenantConnectionService } from "../services/tenantConnection.service";
import { TenantCredentialService } from "../services/tenantCredential.service";
import { getSecurityTenantConnection } from "./databaseSecurity.config";
import { ITenantCredential, TenantCredential } from "../models/tenantCredential.model";
import { saveRoutes } from "../utils/registerRoutes.util";

const NodeCache = require( "node-cache" );
/**
 * Instância para armazenamento de dados em cache
 */
export const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

/**
 * Armazena todas as instâncias de conexão com banco de dados
 */
export const tenantConnectionService : TenantConnectionService = new TenantConnectionService();

/**
 * Obtem a instância de conexão com o banco de dados de acordo com o tenant
 * @param {*} tenantId Identificador do tenant que está sendo usado
 * @param {*} userUID UID do usuário que está fazendo uso do tenant 
 * @returns Retorna a instância da conexão com o tenant caso encontrado e o usuário tiver permissão, caso não, será retornado null
 */
export async function getTenantConnection(tenantId: string, userUID: string): Promise<TenantConnection | null> {
  try {
    //Obter a conexão padrão com o banco de dados
    const defaultTenantConnection: TenantConnection = await getSecurityTenantConnection();

    //Cria o serviço de UserTenant com base na conexão com o banco de dados
    const userTenantService: UserTenantService = new UserTenantService(defaultTenantConnection.databaseType, defaultTenantConnection.models["userTenant"]);
    //Verifica se o usuário tem acesso ao tenant
    if (await userTenantService.userHasAccessToTenant(userUID, tenantId) == false) {
      return null;
    }

    //Obtem a instância de conxão com o banco de dados
    const tenantConnection : TenantConnection = tenantConnectionService.findOneConnection(tenantId);

    if(tenantConnection == null){
      
      const tenantCredentialService : TenantCredentialService = new TenantCredentialService(defaultTenantConnection.databaseType, defaultTenantConnection.models["tenantCredential"]);
      const tenantCredential = await tenantCredentialService.findById(tenantId);

      if(tenantCredential == null || tenantCredential.dbType == null || tenantCredential.dbHost == null){
        throw new Error("Tenant Credential is null");
      }

      await connectTenant(tenantId, tenantCredential);

    }

    return tenantConnection;
  } catch (error) {
    throw new Error('Banco de dados não encontrado');
  }

};

/**
 * Realiza a conexão com o banco de dados de acordo com o tipo de banco de dados. Seta os models de acordo com o banco de dados.
 * @param tenantId
 * @param databaseType
 * @param dbURI
 * @returns
 */
export default async function connectTenant(tenantId: string, tenantCredential: ITenantCredential): Promise<TenantConnection> {
  
  if(tenantCredential.dbType == undefined || tenantCredential.dbType == null){
    console.warn("Erro ao realizar a conexão com o banco de dados. Tipo de banco de dados não definido");
    throw new Error("Erro ao realizar a conexão com o banco de dados. Tipo de banco de dados não definido");
  }
  
  try {

    let tenantConnection: TenantConnection;

    const databaseURI : string = buildURI(tenantCredential);
    const databaseType : string = tenantCredential.dbType;

    if (tenantId === process.env.SECURITY_TENANT_DATABASE_ID) {
      tenantConnection = await connectToDatabase(databaseType, databaseURI, true);
      tenantConnection.models = await getModelsSecurity(databaseType, tenantConnection.connection);
    } else {
      tenantConnection = await connectToDatabase(databaseType, databaseURI, false);
      tenantConnection.models = await getModels(databaseType, tenantConnection.connection);

      await saveRoutes(tenantConnection); //TODO colocar para salvar as rotas novamente
    }

    

    tenantConnectionService.setOnTenantConnectionPool(tenantId, tenantConnection); 

    return tenantConnection;

  } catch (error) {
    console.warn("Erro ao realizar a conexão com o banco de dados!", error);
    throw new Error("Erro ao realizar a conexão com o banco de dados!");
  }
}

/**
 * Define os models da banco de dados Security na conexão
 * @param dbType Tipo de banco de dados
 * @param connection Instância da conexão com o banco de dados
 * @returns
 */
function getModelsSecurity(databaseType: string, connection: any): any {
  if (databaseType === "mongodb") {
    return getMongooseSecurityModels(connection);
  } else {
    return getSequelizeSecurityModels(connection);
  }

  return connection;
}

/**
 * Define os models da banco de dados na conexão
 * @param databaseType Tipo de banco de dados
 * @param connection Instância da conexão com o banco de dados
 * @returns
 */
function getModels(databaseType: string, connection: any): any {
  if (databaseType === "mongodb") {
    return getMongooseModels(connection);
  } else {
    return getSequelizeModels(connection);
  }

  return connection;
}

/**
 * Realiza a conexão com o banco de dados definido
 * @param databaseType Qual banco de dados será usado
 * @param uri Dados para realizar a conexão com o banco de dados especificado
 * @param isDefaultConnection Se a conexão é padrão (só o Security pode ser padrão)
 * @returns Retorna uma instância da TenantConnection que é a conexão com o banco de dados especificado
 */
export async function connectToDatabase(databaseType: string, uri: string, isDefaultConnection: boolean): Promise<TenantConnection> {
  if (databaseType === 'mongodb') {
    const _connection = await connectToDatabaseWithMongoose(uri);
    return new TenantConnection('mongodb', _connection, isDefaultConnection);
  } else if (databaseType === 'postgres') {
    const _connection = await connectToDatabaseWithSequelize("postgres", uri);
    return new TenantConnection('postgres', _connection, isDefaultConnection);
  } else if (databaseType === 'mysql') {
    const _connection = await connectToDatabaseWithSequelize("mysql", uri);
    return new TenantConnection('mysql' , _connection, isDefaultConnection);
  } else if (databaseType === 'firebird') {
    // TODO: Implement Firebird connection
    throw new Error('Método não implementado no momento');
  } else {
    throw new Error('Tipo de banco de dados não suportado');
  }
}

async function connectToDatabaseWithMongoose(uri: string): Promise<Connection> {
  try {
    const connection = await mongoose.createConnection(uri);
    console.log("Conexão com banco de dados MongoDB feita!");
    return connection;
  } catch (error) {
    console.log({ error: "Erro durante a conexão com o banco de dados", description: error });
    throw new Error('Erro ao conectar com banco de dados');
  }
}

async function connectToDatabaseWithSequelize(databaseType: string, uri: string): Promise<Sequelize> {
  try {
    const sequelize = new Sequelize(uri, {
      dialect: databaseType as Dialect,
      logging: false,
    });

    await sequelize.authenticate();
    console.log("Conexão com banco de dados "+databaseType+" feita");
    return sequelize;
  } catch (error) {
    console.log({ error: "Erro durante a conexão com o banco de dados", description: error });
    throw new Error('Erro ao conectar com banco de dados');
  }
}

async function connectToDatabaseWithFirebird(uri: string): Promise<void> {
  // TODO: Implement Firebird connection
  // Armazenar no array de instâncias de conexão
}

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

/**
 * Faz a criação da string de conexão com o banco de dados
 * @param tenantCredential Dados de conexão com o banco de dados
 * @returns Retorna a string de conexão com o banco de dados
 */
export function buildURI(tenantCredential: TenantCredential): string {
  switch (tenantCredential.dbType) {
    case 'mongodb':
      return buildMongoDBURI(tenantCredential);
    case 'postgres':
      return buildPostgresURI(tenantCredential);
    case 'mysql':
      return buildMySQLURI(tenantCredential); 
    default:
      return buildPostgresURI(tenantCredential);
  }
}

/**
 * Realiza a contrução da string de conexão com o banco de dados mongodb
 * @param tenantCredential Dados para realizar a conexão com o banco de dados
 * @returns Retorna a string de conexão com o banco de dados mongodb
 */
export function buildMongoDBURI(tenantCredential: TenantCredential): string {
  return "mongodb+srv://" + tenantCredential.dbUsername + ":" + tenantCredential.dbPassword + "@" + tenantCredential.dbHost + "/"+tenantCredential.dbName+"?"+tenantCredential.dbConfig
}

/**
 * Realiza a contrução da string de conexão com o banco de dados postgres
 * @param tenantCredential Dados para realizar a conexão com o banco de dados
 * @returns Retorna a string de conexão com o banco de dados postgres
 */
export function buildPostgresURI(tenantCredential: TenantCredential): string {
  return "postgres://" + tenantCredential.dbUsername + ":" + tenantCredential.dbPassword + "@" + tenantCredential.dbHost + ":" + tenantCredential.dbPort + "/" + tenantCredential.dbName;
}

/**
 * Realiza a contrução da string de conexão com o banco de dados mysql
 * @param tenantCredential Dados para realizar a conexão com o banco de dados
 * @returns Retorna a string de conexão com o banco de dados postgres
 */
export function buildMySQLURI(tenantCredential: TenantCredential): string {
  return "mysql://" + tenantCredential.dbUsername + ":" + tenantCredential.dbPassword + "@" + tenantCredential.dbHost + ":" + tenantCredential.dbPort + "/" + tenantCredential.dbName;
}