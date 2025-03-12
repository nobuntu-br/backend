import { encryptDatabasePassword } from '../../utils/crypto.util';
import DatabaseCredentialRepository from '../../domain/repositories/databaseCredential.repository';
import { DatabaseCredential, IDatabaseCredential } from '../../domain/entities/databaseCredential.model';
import DatabasePermissionRepository from '../../domain/repositories/databasePermission.repository';
import UserRepository from '../../domain/repositories/user.repository';
import { connectTenant } from '../../infra/database/database.config';
import TenantRepository from '../../domain/repositories/tenant.repository';
import { ITenantDatabaseModel } from '../../domain/entities/tenant.model';
import { InsufficientPermissionError } from '../../errors/insufficientPermission.error';
import { UnknownError } from '../../errors/unknown.error';
import { DatabaseType } from '../../infra/database/createDb.adapter';
import { getEnvironmentNumber } from '../../utils/environmentGetters.util';

type RegisterDatabaseCredentialInputDTO = {
  databaseCredential: DatabaseCredential;
  tenantId: number;
  userUID: string;
}

export class RegisterDatabaseCredentialUseCase {
  constructor(
    private databaseCredentialRepository: DatabaseCredentialRepository,
    private databasePermissionRepository: DatabasePermissionRepository,
    private userRepository: UserRepository,
    private tenantReposity: TenantRepository
  ) { }

  async execute(input: RegisterDatabaseCredentialInputDTO): Promise<DatabaseCredential> {

    //Impedir cadastro do security 
    if(this.checkIsSecurityDatabaseCredential(input.databaseCredential) == true){
      throw new InsufficientPermissionError("Invalid credential to operation.");
    }

    //Verificar se o usuário é válido
    const user = await this.userRepository.findOne({ UID: input.userUID });

    //Verificar se o usuário é dono do tenant que irá registrar as credenciais do banco de dados
    const tenants: ITenantDatabaseModel[] = await this.tenantReposity.advancedSearches.getTenantsByUserOwner(input.userUID);

    console.log(input.tenantId);
    console.log(tenants);
    const foundTenant = tenants.find((tenant: ITenantDatabaseModel) => tenant.id == input.tenantId);

    if (foundTenant == undefined) {
      throw new InsufficientPermissionError("Invalid tenant to operation.");
    }

    //Testa a conexão com as credenciais
    try {
      const tenantConnection = await connectTenant(
        input.databaseCredential,
        false
      );
    } catch (error) {
      throw new Error("Error to connect on database. Invalid data.");
    }

    //Criptografa a senha do banco de dados
    const encriptedDatabasePassword: string | null = encryptDatabasePassword(input.databaseCredential.password!);
    if (encriptedDatabasePassword == null) {
      throw new Error("Não foi possível encriptografar senha das novas credenciais.");
    }

    input.databaseCredential.password = encriptedDatabasePassword;

    //Registra as credenciais do banco de dados
    // const newTenantCredential = await this.databaseCredentialRepository.create(new DatabaseCredential(input.databaseCredential));

    const transaction = await this.databaseCredentialRepository.startTransaction();

    const newTenantCredential = await this.databaseCredentialRepository.createWithTransaction(new DatabaseCredential(input.databaseCredential), transaction);
    //Define que o usuário que criou é o administrador
    // await this.databasePermissionRepository.create({
    //   databaseCredentialId: newTenantCredential.id,
    //   tenantId: input.tenantId,
    //   isAdmin: true,
    //   userId: user!.id,
    //   userUID: input.userUID,
    // });

    const newdatabasePermission = await this.databasePermissionRepository.createWithTransaction({
      databaseCredentialId: newTenantCredential.id,
      tenantId: input.tenantId,
      isAdmin: true,
      userId: user!.id,
      userUID: input.userUID,
    },
      transaction
    );

    try {
      await this.databaseCredentialRepository.commitTransaction(transaction);

      let newDatabaseCredential = input.databaseCredential;
      newDatabaseCredential.password = "***";

      return newDatabaseCredential;
    } catch (error) {
      throw new UnknownError("Error to register new database Credential.");
    }
  }

  /**
   * Compara a credencias de banco de dados do usuário com a do banco Security (gestor de tenants)
   * @param newDatabaseCredential 
   * @returns Se todas as chaves forem iguais, a função retorna true, caso contrário, retorna false
   */
  checkIsSecurityDatabaseCredential(newDatabaseCredential: IDatabaseCredential): boolean {
    const databaseCredential: DatabaseCredential = new DatabaseCredential({
      name: process.env.SECURITY_TENANT_DATABASE_NAME,
      type: process.env.SECURITY_TENANT_DATABASE_TYPE as DatabaseType,
      username: process.env.SECURITY_TENANT_DATABASE_USERNAME,
      password: process.env.SECURITY_TENANT_DATABASE_PASSWORD,
      host: process.env.SECURITY_TENANT_DATABASE_HOST!,
      port: process.env.SECURITY_TENANT_DATABASE_PORT!,
      srvEnabled: process.env.SECURITY_TENANT_DATABASE_SRV_ENABLED === "true",
      options: process.env.SECURITY_TENANT_DATABASE_OPTIONS,
      storagePath: process.env.SECURITY_TENANT_DATABASE_STORAGE_PATH,
      sslEnabled: process.env.SECURITY_TENANT_DATABASE_SSL_ENABLED === "true",
      poolSize: getEnvironmentNumber("SECURITY_TENANT_DATABASE_POOLSIZE", 1),
      timeOutTime: getEnvironmentNumber("SECURITY_TENANT_DATABASE_TIMEOUT", 3000),

      // SSL data
      sslCertificateAuthority: process.env.SECURITY_TENANT_DATABASE_SSL_CERTIFICATE_AUTHORITY,
      sslPrivateKey: process.env.SECURITY_TENANT_DATABASE_SSL_PRIVATE_KEY,
      sslCertificate: process.env.SECURITY_TENANT_DATABASE_SSL_CERTIFICATE
    });

    // Percorre todos as variáveis (key) do databaseCredential e verifica se os campos são iguais 
    return Object.keys(databaseCredential).every((key) => {
      return (newDatabaseCredential as any)[key] === (databaseCredential as any)[key];
    });
  }


}