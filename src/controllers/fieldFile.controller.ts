import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import { FieldFile } from "../models/fieldFile.model"; 
import { FieldFileService } from "../services/fieldFile.service";
import { NotFoundError } from "../errors/notFound.error";

export class FieldFileController { 

  async create(req: Request, res: Response, next: NextFunction){ 
    try { 
      if (req.body.databaseConnection == undefined) { 
        throw new NotFoundError("Não foi definido tenant para uso.");
      } 
      //O Service será criado com base no tipo de banco de dados e o model usado 
    const  fieldFileService : FieldFileService = new FieldFileService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection); 
    const baseController : BaseController<FieldFile> = new BaseController(fieldFileService,  "fieldFile"); 

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
    const  fieldFileService : FieldFileService = new FieldFileService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection); 
    const baseController : BaseController<FieldFile> = new BaseController(fieldFileService,  "fieldFile"); 

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
    const  fieldFileService : FieldFileService = new FieldFileService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection); 
    const baseController : BaseController<FieldFile> = new BaseController(fieldFileService,  "fieldFile"); 

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
    const  fieldFileService : FieldFileService = new FieldFileService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection); 
    const baseController : BaseController<FieldFile> = new BaseController(fieldFileService,  "fieldFile"); 

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
    const  fieldFileService : FieldFileService = new FieldFileService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection); 
    const baseController : BaseController<FieldFile> = new BaseController(fieldFileService,  "fieldFile"); 

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
    const  fieldFileService : FieldFileService = new FieldFileService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection); 
    const baseController : BaseController<FieldFile> = new BaseController(fieldFileService,  "fieldFile"); 

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
    const  fieldFileService : FieldFileService = new FieldFileService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection); 
    const baseController : BaseController<FieldFile> = new BaseController(fieldFileService,  "fieldFile"); 

      baseController.findCustom(req, res, next); 
    } catch (error) { 
      next(error);
    } 
  } 

  async upload(req: Request, res: Response, next: NextFunction){
    try { 
      if (req.body.databaseConnection == undefined) { 
        throw new NotFoundError("Não foi definido tenant para uso.");
      } 
      //O Service será criado com base no tipo de banco de dados e o model usado 
    const  fieldFileService : FieldFileService = new FieldFileService(req.body.databaseConnection.databaseType, req.body.databaseConnection.connection); 

    // Extrair apenas a parte desejada
    const { fieldType, files } = req.body;

    // Criar uma nova variável com apenas os dados desejados
    const fieldFile = { fieldType, files };

    const data = await fieldFileService.upload(fieldFile);

    res.status(200).send(data);
    } catch (error) { 
      next(error);
    } 
  }

}
