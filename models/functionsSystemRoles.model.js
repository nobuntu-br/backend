var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
        Roles: {type: Schema.Types.ObjectId, ref: 'Roles'}, 
        FunctionSystem: {type: Schema.Types.ObjectId, ref: 'FunctionSystem'}, 
      authorized: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const FunctionsSystemRoles = mongoose.model("functionsSystemRoles", schema);
  return FunctionsSystemRoles;
};
