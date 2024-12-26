import { IOrder, Order } from "../models/order.model";
import TenantConnection from "../models/tenantConnection.model";
import OrderRepository from "../repositories/order.repository";
import BaseService from "./base.service";

export default class OrderSercice extends BaseService<IOrder, Order> {
  private orderRepository: OrderRepository;

  constructor(tenantConnection: TenantConnection) {
    //Cria o repositório com dados para obter o banco de dados
    let repository: OrderRepository = new OrderRepository(tenantConnection);
    super(repository, tenantConnection);

    this.orderRepository = repository;

  }

}