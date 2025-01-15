import { Sequelize } from "sequelize";
import TenantConnection from "../models/tenantConnection.model";
import { Connection } from "mongoose";

export async function createDatabase(tenantConnection: TenantConnection, databaseName: string){
  try {
    if (tenantConnection.databaseType === 'mongodb') {
      await createDatabaseMongooseImplementation(tenantConnection.connection as Connection, databaseName);
    } else {
      await createDatabaseSequelizeImplementation(tenantConnection.connection as Sequelize, databaseName);
    }
  } catch (error) {
    throw error;
  }
  
}

export async function createDatabaseSequelizeImplementation(_databaseConnection: Sequelize, databaseName: string){
  try {
    await _databaseConnection.query(`CREATE DATABASE ${databaseName};`);
  } catch (error) {
    throw new Error("Error to create database using sequelize. Detail: "+ error);
  }
}

export async function createDatabaseMongooseImplementation(_databaseConnection: Connection, databaseName: string){
  throw new Error("Method not implemented.");
}