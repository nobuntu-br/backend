import { DatabaseType } from "../../infra/database/createDb.adapter";
import { connectToDatabase } from "../../infra/database/databaseConnection.config";
import { TenantConnectionService } from "../../domain/services/tenantConnection.service";
import { getEnvironmentNumber } from "../../utils/environmentGetters.util";
import getMongooseSecurityModels from "../../infra/database/mongoose/models/indexSecurity";
import getSequelizeSecurityModels from "../../infra/database/sequelize/models/indexSecurity.model";
import { DatabaseInitializer } from "../../domain/repositories/databaseInitializer";
import { SequelizeDatabaseInitializer } from "../../infra/database/sequelize/sequelizeDatabaseInitializer";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import { DatabaseCredential } from "../../domain/entities/databaseCredential.model";
import { MongooseDatabaseInitializer } from "../../infra/database/mongoose/mongooseDatabaseInitializer";

export class GetSecurityTenantConnectionUseCase {
  constructor() { }

  /**
  * Obter a instância de conexão com o banco de dados. Sendo esse banco de dados do banco responsável por armazenar os tenants. Sendo chaamdo de banco 'default'.
  * @returns retornar uma instância de conexão com o banco de dados
  */
  async execute(): Promise<TenantConnection> {
    const tenantCredentialId: number = 0;

    const databaseCredential: DatabaseCredential = new DatabaseCredential({
      name: process.env.SECURITY_TENANT_DATABASE_NAME!.toLowerCase(),
      type: process.env.SECURITY_TENANT_DATABASE_TYPE as DatabaseType,
      username: process.env.SECURITY_TENANT_DATABASE_USERNAME,
      password: process.env.SECURITY_TENANT_DATABASE_PASSWORD,
      host: process.env.SECURITY_TENANT_DATABASE_HOST!,
      port: process.env.SECURITY_TENANT_DATABASE_PORT!,
      srvEnabled: process.env.SECURITY_TENANT_DATABASE_SRV_ENABLED === "true" ? true : false,
      options: process.env.SECURITY_TENANT_DATABASE_OPTIONS,
      storagePath: process.env.SECURITY_TENANT_DATABASE_STORAGE_PATH,
      sslEnabled: process.env.SECURITY_TENANT_DATABASE_SSL_ENABLED === "true" ? true : false,
      poolSize: getEnvironmentNumber("SECURITY_TENANT_DATABASE_POOLSIZE", 1),
      timeOutTime: getEnvironmentNumber("SECURITY_TENANT_DATABASE_TIMEOUT", 3000),

      //SSL data
      sslCertificateAuthority: process.env.SECURITY_TENANT_DATABASE_SSL_CERTIFICATE_AUTHORITY,
      sslPrivateKey: process.env.SECURITY_TENANT_DATABASE_SSL_PRIVATE_KEY,
      sslCertificate: process.env.SECURITY_TENANT_DATABASE_SSL_CERTIFICATE
    });

    if (databaseCredential.checkDatabaseCredential(databaseCredential) == false || tenantCredentialId == undefined) {
      throw new Error("Missing data on environment variables to connect Security Tenant.");
    }

    const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;

    let tenantConnection: TenantConnection | null = tenantConnectionService.findOneConnection(tenantCredentialId);

    if (tenantConnection != null) {
      return tenantConnection;
    }

    try {
      tenantConnection = await connectToDatabase(databaseCredential, true);
    } catch (error) {
      let databaseInitializer: DatabaseInitializer;

      if (databaseCredential.type === 'mongodb') {
        databaseInitializer = new MongooseDatabaseInitializer();
      } else {
        databaseInitializer = new SequelizeDatabaseInitializer();
      }

      await databaseInitializer.createDatabaseIfNotExists(databaseCredential.name!, databaseCredential.username!, databaseCredential.password!, databaseCredential.host!, Number(databaseCredential.port), databaseCredential.type);
      
      tenantConnection = await connectToDatabase(databaseCredential, true);
    }

    tenantConnection!.models = await this.getModelsSecurity(databaseCredential.type!, tenantConnection!);

    tenantConnectionService.setOnTenantConnectionPool(tenantCredentialId, tenantConnection!);

    console.log("Connection established with the Security database. Responsible for managing Tenants.");
    return tenantConnection!;
  }


  /**
   * Define os models da banco de dados Security na conexão
   * @param databaseType Tipo de banco de dados
   * @param connection Instância da conexão com o banco de dados
   * @returns
   */
  getModelsSecurity(databaseType: string, tenantConnection: TenantConnection): any {
    if (databaseType === "mongodb") {
      return getMongooseSecurityModels(tenantConnection);
    } else {
      return getSequelizeSecurityModels(tenantConnection);
    }
  }

}