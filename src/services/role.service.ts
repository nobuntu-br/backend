import { DbType } from "../adapters/createDb.adapter";
import { Role } from "../models/role.model";
import RoleRepository from "../repository/role.repository";
import BaseService from "./base.service";

export default class RoleService extends BaseService<Role> {
  private roleRepository: RoleRepository;

  constructor(dbType: DbType, model: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository : RoleRepository = new RoleRepository(dbType, model);
    super(repository, dbType, model);

    this.roleRepository = repository;
  }

}