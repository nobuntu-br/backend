import { InsufficientPermissionError } from "../../errors/insufficientPermission.error";
import { NotFoundError } from "../../errors/notFound.error";
import { InviteUserToApplicationDTO } from "../../models/DTO/inviteUserToApplication.DTO";
import { ITenant } from "../../models/tenant.model";
import DatabasePermissionRepository from "../../repositories/databasePermission.repository";
import UserRepository from "../../repositories/user.repository";
import { EmailService } from "../../services/email.service";
import { TokenGenerator } from "../../utils/tokenGenerator";

export class InviteUserToApplicationUseCase {
  private applicationName: string;
  private applicationWebURL: string;
  private applicationWebSignUpPath: string;

  constructor(
    private emailService: EmailService,
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator,
    private databasePermissionRepository: DatabasePermissionRepository
  ) {

    if (process.env.APPLICATION_NAME == undefined || process.env.APPLICATION_NAME == '' ||
      process.env.APPLICATION_WEB_URL == undefined || process.env.APPLICATION_WEB_URL == '' ||
      process.env.APPLICATION_WEB_SIGNUP_PATH == undefined || process.env.APPLICATION_WEB_SIGNUP_PATH == ''
    ) {
      throw new Error("APPLICATION_NAME or APPLICATION_WEB_URL is missing in .env!");
    }

    this.applicationName = process.env.APPLICATION_NAME;
    this.applicationWebURL = process.env.APPLICATION_WEB_URL;
    this.applicationWebSignUpPath = process.env.APPLICATION_WEB_SIGNUP_PATH;

  }

  async execute(input: InviteUserToApplicationDTO): Promise<any> {
    //Verificar se o usuário atual tem permissão de administrador para convidar alguém
    const invitingUser = await this.userRepository.findOne({ email: input.invitingUserEmail });

    console.log("dados recebidos do usuário:", input);

    if (invitingUser == null) {
      throw new NotFoundError("User don't exist on application");
    }

    //TODO Seria melhor ter uma tabela com as permissões e cada permissão ter descrição de o que cada permissão poderá fazer.
    if (invitingUser.isAdministrator == false) {
      throw new InsufficientPermissionError("User don't have permission for this action");
    }

    //Verificar se todos os tenants que serão dado o acesso ao novo usuário existem mesmo;
    var tenants: ITenant[];
    try {
      tenants = await this.databasePermissionRepository.findTenantsUserIsAdmin(input.invitingUserUID);
    } catch (error) {
      throw new NotFoundError("Inviting UserUID is invalid");
    }

    if (Array.isArray(input.invitedUserTenantIds) == false ||
      input.invitedUserTenantIds.length <= 0) {
      throw new NotFoundError("Invalid tenants format to invited");
    }

    if (this.isValidTenantIds(input.invitedUserTenantIds, tenants) == false) {
      throw new InsufficientPermissionError("Insufficient permissions on Tenant to invite user");
    }

    //Irá criar um token com informações dos tenants que será dado acesso ao novo usuário que realizar o cadastro
    const token: string = this.tokenGenerator.generateToken({ "invitedUserTenantIds": input.invitedUserTenantIds }, 1000);

    const inviteLink: string = this.applicationWebURL + this.applicationWebSignUpPath + "/invitedToken:" + token;

    try {
      await this.emailService.sendEmailWithDefaultEmail({
        to: input.invitedUserEmail,
        subject: "Invite to application " + this.applicationName,
        text: "Você foi convidado para usar a aplicação X pelo usuário de email: " + input.invitingUserEmail +
          ". Para fazer o cadastro na aplicação, entre no link: " + inviteLink
      });
    } catch (error) {
      throw new Error("Error to send invite email to new user.");
    }

    return { "message": "invited send to " + input.invitedUserEmail };
  }

  private isValidTenantIds(invitedTenantIds: number[], tenants: ITenant[]): boolean {
    const _tenantsIds = tenants.map(tenant => tenant.id);
    return invitedTenantIds.every(value => _tenantsIds.includes(value));
  }
} 