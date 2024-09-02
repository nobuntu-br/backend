import TenantConnection from "../models/tenantConnection.model";
import mongoose, { Connection } from 'mongoose';
import { Dialect, Sequelize } from 'sequelize';

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
