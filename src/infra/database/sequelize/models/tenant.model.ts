import { Sequelize, DataTypes } from "sequelize";

export default function defineModel(sequelize: Sequelize) {
  const schema = sequelize.define('Tenant', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerUserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      allowNull: true
    },
  }, {
    timestamps: true,
    indexes: [
      //Regra para não permitir que um usuário tenha vários tenants com mesmo nome
      {
        unique: true,
        fields: ['name', 'ownerUserId'],
      },
    ],
  }
  );

  schema.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());

    values.id = values.id;
    delete values._id;
    delete values.__v;
    return values;
  };

  return schema;
};
