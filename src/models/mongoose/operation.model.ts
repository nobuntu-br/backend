import mongoose, { Mongoose, Schema } from "mongoose";

export default function defineModel(mongooseConnection: Mongoose) {

  if (mongooseConnection.models.operation) {
    return mongooseConnection.models.operation;
  }

  var schema = new mongoose.Schema(
    {
      user: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true,
      },
      operationType: {
        type: String,
        required: true,
      },
      tenant: {
        type: Schema.Types.ObjectId, ref: 'Tenant',
        required: true,
      },
      ipAddress: {
        type: String,
        required: true,
      },
      geoLocation: {
        type: String
      },
      details: Object
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
      ret.id = ret._id.toHexString();
      delete ret._id;
    }
  });

  return mongooseConnection.model("Operation", schema);
};
