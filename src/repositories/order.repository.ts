import createDbAdapter, { DatabaseType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { Order } from "../models/order.model";
import BaseRepository from "./base.repository";

export default class OrderRepository extends BaseRepository<Order>{

  constructor(databaseType: DatabaseType, databaseConnection: any){
    const _adapter : IDatabaseAdapter<Order> = createDbAdapter<Order>(databaseType, databaseConnection.models["Order"], Order.fromJson);
    super(_adapter, databaseConnection);
  }

}