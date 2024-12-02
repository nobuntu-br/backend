import mongoose, { Mongoose, Schema } from "mongoose";

export default function defineModel(mongooseConnection: Mongoose) {

  const schema = new mongoose.Schema(
    {
      databaseName: {
        type: String,
        required: true
      },
      databaseType: {
        type: String,
        required: true,
      },
      databaseUsername: {
        type: String,
        required: true
      },
      databasePassword: {
        type: String,
        required: true
      },
      databaseHost: {
        type: String,
        required: true
      },
      databasePort: {
        type: String,
        required: false
      },
      databaseConfig: Object,
    },
    { timestamps: true }
  );

  schema.index(
    { databaseName: 1, databaseType: 1, databaseUsername: 1, databaseHost: 1, databasePort: 1 },
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
      ret.id = ret._id.toHexString();
      delete ret._id;
    }
  });

  return mongooseConnection.model('DatabaseCredential', schema);
};