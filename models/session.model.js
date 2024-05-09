var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      userUID: String,
      user: { type: Schema.Types.ObjectId, ref: 'user' },
      tenantUID: String,
      accessToken: String,
      initialDate: Date,
      finishSessionDate: Date,
      stayConnected: Boolean,
      accessTokenExpirationDate : Date,
      hashValidationLogin: String,
      hashValidationLogout: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Session = mongoose.model("session", schema);
  return Session;
};