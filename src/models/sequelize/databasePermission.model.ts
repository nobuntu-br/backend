import { DataTypes, Sequelize } from "sequelize";

export default function defineModel(sequelize: Sequelize){
  const schema = sequelize.define('DatabasePermission', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    tenantId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tenants',
        key: 'id',
      },
    },
    userUID: {
      type: DataTypes.STRING,
      references: {
        model: 'Users',
        key: 'UID',
      },
    },
    databaseCredentialId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'DatabaseCredentials',
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
        fields: ['userId', 'tenantId'],
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