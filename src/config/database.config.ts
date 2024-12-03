import getMongooseSecurityModels from "../models/mongoose/indexSecurity";
import getSequelizeSecurityModels from "../models/sequelize/indexSecurity.model";
import getMongooseModels from "../models/mongoose";
import getSequelizeModels from "../models/sequelize";
import TenantConnection from '../models/tenantConnection.model';
import UserTenantService from "../services/databasePermission.service";
import { TenantConnectionService } from "../services/tenantConnection.service";
import { DatabaseCredentialService } from "../services/databaseCredential.service";
import { DatabaseCredential, IDatabaseCredential } from "../models/databaseCredential.model";
import { saveRoutes } from "../utils/registerRoutes.util";
import { connectToDatabase } from "./databaseConnection.config";
import { decryptDatabasePassword } from "../utils/crypto.util";
import { GetSecurityTenantConnectionUseCase } from "../useCases/tenant/getSecurityTenantConnection.useCase";

const NodeCache = require("node-cache");
/**
 * Instância para armazenamento de dados em cache
 */
export const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });



/**
 * Obtem a instância de conexão com o banco de dados de acordo com o tenant
 * @param {*} tenantId Identificador do tenant que está sendo usado
 * @param {*} userUID UID do usuário que está fazendo uso do tenant 
 * @returns Retorna a instância da conexão com o tenant caso encontrado e o usuário tiver permissão, caso não, será retornado null
 */
export async function getTenantConnection(tenantId: string, userUID: string): Promise<TenantConnection | null> {
  try {
    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;

    //Obter a conexão padrão com o banco de dados
    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const defaultTenantConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    //Cria o serviço de UserTenant com base na conexão com o banco de dados
    const userTenantService: UserTenantService = new UserTenantService(defaultTenantConnection.databaseType, defaultTenantConnection.connection);
    //Verifica se o usuário tem acesso ao tenant
    if (await userTenantService.userHasAccessToTenant(userUID, tenantId) == false) {
      return null;
    }

    //Obtem a instância de conxão com o banco de dados
    const tenantConnection: TenantConnection | null = tenantConnectionService.findOneConnection(tenantId);

    if (tenantConnection == null) {

      const tenantCredentialService: DatabaseCredentialService = new DatabaseCredentialService(defaultTenantConnection.databaseType, defaultTenantConnection.connection);
      const databaseCredential = await tenantCredentialService.findById(tenantId);

      if (databaseCredential == null || databaseCredential.type == null || databaseCredential.host == null) {
        throw new Error("Tenant Credential is null");
      }

      await connectTenant(tenantId, databaseCredential);

    }

    return tenantConnection;
  } catch (error) {
    throw new Error('Banco de dados não encontrado');
  }

};

/**
 * Realiza a conexão com o banco de dados de acordo com o tipo de banco de dados. Seta os models de acordo com o banco de dados.
 * @param tenantId 
 * @param databaseCredential Dados de credenciais para realizar a conexão do banco de dados
 * @returns
 */
export async function connectTenant(tenantId: string, databaseCredential: IDatabaseCredential): Promise<TenantConnection> {

  //TODO verificar se o tenant já não tem conexão realizada

  //TODO verificar se precisa atualizar o banco

  if (databaseCredential.type == undefined || databaseCredential.type == null || databaseCredential.password == null) {
    throw new Error("Erro ao realizar a conexão com o banco de dados. Tipo de banco de dados não definido");
  }

  try {
    //Descriptgrafar a senha do tenant
    databaseCredential.password = decryptDatabasePassword(databaseCredential.password)!;

    //TODO Descriptogradar as chaves SSL
    
    let tenantConnection: TenantConnection;
    // const databaseURI: string = buildURI(databaseCredential);
    
    const databaseType: string = databaseCredential.type;

    tenantConnection = await connectToDatabase(databaseCredential, false);
    tenantConnection.models = await getModels(databaseType, tenantConnection.connection);

    await saveRoutes(tenantConnection);

    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;
    tenantConnectionService.setOnTenantConnectionPool(tenantId, tenantConnection);

    return tenantConnection;

  } catch (error) {
    throw new Error("Error to connect tenant database. Detail: " + error);
  }
}

