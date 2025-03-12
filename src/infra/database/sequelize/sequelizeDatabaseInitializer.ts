import { Dialect, Sequelize } from "sequelize";
import { DatabaseInitializer } from "../../../domain/repositories/databaseInitializer";
import { DatabaseType } from "../createDb.adapter";

export class SequelizeDatabaseInitializer implements DatabaseInitializer {
  
  initializeDatabase(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createDatabaseIfNotExists(databaseName: string, databaseUser: string, databasePassword: string, databaseHost: string, databasePort: number, databaseType: DatabaseType): Promise<void> {
    if(databaseType == "mongodb"){
      throw new Error("Invalid database type to create database if not exist.");
    }
    
    try {
      const sequelize = new Sequelize("", databaseUser, databasePassword, {
        host: databaseHost,
        port: databasePort,
        dialect: databaseType as Dialect, // Alterar para outro dialeto, como 'postgres', se necessário
        logging: false, // Desabilitar logs
      });
  
      // Executar consulta para verificar se o banco de dados existe
      const [results] = await sequelize.query(
        `SELECT SCHEMA_NAME 
         FROM INFORMATION_SCHEMA.SCHEMATA 
         WHERE SCHEMA_NAME = '${databaseName}'`
      );
  
      if (Array.isArray(results) && results.length === 0) {
        // Se não existir, criar o banco de dados
        await sequelize.query(`CREATE DATABASE ${databaseName}`);
        console.log(`Database "${databaseName}" created.`);
      } else {
        console.log(`Database "${databaseName}" exist.`);
      }
  
      // Fechar conexão
      await sequelize.close();
    } catch (error) {
      console.error("Error to create Database. Detail:", error);
      throw new Error("Error to connect and create database. Detail: "+ error);
    }
  }

}