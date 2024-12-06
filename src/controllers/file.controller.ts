import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { File, IFile } from "../models/file.model"; 
import { FileService } from "../services/file.service";
import { NotFoundError } from "../errors/notFound.error";

export class FileController { 

  async create(req: Request, res: Response, next: NextFunction){ 
    try { 
      if (req.body.databaseConnection == undefined) { 
        throw new NotFoundError("Não foi definido tenant para uso.");
      } 
      //O Service será criado com base no tipo de banco de dados e o model usado 
    const  fileService : FileService = new FileService(req.body.databaseConnection.databaseType, req.body.databaseConnection); 
    const baseController : BaseController<IFile, File> = new BaseController(fileService,  "file"); 

    baseController.create(req, res, next); 
    } catch (error) { 
      next(error);
    } 
  } 

  async findAll(req: Request, res: Response, next: NextFunction){ 
    try { 
      if (req.body.databaseConnection == undefined) { 
        throw new NotFoundError("Não foi definido tenant para uso.");
      } 
      //O Service será criado com base no tipo de banco de dados e o model usado 
    const  fileService : FileService = new FileService(req.body.databaseConnection.databaseType, req.body.databaseConnection); 
    const baseController : BaseController<IFile, File> = new BaseController(fileService,  "file"); 

    baseController.findAll(req, res, next); 
    } catch (error) { 
      next(error);
    } 
  } 

  async findById(req: Request, res: Response, next: NextFunction){ 
    try { 
      if (req.body.databaseConnection == undefined) { 
        throw new NotFoundError("Não foi definido tenant para uso.");
      } 
      //O Service será criado com base no tipo de banco de dados e o model usado 
    const  fileService : FileService = new FileService(req.body.databaseConnection.databaseType, req.body.databaseConnection); 
    const baseController : BaseController<IFile, File> = new BaseController(fileService,  "file"); 

    baseController.findById(req, res, next); 
    } catch (error) { 
      next(error);
    } 
  } 

  async update(req: Request, res: Response, next: NextFunction){ 
    try { 
      if (req.body.databaseConnection == undefined) { 
        throw new NotFoundError("Não foi definido tenant para uso.");
      } 
      //O Service será criado com base no tipo de banco de dados e o model usado 
    const  fileService : FileService = new FileService(req.body.databaseConnection.databaseType, req.body.databaseConnection); 
    const baseController : BaseController<IFile, File> = new BaseController(fileService,  "file"); 

    baseController.update(req, res, next); 
    } catch (error) { 
      next(error);
    } 
  } 

  async getCount(req: Request, res: Response, next: NextFunction){ 
    try { 
      if (req.body.databaseConnection == undefined) { 
        throw new NotFoundError("Não foi definido tenant para uso.");
      } 
      //O Service será criado com base no tipo de banco de dados e o model usado 
    const  fileService : FileService = new FileService(req.body.databaseConnection.databaseType, req.body.databaseConnection); 
    const baseController : BaseController<IFile, File> = new BaseController(fileService,  "file"); 

    baseController.getCount(req, res, next); 
    } catch (error) { 
      next(error);
    } 
  } 

  async delete(req: Request, res: Response, next: NextFunction){ 
    try { 
      if (req.body.databaseConnection == undefined) { 
        throw new NotFoundError("Não foi definido tenant para uso.");
      } 
      //O Service será criado com base no tipo de banco de dados e o model usado 
    const  fileService : FileService = new FileService(req.body.databaseConnection.databaseType, req.body.databaseConnection); 
    const baseController : BaseController<IFile, File> = new BaseController(fileService,  "file"); 

    baseController.delete(req, res, next); 
    } catch (error) { 
      next(error);
    } 
  } 

  async customQuery(req: Request, res: Response, next: NextFunction){ 
    try { 
      if (req.body.databaseConnection == undefined) { 
        throw new NotFoundError("Não foi definido tenant para uso.");
      } 
      //O Service será criado com base no tipo de banco de dados e o model usado 
    const  fileService : FileService = new FileService(req.body.databaseConnection.databaseType, req.body.databaseConnection); 
    const baseController : BaseController<IFile, File> = new BaseController(fileService,  "file"); 

      baseController.findCustom(req, res, next); 
    } catch (error) { 
      next(error);
    } 
  } 

}
