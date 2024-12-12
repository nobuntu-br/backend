import { ModelStatic, Sequelize, Transaction } from "sequelize";
import { IDatabaseAdapter } from "./IDatabase.adapter";
import findDataByCustomQuery from "../utils/sequelize/customQuery.util";
import { FilterValue } from "../utils/mongoose/customQuery.util";
import { NotFoundError } from "../errors/notFound.error";
import { UnknownError } from "../errors/unknown.error";

/**
 * Implementação das funcionalidades do banco de dados com uso da biblioteca Sequelize
 */
export class SequelizeAdapter<TInterface, TClass> implements IDatabaseAdapter<TInterface, TClass> {

  private _model: ModelStatic<any>;
  private _databaseType: string;
  private _databaseConnection: Sequelize;

  constructor(model: any, databaseType: string, databaseConnection: Sequelize, protected jsonDataToResourceFn: (jsonData: any) => TClass) {
    this._model = model;
    this._databaseType = databaseType;
    this._databaseConnection = databaseConnection;
  }

  get databaseType() {
    return this._databaseType;
  }

  get model() {
    return this._model;
  }

  get databaseConnection(): Sequelize {
    return this._databaseConnection;
  }

  async create(data: TClass): Promise<TClass> {
    try {

      const newItem = await this._model.create(data!);
      return this.jsonDataToResource(newItem);

    } catch (error: any) {
      console.log(error);
      // Manipula erros específicos
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error("Error to save data usign sequelize. One data is unique. Detail: " + error);
      }

      if (error.name === 'SequelizeValidationError') {
        // Para erros de validação, você pode retornar detalhes específicos
        throw new Error("Validation Error on save data using Sequelize. Detail: " + error);
      }

      throw new UnknownError("Error to save data using Sequelize. Detail: " + error);
    }
  }

  async findAll(limitPerPage: number, offset: number): Promise<TClass[]> {
    try {

      const items = await this._model.findAll({
        limit: limitPerPage,
        offset: offset,
        order: [['createdAt', 'DESC']], // Ordenar por data de criação, por exemplo
      });

      return this.jsonDataToResources(items);

    } catch (error) {
      throw new UnknownError("Error to find all data using sequelize. Detail: " + error);
    }
  }

  async findOne(query: TInterface): Promise<TClass | null> {
    try {

      const item = await this._model.findOne({ where: query as any });

      if (item == null) {
        return null;
      }

      return this.jsonDataToResource(item);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to find one data using sequelize. Detail: " + error);
    }
  }

  async findMany(query: TInterface): Promise<TClass[]> {
    try {
      const item = await this._model.findAll({ where: query!, order: [['createdAt', 'DESC']] });

      if (item == null) {
        return [];
      }

      return this.jsonDataToResources(item);
    } catch (error) {
      throw new UnknownError("Error to find many entities to database using sequelize.");
    }

  }

  //TODO Tornar lazy loading
  async findById(id: number): Promise<TClass | null> {
    try {
      const returnedValue = await this._model.findOne({ where: { id: id }, include: [{ all: true }] });

      if (returnedValue == null) {
        return null;
      }

      this.replaceForeignKeyFieldWithData(returnedValue);

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to find data by id using Sequelize. Detail: " + error);
    }
  }

  async getCount(): Promise<number> {
    try {
      var count = await this._model.count();
      return count;
    } catch (error) {
      throw new UnknownError("Error to get data count using Sequelize. Detail: " + error);
    }

  }

  async update(id: number, data: Object): Promise<TClass> {
    try {

      //Irá obter a quantidade de linhas alteradas
      var [affectedCount] = await this._model.update(data, {
        where: {
          id: this.databaseType == "mongodb" ? id : Number(id),
        },
      });

      //Se nenhum registro foi atualizado
      if (affectedCount == 0) {
        throw new NotFoundError("Not found data");
      }

      //A opção de retornar o registro editado da função update só funciona pra msql e postgres, então na dúvida eu prefiro pesquisar novamente o registro pra não dar problemas (sei que duas buscas não é o ideial mas, o ambiente é complexo).
      const returnedValue = await this._model.findOne({ where: { id: id } });

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError(
        "Error to update entities to database using sequelize. Details: " +
        error
      );
    }

  }

  async delete(id: number): Promise<TClass> {

    try {
      //Essa busca é feita para retornar o objeto que será reovido
      const removedValue = await this.findById(id);

      await this._model.destroy({
        where: {
          id: id,
        },
      });

      return this.jsonDataToResource(removedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error delete data using Sequelize. Detail: " + error);
    }

  }

  //TODO Retornar um array de todas as instâncias removidas, se necessário.
  async deleteAll(): Promise<void> {
    try {
      await this._model.truncate();
    } catch (error) {
      throw new UnknownError("Error to delete all data using Sequelize. Detail: " + error);
    }
  }

  async findCustom(filterValues: FilterValue[], filterConditions: string[], model: ModelStatic<any>): Promise<TClass[] | null> {
    try {
      const items = await findDataByCustomQuery(filterValues, filterConditions, model);

      this.replaceForeignKeysFieldWithData(items);

      return this.jsonDataToResources(items);
    } catch (error) {
      throw new UnknownError("Error to find custom entity using Sequelize. Detail: " + error);
    }
  }

  async findUsingCustomQuery(query: any): Promise<TClass[]> {
    throw new Error("Function not implemented");
  }

  protected jsonDataToResources(jsonData: any[]): TClass[] {
    const resources: TClass[] = [];
    jsonData.forEach(
      element => resources.push(this.jsonDataToResourceFn(element.dataValues))
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): TClass {
    return this.jsonDataToResourceFn(jsonData.dataValues);
  }

  /**
   * Percorre os campos retornados das associações da entidade para substituir os campos que só ficam as chaves estrangeiras
   * @param item 
   */
  private replaceForeignKeyFieldWithData(item: any) {
    const ifRegex = /^ALIAS.*ALIAS/;
    const getRegex = /ALIAS(.*?)ALIAS/;
    const manyRegex = /^(ALIAS)(.*?)ALIAS.*ALIAS$/;
    for (let key in item) {
      if (ifRegex.test(key)) {
        const alias = key.match(getRegex);
        const manyAlias = key.match(manyRegex);

        //Se for uma associação de muitos para um
        if (manyAlias?.[2]) {
          item.dataValues[manyAlias?.[2]] = item[key];
          continue;
        }

        //Se for uma associação de um para um
        for (let key2 in item.dataValues) {
          if (alias?.[1] === key2) {
            console.log("key2: ", key2);
            item.dataValues[key2] = item[key];
          }
        }
      }
    }
  }

  /**
   * Percorre os campos retornados das associações da entidade para substituir os campos que só ficam as chaves estrangeiras de varias entidades
   * @param variableName 
   * @returns 
  */
  private replaceForeignKeysFieldWithData(items: any[]) {
    const ifRegex = /^ALIAS.*ALIAS/;
    const getRegex = /ALIAS(.*?)ALIAS/;
    const manyRegex = /^(ALIAS)(.*?)ALIAS.*ALIAS$/;
    for (let item of items) {
      for (let key in item) {
        if (ifRegex.test(key)) {
          const alias = key.match(getRegex);
          const manyAlias = key.match(manyRegex);

          //Se for uma associação de muitos para um
          if (manyAlias?.[2]) {
            item.dataValues[manyAlias?.[2]] = item[key];
            continue;
          }

          //Se for uma associação de um para um
          for (let key2 in item.dataValues) {
            if (alias?.[1] === key2) {
              console.log("key2: ", key2);
              item.dataValues[key2] = item[key];
            }
          }
        }
      }
    }
  }

  private getClassNameWithAlias(variableName: any): string | null {
    // Define o padrão da expressão regular para encontrar o texto entre "ALIAS"
    const pattern = /ALIAS(.*?)ALIAS/;

    // Encontra a primeira correspondência no texto usando a expressão regular
    const match = variableName.match(pattern);

    if (match) {
      // Retorna o texto encontrado entre os "ALIAS"
      return match[1];
    } else {
      return null;
    }
  }

  async startTransaction(): Promise<any> {
    try {
      return await this.databaseConnection.transaction();
    } catch (error) {
      throw new UnknownError("Error to start transaction using Sequelize. Detail: " + error);
    }
  }

  async commitTransaction(transaction: Transaction): Promise<any> {
    try {
      return await transaction.commit();
    } catch (error) {
      throw new UnknownError("Error to commit transaction using Sequelize. Detail: " + error);
    }
  }

  async rollbackTransaction(transaction: Transaction): Promise<void> {
    try {
      await transaction.rollback();
    } catch (error) {
      throw new UnknownError("Error to commit transaction using Sequelize. Detail: " + error);
    }
  }

  async createWithTransaction(data: TInterface, transaction: Transaction): Promise<TClass> {
    try {

      const newItem = await this._model.create(data!, { transaction: transaction });
      return this.jsonDataToResource(newItem);

    } catch (error: any) {
      await this.rollbackTransaction(transaction);
      // Manipula erros específicos
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error("Error to save data usign sequelize. One data is unique. Detail: " + error);
      }

      if (error.name === 'SequelizeValidationError') {
        // Para erros de validação, você pode retornar detalhes específicos
        throw new Error("Validation Error on save data using Sequelize. Detail: " + error);
      }

      throw new UnknownError("Error to save data with transaction using Sequelize. Detail: " + error);
    }
  }

  async updateWithTransaction(id: number, data: Object, transaction: Transaction): Promise<TClass> {
    try {

      //Irá obter a quantidade de linhas alteradas
      var [affectedCount] = await this._model.update(data, {
        where: {
          id: this.databaseType == "mongodb" ? id : Number(id),
        },
        transaction: transaction
      });

      //Se nenhum registro foi atualizado
      if (affectedCount == 0) {
        throw new NotFoundError("Not found data");
      }

      //A opção de retornar o registro editado da função update só funciona pra msql e postgres, então na dúvida eu prefiro pesquisar novamente o registro pra não dar problemas (sei que duas buscas não é o ideial mas, o ambiente é complexo).
      const returnedValue = await this._model.findOne({ where: { id: id } });

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      await this.rollbackTransaction(transaction);

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError(
        "Error to update entities to database with transaction using Sequelize. Details: " +
        error
      );
    }
  }

  async deleteWithTransaction(id: number, transaction: Transaction): Promise<TClass> {
    try {
      //Essa busca é feita para retornar o objeto que será removido
      const removedValue = await this._model.findOne({ where: { id: id }, transaction: transaction });

      await this._model.destroy({
        where: {
          id: id,
        },
        transaction: transaction
      });

      return this.jsonDataToResource(removedValue);
    } catch (error) {
      await this.rollbackTransaction(transaction);
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error delete data using Sequelize. Detail: " + error);
    }

  }

  async findAllWithAagerLoading(limitPerPage: number, offset: number): Promise<TClass[]> {
    try {

      const items = await this._model.findAll({
        limit: limitPerPage,
        offset: offset,
        order: [['createdAt', 'DESC']], // Ordenar por data de criação, por exemplo
        include: [{ all: true }]
      });

      this.replaceForeignKeysFieldWithData(items);

      return this.jsonDataToResources(items);

    } catch (error) {
      throw new UnknownError("Error to find all data using sequelize. Detail: " + error);
    }
  }

  async findOneWithEagerLoading(query: TInterface): Promise<TClass> {
    try {
      const item = await this._model.findOne({ where: query as any, include: [{ all: true }] });

      if (item == null) {
        throw new NotFoundError("Not found document");
      }

      return this.jsonDataToResource(item);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to find one data using sequelize. Detail: " + error);
    }
  }

  findManyWithEagerLoading(query: TInterface): Promise<TClass[]> {
    throw new Error("Method not implemented");
  }

  async findByIdWithEagerLoading(id: number): Promise<TClass | null> {
    try {
      const returnedValue = await this._model.findOne({ where: { id: id }, include: [{ all: true }] });

      if (returnedValue == null) {
        return null;
      }

      this.replaceForeignKeyFieldWithData(returnedValue);

      return this.jsonDataToResource(returnedValue);
    } catch (error) {

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new UnknownError("Error to find data by id using Sequelize. Detail: " + error);
    }
  }

}