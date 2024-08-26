import { IDatabaseAdapter } from "./IDatabase.adapter";
import { MongooseAdapter } from "./mongoose.adapter";
import { SequelizeAdapter } from "./sequelize.adapter";

export type DbType = 'mongodb' | 'postgres' | 'mysql' | 'firebird';

/**
 * Função que irá obter as funcionalidades de operação com banco de dados da biblioteca de acordo com o que é emitido
 * @param dbType Tipo de banco de dados
 * @param model Modelo da entidade
 * @param jsonDataToResourceFn Função para criar uma classe com base no JSON retornado das funções
 * @returns 
 */
function createDbAdapter<T>(dbType: DbType, model: any, jsonDataToResourceFn: (jsonData: any) => T): IDatabaseAdapter<T> {
  switch (dbType) {
    case 'mongodb':
      return new MongooseAdapter<T>(model, jsonDataToResourceFn);
    case 'postgres':
      return new SequelizeAdapter<T>(model, jsonDataToResourceFn);
    case 'mysql':
      return new SequelizeAdapter<T>(model, jsonDataToResourceFn);
    // TODO: Adicionar outros tipos de banco de dados conforme necessário
    default:
      throw new Error('Tipo de banco de dados não suportado com a classe');
  }
}

export default createDbAdapter;
