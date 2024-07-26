var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      UID: {
        type: String,
        required: true,
        unique: true
      },
      TenantUID: String,
      username: String,
      firstName: String,
      lastName: String,
      isAdministrator: Boolean,
      memberType: String,
        Roles: 
        [
          {
            type: Schema.Types.ObjectId,
            ref: 'roles',
            default: [] // Define um array vazio como valor padrão
          }
        ], 
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Users = mongoose.model("user", schema);
  return Users;
};
