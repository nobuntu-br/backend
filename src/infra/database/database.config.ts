import getMongooseModels from "./mongoose/models";
import getSequelizeModels from "./sequelize/models";
import { TenantConnectionService } from "../../domain/services/tenantConnection.service";
import { saveRoutes } from "../../utils/registerRoutes.util";
import { connectToDatabase } from "./databaseConnection.config";
import { decryptDatabasePassword } from "../../utils/crypto.util";
import { GetSecurityTenantConnectionUseCase } from "../../useCases/tenant/getSecurityTenantConnection.useCase";
import { DatabaseCredential } from "../../domain/entities/databaseCredential.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import DatabaseCredentialRepository from "../../domain/repositories/databaseCredential.repository";

/**
 * Obtem a instância de conexão com o banco de dados de acordo com o tenant
 * @param {*} tenantId Identificador do tenant que está sendo usado
 * @param {*} userUID UID do usuário que está fazendo uso do tenant 
 * @returns Retorna a instância da conexão com o tenant caso encontrado e o usuário tiver permissão, caso não, será retornado null
 */
export async function getTenantConnection(databaseCredentialId: number, userUID: string): Promise<TenantConnection | null> {
  try {
    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;
    //Obter a conexão padrão com o banco de dados
    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const defaultTenantConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    if (tenantConnectionService.checkUserPermissionTenant(userUID, databaseCredentialId) == false ) {
      return null;
    }

    //Obtem a instância de conxão com o banco de dados
    const tenantConnection: TenantConnection | null = tenantConnectionService.findOneConnection(databaseCredentialId);

    if (tenantConnection == null) {

      //Realizar a conexão do tenant do usuário
      const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(defaultTenantConnection);
      const databaseCredential : DatabaseCredential | null = await databaseCredentialRepository.findById(databaseCredentialId);

      if (databaseCredential == null) {
        throw new Error("Erro to try find database credential to connect Tenant.");
      }
      
      await connectTenant(databaseCredential, true);

    }

    return tenantConnection;
  } catch (error) {
    throw error;
  }

};

/**
 * Realiza a conexão com o banco de dados de acordo com o tipo de banco de dados. Seta os models de acordo com o banco de dados.
 * @param databaseCredentialId
 * @param databaseCredential Dados de credenciais para realizar a conexão do banco de dados
 * @returns
 */
export async function connectTenant(databaseCredential: DatabaseCredential, decryptEnabled: boolean): Promise<TenantConnection> {

  //TODO verificar se o tenant já não tem conexão realizada

  //TODO verificar se precisa atualizar o banco

  if (databaseCredential.type == undefined || databaseCredential.type == null || databaseCredential.password == null) {
    throw new Error("Erro ao realizar a conexão com o banco de dados. Tipo de banco de dados não definido");
  }
  

  try {
    if (decryptEnabled == true) {
      //Descriptgrafar a senha do tenant
      if (databaseCredential.password != undefined && databaseCredential.password != "") {
        databaseCredential.password = decryptDatabasePassword(databaseCredential.password)!;
      }

      //TODO Descriptogradar as chaves SSL
    }
    
    let tenantConnection: TenantConnection;
    const databaseType: string = databaseCredential.type;

    tenantConnection = await connectToDatabase(databaseCredential, false);
    tenantConnection.models = await getModels(databaseType, tenantConnection);

    try {
      await saveRoutes(tenantConnection);
    } catch (error) {
      throw new Error("Error to Save Routes on tenant Database. Detail: "+ error);
    }

    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;
    tenantConnectionService.setOnTenantConnectionPool(databaseCredential.id!, tenantConnection);

    console.log("Database: " + databaseCredential.id! + ". Database type: " + tenantConnection.databaseType + " connect!");

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

