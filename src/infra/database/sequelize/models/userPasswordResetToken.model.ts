import { BOOLEAN, DataTypes, Sequelize } from "sequelize";

export default function defineModel(sequelize: Sequelize) {
  const schema = sequelize.define('userPasswordResetToken', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
    },
    used: BOOLEAN,
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    timestamps: true,
  });

  schema.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());

    values.id = values.id;
    delete values._id;
    delete values.__v;
    return values;
  };

  return schema;
}
