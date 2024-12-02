import { DatabaseType } from "../adapters/createDb.adapter";
import { Role } from "../models/role.model";
import RoleRepository from "../repositories/role.repository";
import BaseService from "./base.service";

export default class RoleService extends BaseService<Role> {
  private roleRepository: RoleRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository : RoleRepository = new RoleRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

    this.roleRepository = repository;
  }

}