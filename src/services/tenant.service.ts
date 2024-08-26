import { DbType } from "../adapters/createDb.adapter";
import { Tenant } from "../models/tenant.model";
import TenantRepository from "../repository/tenant.repository";
import BaseService from "./base.service";

export default class TenantService extends BaseService<Tenant> {
  private tenantRepository: TenantRepository;

  constructor(dbType: DbType, model: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository : TenantRepository = new TenantRepository(dbType, model);
    super(repository, dbType, model);

    this.tenantRepository = repository;
  }

  

}