import { ModelStatic } from "sequelize";
import { IDatabaseAdapter } from "./IDatabase.adapter";

export class SequelizeAdapter<T> implements IDatabaseAdapter<T> {

  private model: ModelStatic<any>;

  constructor(model: any, protected jsonDataToResourceFn: (jsonData: any) => T) {
    this.model = model;
  }

  async create(data: any): Promise<T> {
    try {

      const newItem = await this.model.create(data);
      return this.jsonDataToResource(newItem);
    } catch (error: any) {
      console.warn(error);
      // Manipula erros específicos
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error("Error to save data usign sequelize. One data is unique.");
      }

      if (error.name === 'SequelizeValidationError') {
        // Para erros de validação, você pode retornar detalhes específicos
        throw new Error("Erro to save data using sequelize. Validation Error. " + error);
      }

      throw new Error("Error to save entity to database using sequelize.");
    }
  }

  async findAll(limitPerPage: number, offset: number): Promise<T[]> {
    try {

      const items = await this.model.findAll({
        limit: limitPerPage,
        offset: offset,
        order: [['createdAt', 'DESC']], // Ordenar por data de criação, por exemplo
        include: [{ all: true }]
      });
      
      this.replaceForeignKeysFieldWithData(items);

      return this.jsonDataToResources(items);

    } catch (error) {
      console.warn("Error to find all entities to database using sequelize. Details: " + error);
      throw new Error("Error to find all entities to database using sequelize.");
    }
  }

  async findOne(query: any): Promise<T | null> {
    try {
      const item = await this.model.findOne({ where: query, include: [{ all: true }] });

      if (item == null) {
        return null;
      }

      return this.jsonDataToResource(item);
    } catch (error) {
      console.warn("Error to find one entity to database using sequelize. Details: " + error);
      // console.warn(error);
      throw new Error("Error to find one entity to database using sequelize.");
    }
  }

  async findMany(query: any): Promise<T[] | null> {
    try {
      const item = await this.model.findAll({ where: query });

      if (item == null) {
        return null;
      }

      return this.jsonDataToResources(item);
    } catch (error) {
      console.warn("Error to find many entities to database using sequelize. Details: " + error);
      // console.warn(error);
      throw new Error("Error to find many entities to database using sequelize.");
    }

  }

  async findById(id: string): Promise<T | null> {
    try {
      const item = await this.model.findOne({ where: { id: id }, include: [{ all: true }] });

      this.replaceForeignKeyFieldWithData(item);

      return this.jsonDataToResource(item);
    } catch (error) {
      console.warn("Error to find by id entity to database using sequelize. Details: " + error);
      throw new Error("Error to find by id entity to database using sequelize.");
    }
  }

  async getCount(): Promise<number | null> {
    try {
      var count = await this.model.count();
      return count;
    } catch (error) {
      console.warn("Error to get count entities to database using sequelize. Details: " + error);
      throw new Error("Error to get count entities to database using sequelize.");
    }

  }

  async update(id: string, data: Object): Promise<T | null> {
    try {
      //Irá obter a quantidade de linhas alteradas
      var [affectedCount] = await this.model.update(data, {
        where: {
          id: id,
        },
      });

      //Se foi atualizado nenhum registro
      if (affectedCount == 0) {
        return null;
      }

      return this.jsonDataToResource(data);
    } catch (error) {
      console.warn(
        "Error to update entities to database using sequelize. Details: " +
        error
      );
      throw new Error(
        "Error to update entities to database using sequelize. Details: " +
        error
      );
    }

  }

  async delete(id: string): Promise<T | null> {

    try {
      const removedItem = await this.model.destroy({
        where: {
          id: id,
        },
      });

      return this.jsonDataToResource(removedItem);
    } catch (error) {
      console.warn("Error to get delete entity to database using sequelize. Details: " + error);
      throw new Error("Error to get delete entity to database using sequelize.");
    }

  }

  async deleteAll(): Promise<void> {
    try {
      await this.model.truncate();
    } catch (error) {
      console.warn("Error to get delete all entity to database using sequelize. Details: " + error);
      throw new Error("Error to get delete all entity to database using sequelize.");
    }
  }

  findCustom(query: any): Promise<T[] | null> {
    throw new Error("Method not implemented.");
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(
      element => resources.push(this.jsonDataToResourceFn(element.dataValues))
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
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
    for(let key in item){
      if(ifRegex.test(key)){
        const alias = key.match(getRegex);
        const manyAlias = key.match(manyRegex);

        //Se for uma associação de muitos para um
        if(manyAlias?.[2]){
          item.dataValues[manyAlias?.[2]] = item[key];
          continue;
        }

        //Se for uma associação de um para um
        for(let key2 in item.dataValues){
          if(alias?.[1] === key2){
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
  for(let item of items){
    for(let key in item){
      if(ifRegex.test(key)){
        const alias = key.match(getRegex);
        const manyAlias = key.match(manyRegex);

        //Se for uma associação de muitos para um
        if(manyAlias?.[2]){
          item.dataValues[manyAlias?.[2]] = item[key];
          continue;
        }

        //Se for uma associação de um para um
        for(let key2 in item.dataValues){
          if(alias?.[1] === key2){
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

}
