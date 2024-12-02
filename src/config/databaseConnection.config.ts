import TenantConnection from "../models/tenantConnection.model";
import mongoose, { Connection } from 'mongoose';
import { Dialect, Sequelize } from 'sequelize';
import { IDatabaseCredential } from "../models/databaseCredential.model";

/**
 * Realiza a conexão com o banco de dados definido
 * @param databaseCredential Dados das credenciais do banco de dados
 * @param isTenantManagerDatabase Se a conexão é padrão (só o Security pode ser padrão)
 * @returns Retorna uma instância da TenantConnection que é a conexão com o banco de dados especificado
 */
export async function connectToDatabase(databaseCredential: IDatabaseCredential, isTenantManagerDatabase: boolean): Promise<TenantConnection> {
  
  try {
    let _databaseConnection;
    if (databaseCredential.type === 'mongodb') {
      _databaseConnection = await connectToDatabaseWithMongoose(databaseCredential);
    } else if (databaseCredential.type === 'firebird') {
      _databaseConnection = await connectToDatabaseWithFirebird(databaseCredential);
    } else {
      _databaseConnection = await connectToDatabaseWithSequelize(databaseCredential, true);
    }
    return new TenantConnection(databaseCredential.type , _databaseConnection, isTenantManagerDatabase);
  } catch (error) {
    throw new Error('Erro durante a conexão com o banco de dados. ' +error);
  }
}

async function connectToDatabaseWithMongoose(databaseCredential: IDatabaseCredential): Promise<Connection> {
  try {
    const uri: string = buildMongoDBURI(databaseCredential);

    const connection = await mongoose.createConnection(uri).asPromise();

    console.log("Conexão com banco de dados MongoDB feita!");
    return connection;
  } catch (error) {
    throw new Error("Erro to connect database using Mongoose. Detail: "+ error);
  }
}

async function connectToDatabaseWithSequelize(databaseCredential: IDatabaseCredential, rejectUnauthorizedSSL: boolean): Promise<Sequelize> {
  try {
    const uri: string = buildSequelizeURI(databaseCredential);

    const sequelize = new Sequelize(uri, {
      dialect: databaseCredential.type as Dialect,
      logging: false,
      dialectOptions: {
        ssl: {
          require: databaseCredential.sslEnabled,
          rejectUnauthorized: rejectUnauthorizedSSL, // Rejeita certificados não confiáveis (true se for banco em produção)
          ca: databaseCredential.sslCertificateAuthority ? '' : databaseCredential.sslCertificateAuthority,
          key: databaseCredential.sslPrivateKey ? '' : databaseCredential.sslPrivateKey,
          cert: databaseCredential.sslCertificate ? '' : databaseCredential.sslCertificate,
        },
      }
    });

    await sequelize.authenticate();
    console.log("Connected "+ databaseCredential.type + " database.");
    return sequelize;
  } catch (error) {
    throw new Error("Error to connect database using sequelize lib. Detail: "+ error);
  }
}

async function connectToDatabaseWithFirebird(databaseCredential: IDatabaseCredential): Promise<any> {
  // TODO: Implement Firebird connection
  throw new Error("Method not implemented");
}

/**
 * Realiza a contrução da string de conexão com o banco de dados mongodb
 * @param databaseCredential Dados para realizar a conexão com o banco de dados
 * @returns Retorna a string de conexão com o banco de dados mongodb
 * O formato de uma URI é por padrão: <tipo_de_banco_de_dados_usado>://<usuário>:<senha>@<host>:<porta>/<nome_do_banco>?<opções>
 */
export function buildMongoDBURI(databaseCredential: IDatabaseCredential): string {

  let port: string;
  if(databaseCredential.name === "mongodb" && (databaseCredential.port != null && databaseCredential.port != undefined)){
    port = databaseCredential.port;
  } else {
    //Se for com uso de SRV, fica sem a porta
    port = "";
  }

  let protocol: string;
  if(databaseCredential.srvEnabled == true){
    protocol = "mongodb+srv";
  } else {
    protocol = "mongodb";
  }

  return protocol+"://" + databaseCredential.username + ":" + databaseCredential.password + "@" + databaseCredential.host + "/" + databaseCredential.name + "?" + databaseCredential.options
}

/**
 * @param databaseCredential Dados para realizar a conexão com o banco de dados
 * @returns Retorna a string de conexão com o banco de dados suportados pelo Sequelize
 */
export function buildSequelizeURI(databaseCredential: IDatabaseCredential): string {
  return databaseCredential.type+"://" + databaseCredential.username + ":" + databaseCredential.password + "@" + databaseCredential.host + ":" + databaseCredential.port + "/" + databaseCredential.name;
}