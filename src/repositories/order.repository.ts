import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { IOrder, Order } from "../models/order.model";
import BaseRepository from "./base.repository";

export default class OrderRepository extends BaseRepository<IOrder, Order>{

  constructor(databaseType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<IOrder, Order> = createDbAdapter<IOrder, Order>(databaseType, databaseConnection.models["Order"], Order.fromJson);
    super(_adapter, databaseConnection);
  }

}