import getMongooseSecurityModels from "../models/mongoose/indexSecurity";
import getSequelizeSecurityModels from "../models/sequelize/indexSecurity.model";
import getMongooseModels from "../models/mongoose";
import getSequelizeModels from "../models/sequelize";
import TenantConnection from '../models/tenantConnection.model';
import UserTenantService from "../services/userTenant.service";
import { TenantConnectionService } from "../services/tenantConnection.service";
import { TenantCredentialService } from "../services/tenantCredential.service";
import { getSecurityTenantConnection } from "./databaseSecurity.config";
import { ITenantCredential, TenantCredential, validateTenantCredential } from "../models/tenantCredential.model";
import { saveRoutes } from "../utils/registerRoutes.util";
import { buildURI, connectToDatabase } from "./databaseConnection.config";
import { decryptDatabasePassword } from "../utils/crypto.util";

const NodeCache = require("node-cache");
/**
 * Instância para armazenamento de dados em cache
 */
export const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

/**
 * Armazena todas as instâncias de conexão com banco de dados
 */
export const tenantConnectionService: TenantConnectionService = new TenantConnectionService();

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
    const tenantConnection: TenantConnection = tenantConnectionService.findOneConnection(tenantId);

    if (tenantConnection == null) {

      const tenantCredentialService: TenantCredentialService = new TenantCredentialService(defaultTenantConnection.databaseType, defaultTenantConnection.models["tenantCredential"]);
      const tenantCredential = await tenantCredentialService.findById(tenantId);

      if (tenantCredential == null || tenantCredential.dbType == null || tenantCredential.dbHost == null) {
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
 * @param tenantCredential Dados de credenciais para realizar a conexão do banco de dados
 * @returns
 */
export async function connectTenant(tenantId: string, tenantCredential: ITenantCredential): Promise<TenantConnection> {

  if (tenantCredential.dbType == undefined || tenantCredential.dbType == null || tenantCredential.dbPassword == null) {
    console.warn("Erro ao realizar a conexão com o banco de dados. Tipo de banco de dados não definido");
    throw new Error("Erro ao realizar a conexão com o banco de dados. Tipo de banco de dados não definido");
  }

  try {
    //Descriptgrafar a senha do tenant
    tenantCredential.dbPassword = decryptDatabasePassword(tenantCredential.dbPassword)!;

    let tenantConnection: TenantConnection;

    const databaseURI: string = buildURI(tenantCredential);
    const databaseType: string = tenantCredential.dbType;

    tenantConnection = await connectToDatabase(databaseType, databaseURI, false);
    tenantConnection.models = await getModels(databaseType, tenantConnection.connection);

    await saveRoutes(tenantConnection);

    tenantConnectionService.setOnTenantConnectionPool(tenantId, tenantConnection);

    return tenantConnection;

  } catch (error) {
    console.warn("Erro ao realizar a conexão com o banco de dados!", error);
    throw new Error("Erro ao realizar a conexão com o banco de dados!");
  }
}

export async function connectSecurityTenant(tenantId: string): Promise<TenantConnection> {
  try {
    const tenantCredential : ITenantCredential = {
      dbType: process.env.SECURITY_TENANT_DATABASE_TYPE,
      dbName: process.env.SECURITY_TENANT_DATABASE_NAME,
      dbUsername: process.env.SECURITY_TENANT_DATABASE_USERNAME,
      dbPassword: process.env.SECURITY_TENANT_DATABASE_PASSWORD,
      dbHost: process.env.SECURITY_TENANT_DATABASE_HOST,
      dbPort: process.env.SECURITY_TENANT_DATABASE_PORT,
      dbConfig: process.env.SECURITY_TENANT_DATABASE_CONFIG
    }
  
    if(validateTenantCredential(tenantCredential) == false ||  tenantId == undefined){
      throw new Error(`Dados ausentes ao realizar a conexão com o banco security`);
    }

    let tenantConnection: TenantConnection;

    const databaseURI: string = buildURI(tenantCredential);

    tenantConnection = await connectToDatabase(tenantCredential.dbType!, databaseURI, true);
    tenantConnection.models = await getModelsSecurity(tenantCredential.dbType!, tenantConnection.connection);

    tenantConnectionService.setOnTenantConnectionPool(tenantId, tenantConnection);

    console.log("Realizado conexão com o banco de dados Security. Responsável pelo controle de Tenants.");

    return tenantConnection;
  } catch (error) {
    console.warn("Erro ao realizar a conexão com o banco de dados Security!", error);
    throw new Error("Erro ao realizar a conexão com o banco de dados Security!");
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

