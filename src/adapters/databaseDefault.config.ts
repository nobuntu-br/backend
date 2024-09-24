import { TenantCredentialDTO } from "../models/DTO/tenantCredential.DTO";
import { Tenant } from "../models/tenant.model";
import TenantConnection from "../models/tenantConnection.model";
import { ITenantCredential, TenantCredential, validateTenantCredential } from "../models/tenantCredential.model";
import { UserTenant } from "../models/userTenant.model";
import TenantService from "../services/tenant.service";
import { TenantCredentialService } from "../services/tenantCredential.service";
import UserTenantService from "../services/userTenant.service";
import { encryptDatabasePassword } from "../utils/crypto.util";
import { connectTenant, tenantConnectionService } from "./database.config";
import { disconnectDatabase } from "./databaseDisconnection.config";
import { getSecurityTenantConnection } from "./databaseSecurity.config";

/**
* Obter a instância de conexão com o banco de dados.
* @returns retornar uma instância de conexão com o banco de dados
*/
export async function getDefaultTenantConnection(): Promise<TenantConnection | Error> {

  try {

    const tenantId = process.env.SECURITY_TENANT_DATABASE_ID;

    const tenantCredential: ITenantCredential = {
      dbName: process.env.DEFAULT_TENANT_DATABASE_NAME,
      dbUsername: process.env.DEFAULT_TENANT_DATABASE_USERNAME,
      dbType: process.env.DEFAULT_TENANT_DATABASE_TYPE,
      dbHost: process.env.DEFAULT_TENANT_DATABASE_HOST,
      dbPassword: process.env.DEFAULT_TENANT_DATABASE_PASSWORD,
      dbConfig: process.env.DEFAULT_TENANT_DATABASE_CONFIG,
      dbPort: process.env.DEFAULT_TENANT_DATABASE_PORT
    }

    if (validateTenantCredential(tenantCredential) == false || tenantId == undefined) {
      console.warn("Dados ausentes ao realizar a conexão com o banco padrão. É reconhecido que esse projeto não faz uso de um tenant padrão para os usuários.");
      throw new Error(`Dados ausentes ao realizar a conexão com o banco padrão`);
    }

    var tenantConnection: TenantConnection = tenantConnectionService.findOneConnection(process.env.DEFAULT_TENANT_DATABASE_ID!);

    //Se iniciou o servidor pela primeira vez, tem que registrar ele e conectar
    
    //Se ele já tiver registrado, só conecta
    if (tenantConnection == null) {

      const encryptedDatabasePassword = encryptDatabasePassword(tenantCredential.dbPassword!);
      if(encryptedDatabasePassword == null){
        throw new Error("Erro ao criptografar a senha do tenant");
      }
      tenantCredential.dbPassword = encryptedDatabasePassword;
      
      tenantConnection = await connectTenant(
        process.env.DEFAULT_TENANT_DATABASE_ID!,
        tenantCredential
      )
      console.log("Realizado conexão com o banco de dados padrão. Responsável por ser o tenant padrão para os usuários.");

      tenantCredential.dbPassword = encryptedDatabasePassword;
      const newTenantCredential = await saveDefaultTenantOnSecurityTenant(tenantCredential);

      await disconnectDatabase(tenantConnection);

      tenantConnection = await connectTenant(
        newTenantCredential.id!,//TODO verificar se pode ser null
        tenantCredential
      );

    }

    return tenantConnection;
  } catch (error) {
    throw new Error("Erro ao realizar a conexão com o tenant padrão. " + error);
  }

}



/**
 * Salva dados do banco de dados padrão no bando de dados do Tenant Secutiry, que é o banco de dados de controle de tenants.
 * @param tenantCredential Dados das credenciais de acesso ao banco de dados do Tenant Padrão do projeto
 */
async function saveDefaultTenantOnSecurityTenant(tenantCredential: TenantCredentialDTO): Promise<TenantCredential> {
  const defaultTenantName: string | undefined = process.env.DEFAULT_TENANT_DATABASE_ID;

  if (defaultTenantName == undefined || defaultTenantName == null) {
    throw new Error("Dados ausentes ao realizar o registro do tenant padrão");
  }

  const securityTenantConnection: TenantConnection = await getSecurityTenantConnection();

  const tenantCredentialService: TenantCredentialService = new TenantCredentialService(securityTenantConnection.databaseType, securityTenantConnection.models["tenantCredential"], securityTenantConnection.connection);
  const tenantService: TenantService = new TenantService(securityTenantConnection.databaseType, securityTenantConnection.models["tenant"], securityTenantConnection.connection);

  //Verificar se o tenant padrão foi criado, se não, criar
  var _tenant: Tenant | null = await tenantService.findOne({ name: defaultTenantName });
  if (_tenant == null) {
    _tenant = await tenantService.create({ name: defaultTenantName });
  }

  //Verificar se as credenciais do tenant padrão foram criadas, se não, criar
  var _tenantCredential: TenantCredential | null = await tenantCredentialService.findOne({ dbName: tenantCredential.dbName });
  if (_tenantCredential == null) {
    _tenantCredential = await tenantCredentialService.create(tenantCredential);
  }

  const userTenantService: UserTenantService = new UserTenantService(securityTenantConnection.databaseType, securityTenantConnection.models["userTenant"], securityTenantConnection.connection);
  var userTenant: UserTenant | null = await userTenantService.findOne({ TenantId: _tenant.id, TenantCredentialId: _tenantCredential.id });
  if (userTenant == null) {
    userTenantService.create({
      // UserId: "",
      TenantId: _tenant.id,
      TenantCredentialId: _tenantCredential.id,
      // isAdmin?: boolean;
    })
  }

  return _tenantCredential;
}