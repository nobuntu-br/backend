import { DataTypes, Sequelize } from "sequelize";

export default function defineModel(sequelize: Sequelize) {
  return sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};