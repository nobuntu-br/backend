import { Model, Mongoose } from "mongoose";

import userModel from "./user.model";
import tenantModel from "./tenant.model";
import databaseCredentialModel from "./databaseCredential.model";
import databasePermissionModel from "./databasePermission.model";
import verificationEmailModel from "./verificationEmail.model";

export default async function setModels(mongooseConnection: Mongoose) {

  const user = userModel(mongooseConnection);//Tabela com os usuários que usam os tenants
  const tenant = tenantModel(mongooseConnection);//Tabela com tenants
  const databaseCredential = databaseCredentialModel(mongooseConnection);
  const databasePermission = databasePermissionModel(mongooseConnection);//Tabela intermediária que informa o acesso de cada usuário para cada tenant usando uma credencial
  const verificationEmail = verificationEmailModel(mongooseConnection);

  const models = new Map<string, any>();
  
  models.set('User', user);
  models.set('Tenant', tenant);
  models.set('DatabasePermission', databasePermission);
  models.set('DatabaseCredential', databaseCredential);
  models.set('VerificationEmail', verificationEmail);

  //Precisará ser gerado aqui os nomes das variáveis de cada model

  // const models = {
  //   user,
  //   tenant,
  //   databasePermission,
  //   databaseCredential,
  //   verificationEmail,
  //   //Precisará ser gerado aqui os nomes das variáveis de cada model
  // }

  return models;
}