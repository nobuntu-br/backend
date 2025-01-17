import { DatabaseInitializer } from "../../../domain/repositories/databaseInitializer";
import { DatabaseType } from "../createDb.adapter";

export class MongooseDatabaseInitializer implements DatabaseInitializer {
  
  initializeDatabase(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createDatabaseIfNotExists(databaseName: string, databaseUser: string, databasePassword: string, databaseHost: string, databasePort: number, databaseType: DatabaseType): Promise<void> {
    throw new Error("Method not implemented")
  }

}