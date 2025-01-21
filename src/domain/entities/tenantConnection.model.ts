import { Connection } from "mongoose";
import { Sequelize } from "sequelize";
import { DatabaseType } from "../../infra/database/createDb.adapter";

export default class TenantConnection {
  private _models: Map<string, any> | null;
  private _connection: Connection | Sequelize;
  databaseType: DatabaseType;
  expireAt: Date;
  isDefaultConnection: boolean;
  tenantId: any;

  constructor(databaseType: DatabaseType, connection: Connection | Sequelize, isDefaultConnection: boolean) {
    this._connection = connection;
    this.databaseType = databaseType;
    this.expireAt = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    this.isDefaultConnection = isDefaultConnection;
    this._models = null;
  }

  get models(): Map<string, any> | null {
    return this._models;
  }

  set models(models: Map<string, any>){
    this._models = models;
  } 

  get connection(): Connection | Sequelize {
    return this._connection;
  }

  set connection(connection: Connection | Sequelize){
    this._connection = connection;
  }
}