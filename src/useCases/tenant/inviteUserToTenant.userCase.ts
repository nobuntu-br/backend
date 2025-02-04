import { DatabasePermission } from "../../domain/entities/databasePermission.model";
import { ITenant } from "../../domain/entities/tenant.model";
import TenantConnection from "../../domain/entities/tenantConnection.model";
import { IUser, User } from "../../domain/entities/user.model";
import DatabaseCredentialRepository from "../../domain/repositories/databaseCredential.repository";
import DatabasePermissionRepository from "../../domain/repositories/databasePermission.repository";
import TenantRepository from "../../domain/repositories/tenant.repository";
import UserRepository from "../../domain/repositories/user.repository";
import { IEmailService } from "../../domain/services/Iemail.service";
import { IidentityService } from "../../domain/services/Iidentity.service";
import { TenantConnectionService } from "../../domain/services/tenantConnection.service";
import { NotFoundError } from "../../errors/notFound.error";
import { ValidationError } from "../../errors/validation.error";
import { TokenGenerator } from "../../utils/tokenGenerator";
import { checkEmailIsValid } from "../../utils/verifiers.util";
import { GetSecurityTenantConnectionUseCase } from "./getSecurityTenantConnection.useCase";

type InviteUserToTenantInputDTO = {
  invitingUserEmail: string;//Email de quem convidou
  invitedUserEmail: string;//Email do convidado
  tenantId: number;
  databaseCredentialId: number;
}

export class InviteUserToTenantUseCase {

  constructor(
    private emailService: IEmailService,
    private identityService: IidentityService,
    private tokenGenerator: TokenGenerator,
    private frontEndURI: string,
  ) {
    this.frontEndURI = this.frontEndURI + "/signin"
  }

  async execute(input: InviteUserToTenantInputDTO): Promise<boolean> {

    if(input.tenantId == 1){
      throw new ValidationError("It is not possible to invite a user to the default Tenant.");
    }

    if (checkEmailIsValid(input.invitingUserEmail) == false || checkEmailIsValid(input.invitedUserEmail) == false) {
      throw new ValidationError("Email is invalid.");
    };

    try {
      const _invitingUser: IUser = await this.identityService.getUserByEmail(input.invitedUserEmail);
    } catch (error) {
      throw new NotFoundError("Not found user.");
    }

    const getSecurityTenantConnectionUseCase: GetSecurityTenantConnectionUseCase = new GetSecurityTenantConnectionUseCase();
    const securityDatabaseConnection: TenantConnection = await getSecurityTenantConnectionUseCase.execute();

    const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(securityDatabaseConnection);
    const databaseCredentialRepository: DatabaseCredentialRepository = new DatabaseCredentialRepository(securityDatabaseConnection);
    const tenantRepository: TenantRepository = new TenantRepository(securityDatabaseConnection);
    const userRepository: UserRepository = new UserRepository(securityDatabaseConnection);

    let invitingUser: User | null = null;

    try {
      invitingUser = await userRepository.findOne({ email: input.invitingUserEmail });
    } catch (error) {
      throw Error("Error to get user inviting user on database. Detail: " + error);
    }

    let user: User | null = null;

    try {
      user = await userRepository.findOne({ email: input.invitedUserEmail });
    } catch (error) {
      throw Error("Error to get invited user on database. Detail: " + error);
    }

    if (user == null) {
      const invitationToken: string = this.tokenGenerator.generateToken({ tenantId: input.tenantId, databaseCredentialId: input.databaseCredentialId }, 5000);

      await this.emailService.sendEmailWithDefaultEmail({
        subject: "Você foi convidado para ter acesso a base de dados!",
        text: "O usuário " + invitingUser?.getFullName() + " te convidou para ter acesso a base de dados. Crie uma conta na aplicação: " + this.frontEndURI + "/invitation=" + invitationToken,
        to: input.invitedUserEmail
      });

      return true;
    }

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
        createdDatabasePermission = databasePermissionRepository.findOne({databaseCredentialId: databaseCredential.id, tenantId: tenant.id, userId: user.id});
      } catch (error) {
        throw Error("Error to find user permission on database. Detail: " + error);
      }

      if(createdDatabasePermission != null){
        throw new ValidationError("User already has tenant access.");
      }

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

    return true;
  }
}