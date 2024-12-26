import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/notFound.error";
import ComponentStructureRoleRepository from "../repositories/componentStructureRole.repository";
import { GetPageStructureUseCase } from "../useCases/componentStructure/getPageStructure.useCase";

export class ComponentStructureController {

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const { pageName, userUID } = req.body;

      const componentStructureRoleRepository: ComponentStructureRoleRepository = new ComponentStructureRoleRepository(req.body.tenantConnection);
      const getPageStructureUseCase: GetPageStructureUseCase = new GetPageStructureUseCase(componentStructureRoleRepository);

      const response = getPageStructureUseCase.execute({
        pageName: pageName,
        userUID: userUID
      });

      return res.status(200).send(response);

    } catch (error) {
      next(error);
    }
  }

}