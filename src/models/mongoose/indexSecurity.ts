import { Model, Mongoose } from "mongoose";

import userModel from "./user.model";
import tenantModel from "./tenant.model";
import tenantCredentialModel from "./tenantCredential.model";
import userTenantModel from "./userTenant.model";
//TODO precisará ser gerada as importações

export default async function setModels(mongooseConnection: Mongoose) {

  const user = userModel(mongooseConnection);//Tabela com os usuários que usam os tenants
  const tenant = tenantModel(mongooseConnection);//Tabela com tenants
  const tenantCredential = tenantCredentialModel(mongooseConnection);//Credenciais para acesso a cada tenant
  const userTenant = userTenantModel(mongooseConnection);//Tabela intermediária que informa o acesso de cada usuário para cada tenant usando uma credencial

  const models = {
    user,
    tenant,
    userTenant,
    tenantCredential,
    //Precisará ser gerado aqui os nomes das variáveis de cada model
  }

  return models;
}