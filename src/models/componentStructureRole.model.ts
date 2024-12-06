import { BaseResourceModel } from "./baseResource.model";
import { ComponentStructure } from "./componentStructure.model";
import { Role } from "./role.model";

//I<NomeDaClasse>DatabaseModel
export interface IComponentStructureRoleDatabaseModel {
  roleId?: number;
  componentStructureId?: number;
}

export interface IComponentStructureRole {
  role?: Role;
  componentStructure?: ComponentStructure;
}

export class ComponentStructureRole extends BaseResourceModel implements IComponentStructureRole {
  role?: Role;
  componentStructure?: ComponentStructure;

  static fromJson(jsonData: any) : ComponentStructureRole {
    return Object.assign(new ComponentStructureRole(), jsonData);
  }
}

//tem que ter 1 interface para pesquisa que tenha o mesmo nome das colunas

//Tem que ter 1 classe que é a entidade real com as regras de negócio
  //No futuro dentro das entidades terão as regras complexas que deverão ser realizadas na classe. Se for entre classes é no UseCase
//Tem que ter 1 interface da entidade