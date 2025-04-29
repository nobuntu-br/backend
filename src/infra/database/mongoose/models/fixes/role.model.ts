import mongoose, { Connection } from "mongoose";
import { updateCounter } from "./counter.model";

export default function defineModel(mongooseConnection: Connection) {

  var schema = new mongoose.Schema(
    {
      _id: {
        type: Number,
        required: false
      },
      name: String,
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
  
    this._id = await updateCounter(mongooseConnection, "Role");
    next();
  });

  return mongooseConnection.model("Role", schema);
};
