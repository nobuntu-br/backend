import { DatabaseType } from "../../infra/database/createDb.adapter";
import { connectTenant } from "../../infra/database/database.config";
import { TenantConnectionService } from "../../domain/services/tenantConnection.service";
import { getEnvironmentNumber } from "../../utils/environmentGetters.util";
import { RegisterDefaultTenantUseCase } from "./registerDefaultTenant.useCase";
import { DatabaseCredential } from "../../domain/entities/databaseCredential.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import { DatabaseInitializer } from "../../domain/repositories/databaseInitializer";
import { MongooseDatabaseInitializer } from "../../infra/database/mongoose/mongooseDatabaseInitializer";
import { SequelizeDatabaseInitializer } from "../../infra/database/sequelize/sequelizeDatabaseInitializer";
import { checkEnvironmentVariableIsEmpty } from "../../utils/verifiers.util";

export class GetDefaultTenantConnectionUseCase {
  constructor() { }

  /**
  * Obter a instância de conexão com o banco de dados.
  * @returns retornar uma instância de conexão com o banco de dados
  */
  async execute(): Promise<TenantConnection | null> {
    let databaseCredential: DatabaseCredential;

    if (checkEnvironmentVariableIsEmpty(process.env.DEFAULT_TENANT_DATABASE_HOST!) == true ||
      checkEnvironmentVariableIsEmpty(process.env.DEFAULT_TENANT_DATABASE_PORT!) == true
    ) {
      console.log("This project don't have default tenant.");
      return null;
    }

    databaseCredential = new DatabaseCredential({
      name: process.env.DEFAULT_TENANT_DATABASE_NAME!.toLowerCase(),
      type: process.env.DEFAULT_TENANT_DATABASE_TYPE as DatabaseType,
      username: process.env.DEFAULT_TENANT_DATABASE_USERNAME,
      password: process.env.DEFAULT_TENANT_DATABASE_PASSWORD,
      host: process.env.DEFAULT_TENANT_DATABASE_HOST!,
      port: process.env.DEFAULT_TENANT_DATABASE_PORT!,
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

    let tenantConnection: TenantConnection | null = tenantConnectionService.findOneConnection(1);

    if (tenantConnection != null) {
      return tenantConnection;
    }

    const registerDefaultTenantUseCase: RegisterDefaultTenantUseCase = new RegisterDefaultTenantUseCase();

    try {
      const newTenantCredential: DatabaseCredential = await registerDefaultTenantUseCase.execute(databaseCredential);
    } catch (error) {
      throw new Error("Error to register default tenant on Security database. Detail: " + error);
    }

    databaseCredential.id = 1;

    try {
      tenantConnection = await connectTenant(
        databaseCredential,
        false
      );

      //TODO gerar aqui a parte dos registros padrões
    } catch (error) {

      let databaseInitializer: DatabaseInitializer;

      if (databaseCredential.type === 'mongodb') {
        databaseInitializer = new MongooseDatabaseInitializer();
      } else {
        databaseInitializer = new SequelizeDatabaseInitializer();
      }

      await databaseInitializer.createDatabaseIfNotExists(databaseCredential.name!, databaseCredential.username!, databaseCredential.password!, databaseCredential.host!, Number(databaseCredential.port), databaseCredential.type);
      tenantConnection = await connectTenant(
        databaseCredential,
        false
      );

      //TODO gerar aqui a parte dos registros padrões
    }

    console.log("Realizado conexão com o banco de dados padrão. Responsável por ser o tenant padrão para os usuários.");

    return tenantConnection;
  }

}