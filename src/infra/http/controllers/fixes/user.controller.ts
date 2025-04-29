import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { NotFoundError } from "../../../../errors/notFound.error";
import { IidentityService } from "../../../../domain/services/Iidentity.service";
import { AzureADService } from "../../../../domain/services/azureAD.service";
import { GetUserProfilePhotoUseCase } from "../../../../useCases/user/getUserProfilePhoto.useCase";
import { UpdateUserProfilePhotoUseCase } from "../../../../useCases/user/updateUserProfilePhoto.UseCase";
import { UnauthorizedError } from "../../../../errors/unauthorized.error";
import { GetUserGroupsUseCase } from "../../../../useCases/user/getUserGroups.useCase";
import UserRepository from "../../../../domain/repositories/fixes/user.repository";
import { IUser, User } from "../../../../domain/entities/fixes/user.model";


export class UserController {

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userRepository, "User");

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
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userRepository, "User");

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
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userRepository, "User");

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
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userRepository, "User");

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
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userRepository, "User");

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
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const baseController: BaseController<IUser, User> = new BaseController(userRepository, "User");

      baseController.deleteAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async findByUID(req: Request, res: Response) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }
      //O Service será criado com base no tipo de banco de dados e o model usado
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);

      const user = await userRepository.findOne({ UID: req.params.UID });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ message: "Ocorreu um erro desconhecido no servidor. " + error });
    }
  }

  /**
   * Cria o usuário dentro do banco de dados da aplicação da empresa
   */
  async createUserForSpecificTenant(req: Request, res: Response, next: NextFunction) {
    try {

      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.")
      }

      throw new Error("Função não finalizada");

      // return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserProfilePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const identityService: IidentityService = new AzureADService();
      const getUserProfilePhotoUseCase: GetUserProfilePhotoUseCase = new GetUserProfilePhotoUseCase(identityService);

      const result = await getUserProfilePhotoUseCase.execute({
        userID: req.body.userID
      });

      return res.status(200).send(result);

    } catch (error) {
      next(error);
    }
  }

  async getUserImage(req: Request, res: Response, next: NextFunction) {
    try {

      const authorizationHeader = req.headers['authorization'];

      if (authorizationHeader == undefined || authorizationHeader == null || authorizationHeader == "") {
        throw new UnauthorizedError("Access token invalid.");
      }

      const accessToken = authorizationHeader && authorizationHeader.split(' ')[1];

      if (accessToken == undefined) {
        throw new UnauthorizedError("Access token invalid.");
      }

      const identityService: IidentityService = new AzureADService();
      const updateUserProfilePhotoUseCase: UpdateUserProfilePhotoUseCase = new UpdateUserProfilePhotoUseCase(identityService);

      const result = await updateUserProfilePhotoUseCase.execute({
        accessToken: accessToken,
        photoBlob: req.body//TODO tem que criar um middleware com o multer e guardar a imagem na memória para poder enviar para esse caso de uso
      });

      return res.status(200).send(result);

    } catch (error) {
      next(error);
    }
  }

  async getUserGroups(req: Request, res: Response, next: NextFunction){
    try {

      const authorizationHeader = req.headers['authorization'];

      if (authorizationHeader == undefined || authorizationHeader == null || authorizationHeader == "") {
        throw new UnauthorizedError("Access token invalid.");
      }

      const accessToken = authorizationHeader && authorizationHeader.split(' ')[1];

      if (accessToken == undefined) {
        throw new UnauthorizedError("Access token invalid.");
      }

      const identityService: IidentityService = new AzureADService();

      const getUserGroupsUseCase: GetUserGroupsUseCase = new GetUserGroupsUseCase(identityService);
      const result = await getUserGroupsUseCase.execute({
        accessToken: accessToken
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

}