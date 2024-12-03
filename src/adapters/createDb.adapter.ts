import { IDatabaseAdapter } from "./IDatabase.adapter";
import { MongooseAdapter } from "./mongoose.adapter";
import { SequelizeAdapter } from "./sequelize.adapter";

export type DatabaseType = "mongodb" | "postgres" | "mysql" | "sqlite" | "mariadb" | "mssql" | "db2" | "snowflake" | "oracle" | "firebird";

/**
 * Função que irá obter as funcionalidades de operação com banco de dados da biblioteca de acordo com o que é emitido
 * @param databaseType Tipo de banco de dados
 * @param model Modelo da entidade
 * @param jsonDataToResourceFn Função para criar uma classe com base no JSON retornado das funções
 * @returns 
 */
function createDbAdapter<TInterface, TClass>(databaseType: DatabaseType, model: any, jsonDataToResourceFn: (jsonData: any) => TClass): IDatabaseAdapter<TInterface, TClass> {
  switch (databaseType) {
    case "mongodb":
      return new MongooseAdapter<TInterface, TClass>(model, databaseType, jsonDataToResourceFn);
    case "firebird":
      throw new Error("Method not implemented");
    default:
      return new SequelizeAdapter<TInterface, TClass>(model, databaseType, jsonDataToResourceFn);
  }
}

export default createDbAdapter;
