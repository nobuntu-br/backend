import { createDbAdapter } from "../../../infra/database/createDb.adapter";
import { IDatabaseAdapter } from "../../../infra/database/IDatabase.adapter";
import { IMenuItemDatabaseModel, MenuItem } from "../../entities/fixes/menuItem.model";
import TenantConnection from "../../entities/fixes/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class MenuItemRepository extends BaseRepository<IMenuItemDatabaseModel, MenuItem>{ 

  constructor(tenantConnection: TenantConnection){ 
    const _adapter : IDatabaseAdapter<IMenuItemDatabaseModel, MenuItem> = createDbAdapter<IMenuItemDatabaseModel, MenuItem>(tenantConnection.models!.get("MenuItem"), tenantConnection.databaseType, tenantConnection.connection, MenuItem.fromJson);
    super(_adapter, tenantConnection); 
  } 

  async get(): Promise<MenuItem[]>{
    return await this.findMany({});
  }

}