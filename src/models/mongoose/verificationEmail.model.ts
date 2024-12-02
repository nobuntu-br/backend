import mongoose, { Mongoose, Schema } from "mongoose";

export default function defineModel(mongooseConnection: Mongoose) {

  const schema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: false,
      },
      verificationCode: {
        type: String,
        required: false,
      },
      isVerified: Boolean,
      verifiedDate: {
        type: Date,
        required: false
      },
      expirationDate: {
        type: Date,
        required: true
      }
    },
    { timestamps: true }
  );

  schema.index(
    { email: 1 },
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

  return mongooseConnection.model("VerificationEmail", schema);
};