/*
export async function connectSecurityTenant(tenantId: string): Promise<TenantConnection> {

  try {
    const srvEnabledFromEnvironmentVariables: string | undefined = process.env.SECURITY_TENANT_DATABASE_SRV_ENABLED;
    let srvEnabled: boolean = false;

    if (srvEnabledFromEnvironmentVariables == undefined) {
      throw new Error("SECURITY_TENANT_DATABASE_SRV_ENABLED is not populated.");
    }

    if (srvEnabledFromEnvironmentVariables === "true") {
      srvEnabled = true;
    } else if (srvEnabledFromEnvironmentVariables === "false") {
      srvEnabled = false;
    }

    const sslEnabledEnvironmentVariables: string | undefined = process.env.SECURITY_TENANT_DATABASE_SSL_ENABLED;
    let sslEnabled: boolean = false;

    if (sslEnabledEnvironmentVariables == undefined) {
      throw new Error("SECURITY_TENANT_DATABASE_SSL_ENABLED is not populated.");
    }

    if (sslEnabledEnvironmentVariables === "true") {
      srvEnabled = true;
    } else if (sslEnabledEnvironmentVariables === "false") {
      srvEnabled = false;
    }

    const poolSize: number = parseInt(process.env.SECURITY_TENANT_DATABASE_POOLSIZE || '1', 10);
    const timeout: number = parseFloat(process.env.SECURITY_TENANT_DATABASE_TIMEOUT || '3000');

    if (isNaN(poolSize)) {
      throw new Error("SECURITY_TENANT_DATABASE_POOLSIZE invalid.");
    }

    if (isNaN(timeout)) {
      throw new Error("SECURITY_TENANT_DATABASE_TIMEOUT invalid.");
    }

    console.log(process.env.SECURITY_TENANT_DATABASE_SRV_ENABLED);

    console.log(process.env.SECURITY_TENANT_DATABASE_SRV_ENABLED === "true");
    console.log(srvEnabled);

    const databaseCredential: DatabaseCredential = new DatabaseCredential({
      type: process.env.SECURITY_TENANT_DATABASE_TYPE as "mongodb" | "postgres" | "mysql" | "sqlite" | "mariadb" | "mssql" | "db2" | "snowflake" | "oracle" | "firebird",
      name: process.env.SECURITY_TENANT_DATABASE_NAME,
      username: process.env.SECURITY_TENANT_DATABASE_USERNAME,
      password: process.env.SECURITY_TENANT_DATABASE_PASSWORD,
      host: process.env.SECURITY_TENANT_DATABASE_HOST,
      port: process.env.SECURITY_TENANT_DATABASE_PORT,
      srvEnabled: srvEnabled,
      options: process.env.SECURITY_TENANT_DATABASE_OPTIONS,
      storagePath: process.env.SECURITY_TENANT_DATABASE_STORAGE_PATH,
      sslEnabled: sslEnabled,
      poolSize: poolSize,
      timeOutTime: timeout,
      //SSL data
      sslCertificateAuthority: process.env.SECURITY_TENANT_DATABASE_SSL_CERTIFICATE_AUTHORITY,
      sslPrivateKey: process.env.SECURITY_TENANT_DATABASE_SSL_PRIVATE_KEY,
      sslCertificate: process.env.SECURITY_TENANT_DATABASE_SSL_CERTIFICATE
    });

    console.log(databaseCredential);

    if (databaseCredential.checkDatabaseCredential(databaseCredential) == false || tenantId == undefined) {
      throw new Error("Missing data on environment variables to connect Security Tenant.");
    }

    let tenantConnection: TenantConnection;

    try {
      tenantConnection = await connectToDatabase(databaseCredential, true);
    } catch (error) {
      throw new Error("Erro ao realizar a conexão com o banco de dados Security! Verifique se o banco de dados foi criado. Detail: " + error);
    }

    tenantConnection.models = await getModelsSecurity(databaseCredential.type!, tenantConnection.connection);

    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;
    tenantConnectionService.setOnTenantConnectionPool(tenantId, tenantConnection);

    console.log("Connection established with the Security database. Responsible for managing Tenants.");
    return tenantConnection;
  } catch (error) {
    throw new Error("Error to connect Security Tenant. Detail: " + error);
  }

}
*/
/**
 * Define os models da banco de dados Security na conexão
 * @param databaseType Tipo de banco de dados
 * @param connection Instância da conexão com o banco de dados
 * @returns
 */
function getModelsSecurity(databaseType: string, connection: any): any {
  if (databaseType === "mongodb") {
    return getMongooseSecurityModels(connection);
  } else {
    return getSequelizeSecurityModels(connection);
  }
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
}

