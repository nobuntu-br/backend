import mongoose, { Mongoose, Schema } from "mongoose";

export default function defineModel(mongooseConnection: Mongoose) {

  const schema = new mongoose.Schema(
    {
      user: {
        type: Schema.Types.ObjectId, ref: 'user',
        required: true,
      },
      tenant: {
        type: Schema.Types.ObjectId, ref: 'tenant',
        required: true,
      },
      isAdmin: {
        type: Boolean,
        required: true
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

  return mongooseConnection.model("userTenant", schema);
};