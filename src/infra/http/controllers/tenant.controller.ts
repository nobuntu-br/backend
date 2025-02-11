import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { GetUserTenantsUseCase } from "../../../useCases/tenant/getUserTenants.useCase";
import { NotFoundError } from "../../../errors/notFound.error";
import { DatabaseType } from "../../database/createDb.adapter";
import { ITenant, ITenantDatabaseModel, Tenant } from "../../../domain/entities/tenant.model";
import DatabasePermissionRepository from "../../../domain/repositories/databasePermission.repository";
import TenantConnection from "../../../domain/entities/tenantConnection.model";
import TenantRepository from "../../../domain/repositories/tenant.repository";
import { InviteUserToTenantUseCase } from "../../../useCases/tenant/inviteUserToTenant.userCase";
import { EmailService } from "../../../domain/services/email.service";
import { RemoveUserAccessToTenantUseCase } from "../../../useCases/tenant/removeUserAccessToTenant.useCase";
import { AzureADService } from "../../../domain/services/azureAD.service";
import { TokenGenerator } from "../../../utils/tokenGenerator";

export class TenantController {

  async create(req: Request, res: Response, next: NextFunction) {

    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }


      const tenantRepository: TenantRepository = new TenantRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<ITenantDatabaseModel, Tenant> = new BaseController(tenantRepository, "Tenant");

      baseController.create(req, res, next);
    } catch (error) {
      next(error);
    }

  }

  async findAll(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }


      const tenantRepository: TenantRepository = new TenantRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<ITenantDatabaseModel, Tenant> = new BaseController(tenantRepository, "Tenant");

      baseController.findAll(req, res, next);
    } catch (error) {
      next(error);
    }

  }

  async findById(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }


      const tenantRepository: TenantRepository = new TenantRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<ITenantDatabaseModel, Tenant> = new BaseController(tenantRepository, "Tenant");

      baseController.findById(req, res, next);
    } catch (error) {
      next(error);
    }

  }

  async getCount(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }


      const tenantRepository: TenantRepository = new TenantRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<ITenantDatabaseModel, Tenant> = new BaseController(tenantRepository, "Tenant");

      baseController.getCount(req, res, next);
    } catch (error) {
      next(error);
    }

  }

  async update(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }


      const tenantRepository: TenantRepository = new TenantRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<ITenantDatabaseModel, Tenant> = new BaseController(tenantRepository, "Tenant");

      baseController.update(req, res, next);
    } catch (error) {
      next(error);
    }

  }

  async delete(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const tenantRepository: TenantRepository = new TenantRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<ITenantDatabaseModel, Tenant> = new BaseController(tenantRepository, "Tenant");

      baseController.delete(req, res, next);
    } catch (error) {
      next(error);
    }

  }

  async deleteAll(req: Request, res: Response, next: NextFunction) {

    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const tenantRepository: TenantRepository = new TenantRepository(req.body.tenantConnection as TenantConnection);
      //Base Controller é uma classe que já tem implementado todas as funções de CRUD
      const baseController: BaseController<ITenantDatabaseModel, Tenant> = new BaseController(tenantRepository, "Tenant");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }

  }

  async findByUserUID(req: Request, res: Response) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection);
      const getUserTenantsUseCase: GetUserTenantsUseCase = new GetUserTenantsUseCase(databasePermissionRepository);
      const usertenants = await getUserTenantsUseCase.execute(req.params.UID);

      if (usertenants == null) {
        return res.status(404).json({ message: 'Usuário não possui tenant que pode acessar' });
      }
      return res.status(200).send(usertenants);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor. " + error });
    }
  }

  /**
   * Obter todos os tenants que o usuário que faz a requisição é administrador
   * @returns Retorna um array com todos os tenants que o usuário que faz a requisição é administrador
   */
  async findTenantsUserIsAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      // const databasePermissionRepository: DatabasePermissionRepository = new DatabasePermissionRepository(req.body.tenantConnection as TenantConnection);
      const tenantRepository: TenantRepository = new TenantRepository(req.body.tenantConnection as TenantConnection);

      // const tenantsUserIsAdmin: Tenant[] = await te.findTenantsUserIsAdmin(req.params.userUID);
      const tenantsUserIsAdmin: ITenantDatabaseModel[] = await tenantRepository.findMany({ownerUserId: Number(req.params.userId)});

      if (tenantsUserIsAdmin.length == 0) {
        throw new NotFoundError("No tenants were found where this user is an administrator.");
      }

      return res.status(200).send(tenantsUserIsAdmin);
    } catch (error) {
      next(error);
    }
  }

  async getDatabaseType(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      const tenantConnection = req.body.tenantConnection as TenantConnection;
      const databaseType: DatabaseType = tenantConnection.databaseType;

      return res.status(200).send(databaseType);
    } catch (error) {
      next(error);
    }
  }

  async inviteUserToTenant(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const frontEndURI = process.env.FRONTEND_PATH;

      if(!frontEndURI){
        throw new NotFoundError("Variaveis ambiente não configuradas.");
      }

      const emailService: EmailService = new EmailService();
      const azureADService: AzureADService = new AzureADService();
      const tokenGenerator: TokenGenerator = new TokenGenerator();
      const inviteUserToTenantUseCase: InviteUserToTenantUseCase = new InviteUserToTenantUseCase(emailService, azureADService, tokenGenerator, frontEndURI);
      const response = await inviteUserToTenantUseCase.execute({
        databaseCredentialId: req.body.databaseCredentialId,
        invitedUserEmail: req.body.invitedUserEmail,
        invitingUserEmail: req.body.invitingUserEmail,
        tenantId: req.body.tenantId
      });

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  async removeUserAccessToTenant(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const removeUserAccessToTenantUseCase: RemoveUserAccessToTenantUseCase = new RemoveUserAccessToTenantUseCase();
      
      const response = await removeUserAccessToTenantUseCase.execute({
        removingAccessUserUID: req.body.removingAccessUserUID,
        removedAccessUserId: req.body.removedAccessUserId,
        tenantId: req.body.tenantId,
        databaseCredentialId: req.body.databaseCredentialId
      });

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }


}