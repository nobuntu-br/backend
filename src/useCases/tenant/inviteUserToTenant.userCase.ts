import { DatabasePermission } from "../../domain/entities/databasePermission.model";
import { ITenant } from "../../domain/entities/tenant.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import { User } from "../../domain/entities/user.model";
import DatabaseCredentialRepository from "../../domain/repositories/databaseCredential.repository";
import DatabasePermissionRepository from "../../domain/repositories/databasePermission.repository";
import TenantRepository from "../../domain/repositories/tenant.repository";
import UserRepository from "../../domain/repositories/user.repository";
import { IEmailService } from "../../domain/services/Iemail.service";
import { TenantConnectionService } from "../../domain/services/tenantConnection.service";
import { NotFoundError } from "../../errors/notFound.error";
import { GetSecurityTenantConnectionUseCase } from "./getSecurityTenantConnection.useCase";

type InviteUserToTenantInputDTO = {
  invitingUserUID: string;//UID de quem convidou
  invitedUserEmail: string;//Email do convidado
  tenantId: number;
  databaseCredentialId: number;
}

export class InviteUserToTenantUseCase {

  constructor(
    private emailService: IEmailService,
    private frontEndURI: string,
  ) {

  }

  async execute(input: InviteUserToTenantInputDTO): Promise<boolean> {
    console.log("dados recebidos: ", input);

    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const securityDatabaseConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(securityDatabaseConnection);
    const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(securityDatabaseConnection);
    const tenantRepository: TenantRepository = new TenantRepository(securityDatabaseConnection);
    const userRepository: UserRepository = new UserRepository(securityDatabaseConnection);

    let invitingUser: User | null = null;

    try {
      invitingUser = await userRepository.findOne({ UID: input.invitingUserUID });
    } catch (error) {
      throw Error("Error to get user inviting user on database. Detail: " + error);
    }

    let user: User | null = null;

    try {
      user = await userRepository.findOne({ email: input.invitedUserEmail });
    } catch (error) {
      throw Error("Error to get invited user on database. Detail: " + error);
    }

    if (user != null) {
      let databaseCredential;

      try {
        databaseCredential = await databaseCredentialRepository.findById(input.databaseCredentialId);
      } catch (error) {
        throw Error("Error to get database credential to invite user to tenant. Detail: " + error);
      }

      let tenant: ITenant | null = null;

      try {
        tenant = await tenantRepository.findById(input.tenantId);
      } catch (error) {
        throw Error("Error to get tenant to invite user to tenant. Detail: " + error);
      }

      try {
        if (databaseCredential == null) {
          throw new NotFoundError("Not found database credential.");
        }

        if (tenant == null) {
          throw new NotFoundError("Not found tenant.");
        }

        let createdDatabasePermission;

        try {
          createdDatabasePermission = await databasePermissionRepository.create({
            databaseCredentialId: databaseCredential.id,
            isAdmin: false,
            tenantId: tenant.id,
            userId: user.id,
            userUID: user.UID
          });
        } catch (error) {
          throw Error("Error to create database permission. Detail: " + error);
        }

        const tenantConnectionService: TenantConnectionService = TenantConnectionService.instance;

        tenantConnectionService.addPermission({
          databaseCredential: {
            id: input.databaseCredentialId
          },
          tenant: {
            id: tenant.id!,
            name: tenant.name!
          },
          userId: user.id!,
          userUID: user.UID!,
          isAdmin: false
        });
      } catch (error) {
        throw Error("Error to give access to invited user on tenant. Detail: " + error);
      }

      await this.emailService.sendEmailWithDefaultEmail({
        subject: "Você foi convidado para ter acesso a base de dados!",
        text: "O usuário " + invitingUser?.getFullName() + " te convidou para ter acesso a base de dados. Para acesso a aplicação: " + this.frontEndURI,
        to: input.invitedUserEmail
      });
    } else {
      //TODO fazer JTW que ao usuário cadastrar e mandar pro SignUP, após o cadastro da conta já liga o usuário aos tenants

      await this.emailService.sendEmailWithDefaultEmail({
        subject: "Você foi convidado para ter acesso a base de dados!",
        text: "O usuário " + invitingUser?.getFullName() + " te convidou para ter acesso a base de dados. Crie uma conta na aplicação: " + this.frontEndURI,
        to: input.invitedUserEmail
      });
    }

    return true;
  }
}