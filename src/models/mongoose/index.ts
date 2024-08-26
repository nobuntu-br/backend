import { Mongoose } from "mongoose";

//TODO precisará ser gerada as importações
import userModel from "./user.model";
import roleModel from "./role.model";
import orderModel from "./order.model";
import functionSystemModel from "./functionSystem.model";
import functionSystemRoleModel from "./functionSystemRole.model";
import userRoleModel from "./userRole.model";
import componentStructureModel from "./componentStructure.model";
import componentStructureRoleModel from "./componentStructureRole.model";

/**
 * Define os modelos que serão usados pelos usuários da aplicação
 * @param mongooseConnection Instância da conexão com o banco de dados mongodb
 * @returns retorna os modelos do banco de dados para ser usado suas operações
 */
export default async function setModels(mongooseConnection: Mongoose) {

  const order = orderModel(mongooseConnection);
  const user = userModel(mongooseConnection);
  const role = roleModel(mongooseConnection);
  const userRole = userRoleModel(mongooseConnection);
  const functionSystem = functionSystemModel(mongooseConnection);
  const functionSystemRole = functionSystemRoleModel(mongooseConnection);
  const componentStructure = componentStructureModel(mongooseConnection);
  const componentStructureRole = componentStructureRoleModel(mongooseConnection);
  //TODO precisará ser gerado várias linhas como essa abaixo, com o model diferente

  const models = {
    order,
    user,
    role,
    userRole,
    functionSystem,
    functionSystemRole,
    componentStructure,
    componentStructureRole
    //Precisará ser gerado aqui os nomes das variáveis de cada model
  }

  return models;
}