import mongoose, { Mongoose } from "mongoose";
import { Order } from "../order.model";

export default function defineModel(mongooseConnection: Mongoose) {

  // Verifica se o modelo já foi criado para a conexão específica (Toda vez que é feito a conexão nova ao banco de dados, é preciso setar os models, porém só pode fazer isso uma vez por conexão, se fizer mais de uma vez dá erro. Por isso é verificado se dentro dos models da conexão existe o model)
  if (mongooseConnection.models.order) {
    return mongooseConnection.models.order;
  }

  var schema = new mongoose.Schema<Order>(
    {
      employee: String,
      customer: String,
      orderDate: String, // ISO string para data
      shippedDate: String, // ISO string para data
      shipper: String,
      shipName: String,
      shipAddress: String,
      shipCity: String,
      shipStateProvince: String,
      shipZipPostalCode: String,
      shipCountryRegion: String,
      shippingFee: Number,
      taxes: Number,
      paymentType: String,
      paidDate: String, // ISO string para data
      notes: String, // Campo opcional
      taxRate: Number,
      taxStatus: String,
      status: String,
      orderDetails: String,
      createdAt: String, // ISO string

    },
    { timestamps: true }
  );

  schema.set('toJSON', {
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  });

  return mongooseConnection.model<Order>("Order", schema);
};
