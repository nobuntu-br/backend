import mongoose, { Connection } from "mongoose";
import { Order } from "../order.model";
import { updateCounter } from "./counter.model";

export default function defineModel(mongooseConnection: Connection) {

  var schema = new mongoose.Schema(
    {
      _id: {
        type: Number,
        required: false
      },
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

  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  });

  schema.pre('save', async function (next) {
    if (!this.isNew) return next();

    this._id = await updateCounter(mongooseConnection, "Order");
    next();
  });

  return mongooseConnection.model<Order>("Order", schema);
};
