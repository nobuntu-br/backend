import mongoose, { Mongoose, Schema } from "mongoose";

export default function defineModel(mongooseConnection: Mongoose) {

  if (mongooseConnection.models.operation) {
    return mongooseConnection.models.operation;
  }

  var schema = new mongoose.Schema(
    {
      user: {
        type: Schema.Types.ObjectId, ref: 'user',
        required: true,
      },
      operationType: {
        type: String,
        required: true,
      },
      tenant: {
        type: Schema.Types.ObjectId, ref: 'tenant',
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

  return mongooseConnection.model("operation", schema);
};
