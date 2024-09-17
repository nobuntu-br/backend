import mongoose, { Mongoose, Schema } from "mongoose";

export default function defineModel(mongooseConnection: Mongoose) {

  const schema = new mongoose.Schema(
    {
      UserUID: {
        type: Schema.Types.ObjectId, ref: 'user',
        required: false,
      },
      TenantCredentialId: {
        type: Schema.Types.ObjectId, ref: 'tenantCredential',
        required: true,
      },
      TenantId: {
        type: Schema.Types.ObjectId, ref: 'tenant',
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
      ret.id = ret._id.toHexString();
      delete ret._id;
    }
  });

  return mongooseConnection.model("userTenant", schema);
};