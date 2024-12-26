import { NotFoundError } from "../errors/notFound.error";
import TenantConnection from "../models/tenantConnection.model";
import { IUser, User } from "../models/user.model";
import UserRepository from "../repositories/user.repository";
import BaseService from "./base.service";

export class UserService extends BaseService<IUser, User> {
  private userRepository: UserRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: UserRepository = new UserRepository(tenantConnection);
    super(repository, tenantConnection);

    this.userRepository = repository;

  }
  
  async isUserAdmin(userUID: string): Promise<boolean> {
    return this.userRepository.isUserAdmin(userUID);
  }

  async IfApplicationHasRegisteredUsers() {
    return this.userRepository.IfApplicationHasRegisteredUsers();
  }

}