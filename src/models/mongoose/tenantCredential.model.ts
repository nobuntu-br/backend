import mongoose, { Mongoose, Schema } from "mongoose";

export default function defineModel(mongooseConnection: Mongoose) {

  const schema = new mongoose.Schema(
    {
      dbName: {
        type: String,
        required: true
      },
      dbType: {
        type: String,
        required: true,
      },
      dbUsername: {
        type: String,
        required: true
      },
      dbPassword: {
        type: String,
        required: true
      },
      dbHost: {
        type: String,
        required: true
      },
      dbPort: {
        type: String,
        required: true
      },
      dbConfig: Object,
    },
    { timestamps: true }
  );

  schema.index(
    { dbName: 1, dbType: 1, dbUsername: 1, dbHost: 1, dbPort: 1 },
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

  return mongooseConnection.model('tenantCredential', schema);
};