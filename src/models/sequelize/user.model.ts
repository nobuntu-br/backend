import { DataTypes, Sequelize } from "sequelize";

export default function defineModel(sequelize: Sequelize){
  const schema = sequelize.define('User', {
    UID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    TenantUID: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    isAdministrator: {
      type: DataTypes.BOOLEAN,
    },
    memberType: {
      type: DataTypes.STRING,
    },
    //TODO fazer relaçào com a tabela ROLES e Tenant
  }, {
    timestamps: true,
  });

  schema.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());

    values.id = values.id;
    delete values._id;
    delete values.__v;
    return values;
  };

  return schema;
}
