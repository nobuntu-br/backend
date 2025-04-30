import { Sequelize, DataTypes } from "sequelize";

export default function defineModel(sequelize: Sequelize) {
  const schema = sequelize.define('NfFile', {
    name: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    extension: {
      type: DataTypes.STRING,
    },
    dataBlob: {
      type: DataTypes.BLOB,
    },
    base64: {
      type: DataTypes.TEXT,
    },
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
