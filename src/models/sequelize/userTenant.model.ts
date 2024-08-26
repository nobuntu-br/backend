import { DataTypes, Sequelize } from "sequelize";

export default function defineModel(sequelize: Sequelize){
  const schema = sequelize.define('UserTenant', {
    UserUID: {
      type: DataTypes.STRING,
      references: {
        model: 'Users',
        key: 'UID',
      },
      primaryKey: true,
    },
    TenantCredentialId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TenantCredentials',
        key: 'id',
      },
      primaryKey: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['UserId', 'TenantId'],
      },
    ],
  });

  schema.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());

    values.id = values.id;
    delete values._id;
    delete values.__v;
    return values;
  };

  return schema;
};