import createDbAdapter from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { IRoleDataBaseModel, Role } from "../models/role.model";
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository";


export default class RoleRepository extends BaseRepository<IRoleDataBaseModel, Role>{

  constructor(tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IRoleDataBaseModel, Role> = createDbAdapter<IRoleDataBaseModel, Role>(tenantConnection.models!.get("Role"), tenantConnection.databaseType, tenantConnection.connection, Role.fromJson);
    super(_adapter, tenantConnection);
  }

}