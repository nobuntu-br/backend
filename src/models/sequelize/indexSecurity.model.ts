import { Sequelize } from "sequelize";

//TODO precisará ser gerada as importações
import userModel from "./user.model";
import tenantModel from "./tenant.model";
import userTenantModel from "./userTenant.model";
import tenantCredentialModel from "./tenantCredential.model";
import verificationEmailModel from "./verificationEmail.model";
/**
 * Define os modelos do banco de dados que serão usados pela parte de controle de acesso aos tenants 
 * @param sequelize Instância da conexão com o banco de dados usando a biblioteca sequelize
 * @returns retorna os modelos do banco de dados para ser usado suas operações
 */
export default async function setModels(sequelize: Sequelize) {

  const user = userModel(sequelize);
  const tenant = tenantModel(sequelize);
  const userTenant = userTenantModel(sequelize);
  const tenantCredential = tenantCredentialModel(sequelize);
  const verificationEmail = verificationEmailModel(sequelize);

  //Relação de muitos pra muitos de User para Tenant
  user.belongsToMany(tenant, { through: userTenant });
  tenant.belongsToMany(user, { through: userTenant });

  await sequelize.sync();

  const models = {
    user,
    tenant,
    userTenant,
    tenantCredential,
    verificationEmail
    //Precisará ser gerado aqui os nomes das variáveis de cada model
  }

  return models;
}