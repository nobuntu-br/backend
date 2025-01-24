import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../../errors/notFound.error";
import { GetPageStructureUseCase } from "../../../useCases/componentStructure/getPageStructure.useCase";
import ComponentStructureRepository from "../../../domain/repositories/componentStructure.repository";
import UserRepository from "../../../domain/repositories/user.repository";
import RoleRepository from "../../../domain/repositories/role.repository";

export class ComponentStructureController {

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const { componentName, userId } = req.body;

      const componentStructureRepository: ComponentStructureRepository = new ComponentStructureRepository(req.body.tenantConnection);
      const userRepository: UserRepository = new UserRepository(req.body.tenantConnection);
      const getPageStructureUseCase: GetPageStructureUseCase = new GetPageStructureUseCase(componentStructureRepository, userRepository);

      const response = await getPageStructureUseCase.execute({
        componentName: componentName,
        userId: userId
      });

      return res.status(200).send(response);

    } catch (error) {
      next(error);
    }
  }

}