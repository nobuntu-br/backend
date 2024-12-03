import { DatabaseType } from "../adapters/createDb.adapter";
import { IOrder, Order } from "../models/order.model";
import OrderRepository from "../repositories/order.repository";
import BaseService from "./base.service";

export default class OrderSercice extends BaseService<IOrder, Order> {
  private orderRepository: OrderRepository;

  constructor(databaseType: DatabaseType, databaseConnection: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository : OrderRepository = new OrderRepository(databaseType, databaseConnection);
    super(repository, databaseType, databaseConnection);

    this.orderRepository = repository;
  }

}