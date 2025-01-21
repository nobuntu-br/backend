import mongoose, { Connection, Schema } from "mongoose";
import { updateCounter } from "./counter.model";

export default function defineModel(mongooseConnection: Connection) {

  var schema = new mongoose.Schema(
    {
      _id: {
        type: Number,
        required: false
      },
      fieldType: {
        type: String,
        alias: "entityType"
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      files: [{
        type: Number,
        ref: "File"
      }]
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
      ret.id = ret._id;
      delete ret._id;
    }
  });

  schema.pre('save', async function (next) {
    if (!this.isNew) return next();
  
    this._id = await updateCounter(mongooseConnection, "FieldFile");
    next();
  });

  return mongooseConnection.model("FieldFile", schema);
};
