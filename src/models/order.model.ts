import { BaseResourceModel } from "./base-resource.model";

interface IOrder {
  employee?: string;
  customer?: string;
  orderDate?: string; // ISO string para data
  shippedDate?: string; // ISO string para data
  shipper?: string;
  shipName?: string;
  shipAddress?: string;
  shipCity?: string;
  shipStateProvince?: string;
  shipZipPostalCode?: string;
  shipCountryRegion?: string;
  shippingFee?: number;
  taxes?: number;
  paymentType?: string;
  paidDate?: string; // ISO string para data
  notes?: string; // Campo opcional
  taxRate?: number;
  taxStatus?: string;
  status?: string;
  orderDetails?: string;
  createdAt?: string; // ISO string para data
}

export class Order extends BaseResourceModel implements IOrder {
  employee?: string;
  customer?: string;
  orderDate?: string;
  shippedDate?: string;
  shipper?: string;
  shipName?: string;
  shipAddress?: string;
  shipCity?: string;
  shipStateProvince?: string;
  shipZipPostalCode?: string;
  shipCountryRegion?: string;
  shippingFee?: number;
  taxes?: number;
  paymentType?: string;
  paidDate?: string;
  notes?: string | undefined;
  taxRate?: number;
  taxStatus?: string;
  status?: string;
  orderDetails?: string;
  createdAt?: string;
 
  static fromJson(jsonData?: any): Order {
    return Object.assign(new Order(), jsonData);
  }
}