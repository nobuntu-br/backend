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
export async function getTenantConnection(tenantId: number, userUID: string): Promise<TenantConnection | null> {
  try {
    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;

    //Obter a conexão padrão com o banco de dados
    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const defaultTenantConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    //Cria o serviço de UserTenant com base na conexão com o banco de dados
    const userTenantService: UserTenantService = new UserTenantService(defaultTenantConnection);
    //Verifica se o usuário tem acesso ao tenant
    if (await userTenantService.userHasAccessToTenant(userUID, tenantId) == false) {
      return null;
    }

    //Obtem a instância de conxão com o banco de dados
    const tenantConnection: TenantConnection | null = tenantConnectionService.findOneConnection(tenantId);

    if (tenantConnection == null) {

      const tenantCredentialService: DatabaseCredentialService = new DatabaseCredentialService(defaultTenantConnection);
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
export async function connectTenant(tenantId: number, databaseCredential: IDatabaseCredential): Promise<TenantConnection> {

  //TODO verificar se o tenant já não tem conexão realizada

  //TODO verificar se precisa atualizar o banco

  if (databaseCredential.type == undefined || databaseCredential.type == null || databaseCredential.password == null) {
    throw new Error("Erro ao realizar a conexão com o banco de dados. Tipo de banco de dados não definido");
  }
  

  try {
    //Descriptgrafar a senha do tenant
    if(databaseCredential.password != undefined && databaseCredential.password != ""){
      databaseCredential.password = decryptDatabasePassword(databaseCredential.password)!;
    }

    //TODO Descriptogradar as chaves SSL
    
    let tenantConnection: TenantConnection;
    // const databaseURI: string = buildURI(databaseCredential);
    
    const databaseType: string = databaseCredential.type;

    tenantConnection = await connectToDatabase(databaseCredential, false);
    tenantConnection.models = await getModels(databaseType, tenantConnection);

    try {
      await saveRoutes(tenantConnection);
    } catch (error) {
      throw new Error("")
    }

    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;
    tenantConnectionService.setOnTenantConnectionPool(tenantId, tenantConnection);

    return tenantConnection;

  } catch (error) {
    throw new Error("Error to connect tenant database. Detail: " + error);
  }
}


/**
 * Define os models da banco de dados na conexão
 * @param databaseType Tipo de banco de dados
 * @param tenantConnection Instância da conexão com o banco de dados
 * @returns
 */
function getModels(databaseType: string, tenantConnection: TenantConnection): any {
  if (databaseType === "mongodb") {
    return getMongooseModels(tenantConnection);
  } else {
    return getSequelizeModels(tenantConnection);
  }
}

