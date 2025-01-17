import { createDbAdapter } from "../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../infra/database/IDatabase.adapter";
import { IRoleDataBaseModel, Role } from "../entities/role.model";
import TenantConnection from "../entities/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class RoleRepository extends BaseRepository<IRoleDataBaseModel, Role>{

  constructor(tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IRoleDataBaseModel, Role> = createDbAdapter<IRoleDataBaseModel, Role>(tenantConnection.models!.get("Role"), tenantConnection.databaseType, tenantConnection.connection, Role.fromJson);
    super(_adapter, tenantConnection);
  }

}