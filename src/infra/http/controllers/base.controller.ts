
import { NextFunction, Request, Response } from "express";
import { IBaseController } from "./IBase.controller";
import { IBaseRepository } from "../../../domain/repositories/ibase.repository";

export class BaseController<TInterface, TClass> implements IBaseController {

  private repository: IBaseRepository<TInterface, TClass>;
  public entityName: string;
  
  constructor(repository: IBaseRepository<TInterface, TClass>, entityName: string) {
    this.repository = repository;
    this.entityName = entityName;
  }

  /**
   * Realiza a criação e salvamento no banco de dados de uma nova entidade
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repository.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error); 
    }
  }
  /**
   * Obtem todos os registros da entidade
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  async findAll(req: Request, res: Response, next: NextFunction): Promise<Object | Object[] | null> {
    try {
      //Obtem a página
      const page: number = parseInt(req.query.page as string) || 1;
      //Obtem a quantidade limite de itens por página
      const limitItems: number = parseInt(req.query.limit as string) || 100;

      const startIndex = (page - 1) * limitItems;

      const data = await this.repository.findAllWithAagerLoading(limitItems, startIndex);
      return res.status(200).send(data);
    } catch (err) {
      return res.status(500).send({ message: err || "Algum erro desconhecido ocorreu ao buscar "+this.entityName+"." });
    }
  }

  /**
   * Retorna um registro da entidade
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  async findOne(req: Request, res: Response, next: NextFunction): Promise<Object | null> {
    try {
      const data = await this.repository.findOne(req.body);
      if (!data){
        return res.status(404).send({ message: "A entidade com id " + req.params.id + " não foi encontrada!" });
      }

      return res.status(200).send(data);
    } catch (err) {
      return res.status(500).send({ message: err || "Algum erro desconhecido ocorreu ao buscar "+this.entityName+"." });
    }
  }

  /**
   * Obtem um registro da entidade que tenha o Identificador igual
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  async findById(req: Request, res: Response, next: NextFunction): Promise<Object | null> {
    try {
      const id : number = Number(req.params.id);
      const data = await this.repository.findById(id);
      if (!data){
        return res.status(404).send({ message: "A entidade com id " + req.params.id + " não foi encontrada!" });
      }

      return res.status(200).send(data);
    } catch (err) {
      return res.status(500).send({ message: err || "Algum erro desconhecido ocorreu ao buscar "+this.entityName+"." });
    }
  }

  /**
   * Obtem a quantidade de registros da entidade
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  async getCount(req: Request, res: Response, next: NextFunction): Promise<Object | null> {
    try {
      const data = await this.repository.getCount();
      return res.status(200).send({"count" : data!.toString()});
    } catch (err) {
      return res.status(500).send({ message: err || "Algum erro desconhecido ocorreu ao buscar "+this.entityName+"." });
    }
  }

  /**
   * Atualiza dados de uma registro da entidade
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<Object | null> {
    try {
      const id : number = Number(req.params.id);
      const newValues = req.body;

      const data = await this.repository.update(id, newValues);
      if (!data) {
        return res.status(404).send({ message: `A entidade `+this.entityName+` com id ${id} não encontrada, por isso não pode ser atualizada!` });
      }

      return res.status(200).send({ message: `A entidade `+this.entityName+` com id ${id} foi alterada com sucesso.` });
    } catch (err) {
      return res.status(500).send({ message: err || `Erro desconhecido ocorreu ao alterar a entidade `+this.entityName+` com o id ${req.params.id}.` });
    }
  }

  /**
   * Remove um registro da entidade
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<Object> {
    try {
      const id : number = Number(req.params.id);
      const data = await this.repository.delete(id);

      if (!data) {
        return res.status(404).send({ message: `A entidade `+this.entityName+` com id ${id} não encontrada, por isso não pode ser excluída!` });
      }
      return res.status(200).send({ message: `A entidade `+this.entityName+` com id ${id} foi excluída com sucesso.` });
    } catch (err) {
      return res.status(500).send({ message: err || `Erro desconhecido ocorreu ao excluir a entidade `+this.entityName+` com o id ${req.params.id}.` });
    }
  }

  /**
   * Remove todas os registros da entidade
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  async deleteAll(req: Request, res: Response, next: NextFunction): Promise<Object> {
    try {
      const data = await this.repository.deleteAll();
      return res.status(200).send({ message: `Todos as entidades `+this.entityName+` foram excluídas!` });
    } catch (err) {
      return res.status(500).send({ message: err || "Algum erro desconhecido ocorreu ao excluir todas as entidades "+this.entityName+"." });
    }
    
  }

  /**
   * Obtem valores com base em dados de uma busca com uso de filtro
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  async findCustom(req: Request, res: Response, next: NextFunction): Promise<Object> {
    try {
      const filterValues = req.body.filterValues; 
      const filterConditions = req.body.conditions; 
      const model = req.body.tenantConnection.models[this.entityName];

      const data = await this.repository.findCustom(filterValues, filterConditions, model);

      return res.status(200).send(data);
    } catch (err) {
      return res.status(500).send({ message: err || "Algum erro desconhecido ocorreu ao buscar "+this.entityName+"." });
    }
  }

  async executeQuery(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = await this.repository.executeQuery(req.body.query);
      if (!data){
        return res.status(404).send({ message: "A entidade com id " + req.params.id + " não foi encontrada!" });
      }

      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }

}