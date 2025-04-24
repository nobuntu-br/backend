import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../../errors/notFound.error";
import MenuRepository from "../../../domain/repositories/menu.repository";
import TenantConnection from "../../../domain/entities/tenantConnection.model";

export class MenuController { 

      async  getAll(req: Request, res: Response, next: NextFunction){ 
        try {             
          if (req.body.tenantConnection == undefined) { 
            throw new NotFoundError("Não foi definido tenant para uso.");
          } 

        const menuRepository : MenuRepository = new MenuRepository(req.body.tenantConnection as TenantConnection);

        const menus = await menuRepository.getAllMenus();
        res.status(200).json(menus);
        } catch (error) { 
          console.log(error);
          next(error);
        } 
      } 

      async getDefaultMenu(req: Request, res: Response, next: NextFunction){
        try {
          if (req.body.tenantConnection == undefined) { 
            throw new NotFoundError("Não foi definido tenant para uso.");
          } 

          const menuRepository : MenuRepository = new MenuRepository(req.body.tenantConnection as TenantConnection);

          const menus = await menuRepository.getDefaultMenu(); 
          res.status(200).json(menus);
        }
        catch (error) {
          console.log(error);
          next(error);
        }
      }

      async getAllByRole(req: Request, res: Response, next: NextFunction){
        try {             
          if (req.body.tenantConnection == undefined) { 
            throw new NotFoundError("Não foi definido tenant para uso.");
          } 
          const menuRepository : MenuRepository = new MenuRepository(req.body.tenantConnection as TenantConnection);

          const roleId = parseInt(req.query.roleId as string);
          if(!roleId) {
            throw new NotFoundError("roleId não foi informado.");
          }

          if (isNaN(roleId)) {
            throw new NotFoundError("roleId não é um número válido.");
          }
          console.log(roleId);
          const menus = await menuRepository.getMenuByRole(roleId); //TODO: Trocar para pegar o role do usuário logado
          res.status(200).json(menus);
        } catch (error) { 
          console.log(error);
          next(error);
        } 
      }

      async getById(req: Request, res: Response, next: NextFunction){
        try{
          if (req.body.tenantConnection == undefined) { 
            throw new NotFoundError("Não foi definido tenant para uso.");
          } 

          const menuRepository : MenuRepository = new MenuRepository(req.body.tenantConnection as TenantConnection);

          const id = parseInt(req.params.id as string);
            const menu = await menuRepository.getMenuById(id);

            if (!menu || menu.length === 0) {
            throw new NotFoundError("Menu não encontrado.");
            }

          if (!menu || menu.length === 0) {
            throw new NotFoundError("Menu não encontrado.");
          }

          res.status(200).json(menu);
        } catch (error) {
          console.log(error);
          next(error);
        }
      }
}
