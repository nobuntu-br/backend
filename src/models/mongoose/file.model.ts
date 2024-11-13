import mongoose, { Mongoose, Schema } from "mongoose";
import { File } from "../file.model";

export default function defineModel(mongooseConnection: Mongoose) { 

  if (mongooseConnection.models.file) { 
    return mongooseConnection.models.file; 
  } 

  var schema = new mongoose.Schema<File>( 
    {
        name: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        extension: {
            type: String,
            required: true
        },
        dataBlob: {
            type: Buffer,
            required: true
        }
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

  return mongooseConnection.model<File>("estrutura_orcamento", schema); 
};
