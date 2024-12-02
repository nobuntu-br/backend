import mongoose, { Mongoose, Schema } from "mongoose";
import { FieldFile } from "../fieldFile.model";

export default function defineModel(mongooseConnection: Mongoose) {

  if (mongooseConnection.models.fieldFile) {
    return mongooseConnection.models.fieldFile;
  }

  var schema = new mongoose.Schema<FieldFile>(
    {
      fieldType: {
        type: String,
        alias: "entityType"
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      files: [{
        type: Schema.Types.ObjectId,
        ref: "File"
      }]
    },
    { timestamps: true }
  );

  schema.set("toObject", {
    transform: (doc, ret, options) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  });

  return mongooseConnection.model<FieldFile>("FieldFile", schema);
};
