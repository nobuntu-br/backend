import { DbType } from "../adapters/createDb.adapter";
import { Role } from "../models/role.model";
import RoleRepository from "../repository/role.repository";
import BaseService from "./base.service";

export default class RoleService extends BaseService<Role> {
  private roleRepository: RoleRepository;

  constructor(dbType: DbType, model: any, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository : RoleRepository = new RoleRepository(dbType, model, databaseConnection);
    super(repository, dbType, model, databaseConnection);

    this.roleRepository = repository;
  }

}