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
        type: Number, ref: 'user',
        required: false
      },
      userUID: {
        type: Number,
        required: false,
      },
      databaseCredentialId: {
        type: Number, ref: 'databaseCredential',
        required: true,
      },
      tenantId: {
        type: Number, ref: 'tenant',
        required: true,
      },
      isAdmin: {
        type: Boolean,
        required: false
      },
      dbConfig: Object,
    },
    { timestamps: true }
  );

  schema.index(
    { user: 1, tenant: 1 },
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
    this._id = await updateCounter(mongooseConnection, "DatabasePermission");
    next();
  });

  return mongooseConnection.model("DatabasePermission", schema);
};