import { DbType } from "../adapters/createDb.adapter";
import { Order } from "../models/order.model";
import OrderRepository from "../repository/order.repository";
import BaseService from "./base.service";

export default class OrderSercice extends BaseService<Order> {
  private orderRepository: OrderRepository;

  constructor(dbType: DbType, model: any) {
    //Cria o repositório com dados para obter o banco de dados
    var repository : OrderRepository = new OrderRepository(dbType, model);
    super(repository, dbType, model);

    this.orderRepository = repository;
  }

}