import createDbAdapter, { DbType } from "../adapters/createDb.adapter";
import { IDatabaseAdapter } from "../adapters/IDatabase.adapter";
import { Order } from "../models/order.model";
import BaseRepository from "./base.repository";

export default class OrderRepository extends BaseRepository<Order>{

  constructor(dbType: DbType, model: any){
    const _adapter : IDatabaseAdapter<Order> = createDbAdapter<Order>(dbType, model, Order.fromJson)
    super(_adapter);
  }

}