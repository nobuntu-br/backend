import mongoose, { Mongoose, Schema } from "mongoose";

export default function defineModel(mongooseConnection: Mongoose) {

  const schema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      host: {
        type: String,
        required: true
      },
      port: {
        type: String,
        required: false
      },
      srvEnabled: {
        type: Boolean,
        required: true
      },
      options: {
        type: String,
        required: false
      },
      storagePath: {
        type: String,
        required: false
      },
      sslEnabled: {
        type: Boolean,
        required: true
      },
      poolSize: {
        type: Number,
        required: true,
      },
      timeOutTime: {
        type: Number,
        required: true,
      },

      //SSL data
      sslCertificateAuthority: {
        type: String,
        required: false
      },
      sslPrivateKey: {
        type: String,
        required: false
      },
      sslCertificate: {
        type: String,
        required: false
      },

    },
    { timestamps: true }
  );

  schema.index(
    { name: 1, type: 1, username: 1, host: 1, port: 1 },
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