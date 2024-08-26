
import { Request, Response } from "express";
import { IBaseService } from "../services/IBase.service";
import { IBaseController } from "./IBase.controller";

export class BaseController<T> implements IBaseController {

  private service: IBaseService<T>;
  public entityName: string;

  constructor(service: IBaseService<T>, entityName: string) {
    this.service = service;
    this.entityName = entityName;
  }

  /**
   * Realiza a criação e salvamento no banco de dados de uma nova entidade
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  public async create(req: Request, res: Response): Promise<Object | null> {
    try {
      const data = await this.service.create(req.body);

      return res.status(200).send(data);
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Ocorreu um erro de servidor ao tentar salvar "+this.entityName+"." });
    }
  }

  /**
   * Obtem todos os registros da entidade
   * @param req Dados da requisição
   * @param res Resposta da requisição
   * @returns Retorna um Object ou null
   */
  async findAll(req: Request, res: Response): Promise<Object | Object[] | null> {
    try {
      //Obtem a página
      const page: number = parseInt(req.query.page as string) || 1;
      //Obtem a quantidade limite de itens por página
      const limitItems: number = parseInt(req.query.limit as string) || 100;

      const startIndex = (page - 1) * limitItems;

      const data = await this.service.findAll(limitItems, startIndex);
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
  async findOne(req: Request, res: Response): Promise<Object | null> {
    try {
      const data = await this.service.findOne(req.body);
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
  async findById(req: Request, res: Response): Promise<Object | null> {
    try {
      const data = await this.service.findById(req.params.id);
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
  async getCount(req: Request, res: Response): Promise<Object | null> {
    try {
      const data = await this.service.getCount();
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
  async update(req: Request, res: Response): Promise<Object | null> {
    try {
      const id = req.params.id;
      const newValues = req.body;

      const data = await this.service.update(id, newValues);
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
  async delete(req: Request, res: Response): Promise<Object> {
    try {
      const id = req.params.id;
      const data = await this.service.delete(id);

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
  async deleteAll(req: Request, res: Response): Promise<Object> {
    try {
      const data = await this.service.deleteAll();
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
  async findCustom(req: Request, res: Response): Promise<Object> {
    throw new Error("Method not implemented.");
  }

}