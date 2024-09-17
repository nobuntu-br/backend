import TenantConnection from "../models/tenantConnection.model";
import mongoose, { Connection } from 'mongoose';
import { Dialect, Sequelize } from 'sequelize';
import { TenantCredential } from "../models/tenantCredential.model";

/**
 * Realiza a conexão com o banco de dados definido
 * @param databaseType Qual banco de dados será usado
 * @param uri Dados para realizar a conexão com o banco de dados especificado
 * @param isDefaultConnection Se a conexão é padrão (só o Security pode ser padrão)
 * @returns Retorna uma instância da TenantConnection que é a conexão com o banco de dados especificado
 */
export async function connectToDatabase(databaseType: string, uri: string, isDefaultConnection: boolean): Promise<TenantConnection> {
  try {
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
  } catch (error) {
    throw new Error('Erro durante a conexão com o banco de dados. '+error);
  }
}

async function connectToDatabaseWithMongoose(uri: string): Promise<Connection> {
  try {
    const connection = await mongoose.createConnection(uri).asPromise();
    console.log("Conexão com banco de dados MongoDB feita!");
    return connection;
  } catch (error) {
    throw new Error('Erro ao conectar com banco de dados com a biblioteca mongoose!');
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
    throw new Error('Erro ao conectar com banco de dados');
  }
}

async function connectToDatabaseWithFirebird(uri: string): Promise<void> {
  // TODO: Implement Firebird connection
  // Armazenar no array de instâncias de conexão
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
  return "mongodb+srv://" + tenantCredential.dbUsername + ":" + tenantCredential.dbPassword + "@" + tenantCredential.dbHost + "/" + tenantCredential.dbName + "?" + tenantCredential.dbConfig
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