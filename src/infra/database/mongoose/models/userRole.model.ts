import mongoose, { Connection, Schema } from "mongoose";
import { updateCounter } from "./counter.model";

export default function defineModel(mongooseConnection: Connection) {

  const schema = new mongoose.Schema(
    {
      _id: {
        type: Number,
        required: false
      },
      userId: {
        type: Number, ref: 'User',
        required: true,
      },
      roleId: {
        type: Number, ref: 'Role',
        required: true,
      },
      dbConfig: Object,
    },
    { timestamps: true }
  );

  schema.index(
    { UserId: 1, RoleId: 1 },
    { unique: true }
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
  
    this._id = await updateCounter(mongooseConnection, "UserRole");
    next();
  });

  return mongooseConnection.model("UserRole", schema);
};