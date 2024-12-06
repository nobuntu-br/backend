import { Connection, Model, Mongoose } from "mongoose";
import userModel from "./user.model";
import tenantModel from "./tenant.model";
import databaseCredentialModel from "./databaseCredential.model";
import databasePermissionModel from "./databasePermission.model";
import verificationEmailModel from "./verificationEmail.model";
import counterModel from "./counter.model";
import TenantConnection from "../tenantConnection.model";

export default async function setModels(tenantConnection: TenantConnection) {
  const mongooseConnection = tenantConnection.connection;


  if(mongooseConnection instanceof Connection == false){
    throw new Error("Instance of database connection is incompatible with setModels function on mongoose.");
  }

  const user = userModel(mongooseConnection);//Tabela com os usuários que usam os tenants
  const tenant = tenantModel(mongooseConnection);//Tabela com tenants
  const databaseCredential = databaseCredentialModel(mongooseConnection);
  const databasePermission = databasePermissionModel(mongooseConnection);//Tabela intermediária que informa o acesso de cada usuário para cada tenant usando uma credencial
  const verificationEmail = verificationEmailModel(mongooseConnection);
  const counter = counterModel(mongooseConnection);

  const models = new Map<string, any>();
  
  models.set('User', user);
  models.set('Tenant', tenant);
  models.set('DatabasePermission', databasePermission);
  models.set('DatabaseCredential', databaseCredential);
  models.set('VerificationEmail', verificationEmail);
  models.set('Counter', counter);

  return models;
}