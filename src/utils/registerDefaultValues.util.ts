import TenantConnection from "../domain/entities/fixes/tenantConnection.model";
import BaseRepository from "../domain/repositories/fixes/base.repository";
import { UnknownError } from "../errors/unknown.error";
const fs = require('fs-extra');
const path = require('node:path');

/**
 * Realiza a leitura de um array de JSON para realizar o salvamento no banco de dados
 * @param databaseConnection Conexão no banco de dados
 * @param fileName Nome do arquivo JSON
 * @param repository Instância da classe repository. Responsável pelas operações no banco de dados da entidade.
 */
export async function registerDefaultDataOnDatabase(databaseConnection: TenantConnection, fileName: string, repository: BaseRepository<any, any>) {

  let objects: any[] = [];

  try {
    objects = loadJSON(fileName);
  } catch (error) {
    throw new UnknownError("Error to find file to load. Detail: " + error);
  }

  for (let index = 0; index < objects.length; index++) {
    const element = objects[index];

    let foundElement = null;
    try {
      foundElement = await repository.findOne(element);
    } catch (error) {
      //TODO lidar com erro ao procurar elemento
    }

    if (foundElement == null) {
      try {
        await repository.create(element);
      } catch (error) {
        throw new UnknownError("Error to save default data on database. Detail: " + error);
      }
    }

  }

}

function loadJSON(fileName: string): any[] {
  const dir = path.join(__dirname, '../resources/' + fileName);

  return JSON.parse(fs.readFileSync(dir, "utf-8"));
}


