import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { GetApplicationFromDirectoryUseCase } from "../../../useCases/application/getApplicationFromDirectory.useCase";
import { AzureADService } from "../../../domain/services/azureAD.service";

export class ApplicationController {

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {

      const azureADService: AzureADService = new AzureADService();
      const getApplicationFromDirectoryUseCase : GetApplicationFromDirectoryUseCase = new GetApplicationFromDirectoryUseCase(azureADService);

      const applications = await getApplicationFromDirectoryUseCase.execute();

      return res.status(200).send(applications);
    } catch (error) {
      next(error);
    }
  }

}