import { DatabaseCredential } from "../../../domain/entities/databaseCredential.model";
import { ITenantDatabaseModel } from "../../../domain/entities/tenant.model";
import DatabaseCredentialRepository from "../../../domain/repositories/databaseCredential.repository";
import TenantRepository from "../../../domain/repositories/tenant.repository";
import UserRepository from "../../../domain/repositories/user.repository";
import { NotFoundError } from "../../../errors/notFound.error";
import { UnauthorizedError } from "../../../errors/unauthorized.error";

type GetDatabaseCredentialInputDTO = {
  tenantId: number;
  userUID: string;
}

export class GetDatabaseCredentialUseCase {
  constructor(
    private userRepository: UserRepository,
    private tenantRepository: TenantRepository,
    private databaseCredentialRepository: DatabaseCredentialRepository,
  ) { }

  async execute(input: GetDatabaseCredentialInputDTO): Promise<DatabaseCredential[]> {

    //Verificar se o usuário é válido
    const user = await this.userRepository.findOne({ UID: input.userUID });

    if(user == null){
      throw new UnauthorizedError("Usuário inválido");
    }

    //Se o usuário existe, verificar se ele é dono do tenant
    let tenants : ITenantDatabaseModel[] = await this.tenantRepository.advancedSearches.getTenantsByUserOwner(input.userUID);

    const foundTenant = tenants.find((tenant: ITenantDatabaseModel) => tenant.id == input.tenantId);

    if(foundTenant == null){
      throw new NotFoundError("Tenant não encontrado!");
    }

    //Retornar os databaseCredentials
    const databaseCredentials : DatabaseCredential[]= await this.databaseCredentialRepository.advancedSearches.getDatabaseCredentialByTenantId(foundTenant.id!, user.id!);

    return databaseCredentials;
  
  }

}