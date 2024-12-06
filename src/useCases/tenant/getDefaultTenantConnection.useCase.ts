import { DatabaseType } from "../../adapters/createDb.adapter";
import { connectTenant } from "../../config/database.config";
import { NotFoundError } from "../../errors/notFound.error";
import { UnknownError } from "../../errors/unknown.error";
import { DatabaseCredential, IDatabaseCredential } from "../../models/databaseCredential.model";
import { Tenant } from "../../models/tenant.model";
import TenantConnection from "../../models/tenantConnection.model";
import DatabaseCredentialRepository from "../../repositories/databaseCredential.repository";
import DatabasePermissionRepository from "../../repositories/databasePermission.repository";
import TenantRepository from "../../repositories/tenant.repository";
import { TenantConnectionService } from "../../services/tenantConnection.service";
import { encryptDatabasePassword } from "../../utils/crypto.util";
import { getEnvironmentNumber } from "../../utils/environmentGetters.util";
import { GetSecurityTenantConnectionUseCase } from "./getSecurityTenantConnection.useCase";

export class GetDefaultTenantConnectionUseCase {
  constructor() { }

  /**
  * Obter a instância de conexão com o banco de dados.
  * @returns retornar uma instância de conexão com o banco de dados
  */
  async execute(): Promise<TenantConnection | Error> {
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

    // if (validateDatabaseCredential(databaseCredential) == false || tenantId == undefined) {
    //   throw new Error(`Dados ausentes ao realizar a conexão com o banco padrão`);
    // }

    try {

      const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;

      var tenantConnection: TenantConnection | null = tenantConnectionService.findOneConnection(Number(process.env.DEFAULT_TENANT_DATABASE_ID!));

      //Se iniciou o servidor pela primeira vez, tem que registrar ele e conectar

      //Se ele já tiver registrado, só conecta
      if (tenantConnection == null) {

        const encryptedDatabasePassword = encryptDatabasePassword(databaseCredential.password!);
        databaseCredential.password = encryptedDatabasePassword;
        const newTenantCredential = await this.saveDefaultTenantOnSecurityTenant(databaseCredential);

        tenantConnection = await connectTenant(
          newTenantCredential.id!,
          databaseCredential
        );

        console.log("Realizado conexão com o banco de dados padrão. Responsável por ser o tenant padrão para os usuários.");

      }

      return tenantConnection;
    } catch (error) {
      throw new Error("Get default tenant connection error. Detail: " + error);
    }
  }

  //TODO separar isso em um caso de uso
  /**
   * Salva dados do banco de dados padrão no bando de dados do Tenant Secutiry, que é o banco de dados de controle de tenants.
   * @param databaseCredential Dados das credenciais de acesso ao banco de dados do Tenant Padrão do projeto
   */
  async saveDefaultTenantOnSecurityTenant(databaseCredential: DatabaseCredential): Promise<DatabaseCredential> {

    const defaultTenantName: string | undefined = process.env.DEFAULT_TENANT_DATABASE_ID;

    if (defaultTenantName == undefined || defaultTenantName == null) {
      throw new Error("Dados ausentes ao realizar o registro do tenant padrão");
    }

    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const securityTenantConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    const tenantRepository: TenantRepository = new TenantRepository(securityTenantConnection.databaseType, securityTenantConnection);

    const transaction = await tenantRepository.startTransaction();

    //Cria o tenant
    let tenant: Tenant;
    try {
      tenant = await tenantRepository.findOne({ name: defaultTenantName });
      console.log("Tenant retorno do tenant: ", tenant);
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundError) {
        tenant = await tenantRepository.createWithTransaction({ name: defaultTenantName }, transaction);
        console.log("Tenant criado: ", tenant);
      } else {
        throw new UnknownError("Unknown error on Save Default Tenant on Security Tenant function. Unknown error on create Tenant. Detail: " + error);
      }
    }

    //Cria o databaseCredential
    const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(securityTenantConnection.databaseType, securityTenantConnection);

    let _databaseCredential: DatabaseCredential;
    try {
      _databaseCredential = await databaseCredentialRepository.findOne({ name: databaseCredential.name });
    } catch (error) {
      if (error instanceof NotFoundError) {
        console.log("Database Credential não encontrado!");
        _databaseCredential = new DatabaseCredential(await databaseCredentialRepository.createWithTransaction(databaseCredential, transaction));
      } else {
        throw new UnknownError("Unknown error on Save Default Tenant on Security Tenant function. Unknown error on create Database Credential. Detail: " + error);
      }
    }

    //Cria o databasePermission
    const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(securityTenantConnection.databaseType, securityTenantConnection);

    try {
      let databasePermission = await databasePermissionRepository.findOne({ tenantId: tenant.id, databaseCredentialId: _databaseCredential.id });
    } catch (error) {
      if (error instanceof NotFoundError) {
        await databasePermissionRepository.createWithTransaction({
          tenantId: tenant.id,
          // databaseCredentialId: _databaseCredential.id,
          
        }, transaction);
      } else {
        throw new UnknownError("Unknown error on Save Default Tenant on Security Tenant function. Detail: " + error);
      }
    }

    await tenantRepository.commitTransaction(transaction);

    return databaseCredential;

  }
}