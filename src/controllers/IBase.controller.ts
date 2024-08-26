import { Request, Response } from "express";

export interface IBaseController {
  create(req: Request, res: Response): Promise<any>;
  findAll(req: Request, res: Response): Promise<any>;
  findOne(req: Request, res: Response): Promise<any>;
  findById(req: Request, res: Response): Promise<any>;
  getCount(req: Request, res: Response): Promise<any>;
  update(req: Request, res: Response): Promise<any>;
  delete(req: Request, res: Response): Promise<any>;
  deleteAll(req: Request, res: Response): Promise<any>;
  
}
