import { DatabaseCredential } from "../../domain/entities/databaseCredential.model";
import { Tenant } from "../../domain/entities/tenant.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import DatabaseCredentialRepository from "../../domain/repositories/databaseCredential.repository";
import DatabasePermissionRepository from "../../domain/repositories/databasePermission.repository";
import TenantRepository from "../../domain/repositories/tenant.repository";
import { UnknownError } from "../../errors/unknown.error";
import { GetSecurityTenantConnectionUseCase } from "./getSecurityTenantConnection.useCase";

export class RegisterDefaultTenantUseCase {
  constructor() {}

  /**
   * Salva dados do banco de dados padrão no bando de dados do Tenant Secutiry, que é o banco de dados de controle de tenants.
   * @param databaseCredential Dados das credenciais de acesso ao banco de dados do Tenant Padrão do projeto
   */
  async execute(databaseCredential: DatabaseCredential): Promise<DatabaseCredential> {
    const defaultTenantName: string = "default";

    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const securityTenantConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    const tenantRepository: TenantRepository = new TenantRepository(securityTenantConnection);

    const transaction = await tenantRepository.startTransaction();

    let tenant: Tenant | null;

    try {
      tenant = await tenantRepository.findOne({ name: defaultTenantName });
      if (tenant == null) {
        tenant = await tenantRepository.createWithTransaction({ name: defaultTenantName }, transaction);
      }
    } catch (error) {
      throw new UnknownError("Unknown error on Save Default Tenant on Security Tenant function. Unknown error on create Tenant. Detail: " + error);
    }

    const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(securityTenantConnection);

    let _databaseCredential: DatabaseCredential | null;

    try {
      // _databaseCredential = await databaseCredentialRepository.findOne({ name: databaseCredential.name });
      _databaseCredential = await databaseCredentialRepository.findOne({ id: 1 });
      if (_databaseCredential == null) {
        _databaseCredential = new DatabaseCredential(await databaseCredentialRepository.createWithTransaction(databaseCredential, transaction));
      } else {
        _databaseCredential = new DatabaseCredential(await databaseCredentialRepository.updateWithTransaction(1, databaseCredential, transaction));
      }
    } catch (error) {
      throw new UnknownError("Unknown error on Save Default Tenant on Security Tenant function. Unknown error on create Database Credential. Detail: " + error);
    }

    const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(securityTenantConnection);

    try {
      let databasePermission = await databasePermissionRepository.findOne({ tenantId: tenant.id, databaseCredentialId: _databaseCredential.id });
      if (databasePermission == null) {
        await databasePermissionRepository.createWithTransaction({
          tenantId: tenant.id,
          databaseCredentialId: _databaseCredential.id,

        }, transaction);
      }
    } catch (error) {
      throw new UnknownError("Unknown error on Save Default Tenant on Security Tenant function. Detail: " + error);
    }

    await tenantRepository.commitTransaction(transaction);

    return _databaseCredential;
  }
}