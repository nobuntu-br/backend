import { DataTypes, Sequelize } from "sequelize";

export default function defineModel(sequelize: Sequelize){
  const schema = sequelize.define('DatabaseCredential', {
    databaseName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    databaseType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    databaseUsername: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    databasePassword: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    databaseHost: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    databasePort: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    databaseConfig: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['databaseName', 'databaseType', 'databaseUsername', 'databaseHost', 'databasePort'],
        name: 'unique_database_credential',
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
