import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { NotFoundError } from "../../../errors/notFound.error";
import { IFile, File } from "../../../domain/entities/file.model";
import FileRepository from "../../../domain/repositories/file.repository";
import TenantConnection from "../../../domain/entities/tenantConnection.model";

export class FileController {

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const fileRepository: FileRepository = new FileRepository(req.body.tenantConnection as TenantConnection);
      const baseController: BaseController<IFile, File> = new BaseController(fileRepository, "File");

      baseController.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const fileRepository: FileRepository = new FileRepository(req.body.tenantConnection);
      const baseController: BaseController<IFile, File> = new BaseController(fileRepository, "File");

      baseController.findAll(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const fileRepository: FileRepository = new FileRepository(req.body.tenantConnection);
      const baseController: BaseController<IFile, File> = new BaseController(fileRepository, "File");

      baseController.findById(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const fileRepository: FileRepository = new FileRepository(req.body.tenantConnection);
      const baseController: BaseController<IFile, File> = new BaseController(fileRepository, "File");

      baseController.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async getCount(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const fileRepository: FileRepository = new FileRepository(req.body.tenantConnection);
      const baseController: BaseController<IFile, File> = new BaseController(fileRepository, "File");

      baseController.getCount(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const fileRepository: FileRepository = new FileRepository(req.body.tenantConnection);
      const baseController: BaseController<IFile, File> = new BaseController(fileRepository, "File");

      baseController.delete(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async customQuery(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tenantConnection == undefined) {
        throw new NotFoundError("Não foi definido tenant para uso.");
      }

      const fileRepository: FileRepository = new FileRepository(req.body.tenantConnection);
      const baseController: BaseController<IFile, File> = new BaseController(fileRepository, "File");

      baseController.findCustom(req, res, next);
    } catch (error) {
      next(error);
    }
  }

}
