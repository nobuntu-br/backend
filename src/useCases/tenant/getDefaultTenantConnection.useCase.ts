import { DatabaseType } from "../../infra/database/createDb.adapter";
import { connectTenant } from "../../infra/database/database.config";
import { TenantConnectionService } from "../../domain/services/tenantConnection.service";
import { encryptDatabasePassword } from "../../utils/crypto.util";
import { getEnvironmentNumber } from "../../utils/environmentGetters.util";
import { RegisterDefaultTenantUseCase } from "./registerDefaultTenant.useCase";
import { DatabaseCredential } from "../../domain/entities/databaseCredential.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";

export class GetDefaultTenantConnectionUseCase {
  constructor() { }

  /**
  * Obter a instância de conexão com o banco de dados.
  * @returns retornar uma instância de conexão com o banco de dados
  */
  async execute(): Promise<TenantConnection | null> {
    const tenantId = process.env.SECURITY_TENANT_DATABASE_ID;

    const databaseCredential: DatabaseCredential = new DatabaseCredential({
      name: process.env.DEFAULT_TENANT_DATABASE_NAME,
      type: process.env.DEFAULT_TENANT_DATABASE_TYPE as DatabaseType,
      username: process.env.DEFAULT_TENANT_DATABASE_USERNAME,
      password: process.env.DEFAULT_TENANT_DATABASE_PASSWORD,
      host: process.env.DEFAULT_TENANT_DATABASE_HOST,
      port: process.env.DEFAULT_TENANT_DATABASE_PORT,
      srvEnabled: process.env.DEFAULT_TENANT_DATABASE_SRV_ENABLED === "true" ? true : false,
      options: process.env.DEFAULT_TENANT_DATABASE_OPTIONS,
      storagePath: process.env.DEFAULT_TENANT_DATABASE_STORAGE_PATH,
      sslEnabled: process.env.DEFAULT_TENANT_DATABASE_SSL_ENABLED === "true" ? true : false,
      poolSize: getEnvironmentNumber("DEFAULT_TENANT_DATABASE_POOLSIZE", 1),
      timeOutTime: getEnvironmentNumber("DEFAULT_TENANT_DATABASE_TIMEOUT", 3000),

      //SSL data
      sslCertificateAuthority: process.env.SECURITY_TENANT_DATABASE_SSL_CERTIFICATE_AUTHORITY,
      sslPrivateKey: process.env.SECURITY_TENANT_DATABASE_SSL_PRIVATE_KEY,
      sslCertificate: process.env.SECURITY_TENANT_DATABASE_SSL_CERTIFICATE
    });
    
    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;
    
    try {

      if(isNaN(Number(process.env.DEFAULT_TENANT_DATABASE_ID!)) == true){
        throw new Error("Error to get default tenant database Id from environment variables. The value is not a number.");
      }

      let tenantConnection: TenantConnection | null = tenantConnectionService.findOneConnection(Number(process.env.DEFAULT_TENANT_DATABASE_ID!));

      if (tenantConnection == null) {

        const registerDefaultTenantUseCase: RegisterDefaultTenantUseCase = new RegisterDefaultTenantUseCase();

        databaseCredential.password = "";
        const newTenantCredential : DatabaseCredential = await registerDefaultTenantUseCase.execute(databaseCredential);

        databaseCredential.id = Number(process.env.DEFAULT_TENANT_DATABASE_ID!);
        tenantConnection = await connectTenant(
          databaseCredential
        );

        console.log("Realizado conexão com o banco de dados padrão. Responsável por ser o tenant padrão para os usuários.");

      }

      return tenantConnection;
    } catch (error) {
      throw new Error("Get default tenant connection error. Detail: " + error);
    }
  }

}