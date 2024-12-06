import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { IOrder, Order } from "../models/order.model";
import TenantConnection from "../models/tenantConnection.model";
import BaseRepository from "./base.repository";

export default class OrderRepository extends BaseRepository<IOrder, Order>{

  constructor(databaseType: DatabaseType, tenantConnection: TenantConnection){
    const _adapter : IDatabaseAdapter<IOrder, Order> = createDbAdapter<IOrder, Order>(tenantConnection.models!.get("Order"), databaseType, tenantConnection.connection, Order.fromJson);
    super(_adapter, tenantConnection);
  }

}