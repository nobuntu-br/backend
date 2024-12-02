import mongoose, { Mongoose, Schema } from "mongoose";

export default function defineModel(mongooseConnection: Mongoose){
  // Verifica se o modelo já foi criado para a conexão específica (Toda vez que é feito a conexão nova ao banco de dados, é preciso setar os models, porém só pode fazer isso uma vez por conexão, se fizer mais de uma vez dá erro. Por isso é verificado se dentro dos models da conexão existe o model)
  if (mongooseConnection.models.user) {
    return mongooseConnection.models.user;
  }

  var schema = new mongoose.Schema({
    UID: {
      type: String,
      required: true,
      unique: true
    },
    tenantUID: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    isAdministrator: {
      type: Boolean,
      required: true
    },
    memberType: String,
    email: {
      type: String,
      required: true
    },
  },
    { timestamps: true });

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

  return mongooseConnection.model("User", schema);
};