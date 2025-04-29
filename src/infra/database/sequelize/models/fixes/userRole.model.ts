import { DataTypes, Sequelize } from "sequelize";

export default function defineModel(sequelize: Sequelize) {
  const schema = sequelize.define('UserRole', {
    //Columns
    userId: {
      type: DataTypes.STRING,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'roleId'],
      },
    ],
  });

  schema.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());

    values.id = values.id;
    delete values._id;
    delete values.__v;
    return values;
  };

  return schema;
};