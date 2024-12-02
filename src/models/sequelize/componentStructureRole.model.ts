import { DataTypes, Sequelize } from "sequelize";

export default function defineModel(sequelize: Sequelize) {
  const schema = sequelize.define('ComponentStructureRole', {
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
    componentStructureId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ComponentStructures',
        key: 'id',
      },
    },
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['roleId', 'componentStructureId'],
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
