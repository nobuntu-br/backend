import mongoose, { Connection } from "mongoose";
import { updateCounter } from "./counter.model";

export default function defineModel(mongooseConnection: Connection) {

  var schema = new mongoose.Schema({
    _id: {
      type: Number,
      required: false
    },
    UID: {
      type: String,
      required: true,
      unique: true
    },
    tenantUID: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    isAdministrator: {
      type: Boolean,
      required: true
    },
    memberType: String,
    email: {
      type: String,
      required: true
    },
  },
    { timestamps: true });

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
  
    this._id = await updateCounter(mongooseConnection, "User");
    next();
  });

  return mongooseConnection.model("User", schema);
};