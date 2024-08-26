import { Connection } from "mongoose";
import { Sequelize } from "sequelize";
import { DbType } from "../adapters/createDb.adapter";

export default class TenantConnection {
  models: any;
  _connection: Connection | Sequelize;
  databaseType: DbType;
  expireAt: Date;
  isDefaultConnection: boolean;
  tenantId: any;

  constructor(databaseType: DbType, connection: Connection | Sequelize, isDefaultConnection: boolean) {
    this._connection = connection;
    this.databaseType = databaseType;
    this.expireAt = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    this.isDefaultConnection = isDefaultConnection;
    this.models = {};
  }

  setModels(models: any): void {
    this.models = models;
  }

  getModels(): any {
    return this.models;
  }

  get connection(): Connection | Sequelize {
    return this._connection;
  }

  set connection(connection: Connection | Sequelize){
    this._connection = connection;
  }
}