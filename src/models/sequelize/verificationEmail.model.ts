import { BOOLEAN, DataTypes, Sequelize } from "sequelize";

export default function defineModel(sequelize: Sequelize) {
  const schema = sequelize.define('VerificationEmail', {
    email: {
      type: DataTypes.STRING,
    },
    verificationCode: {
      type: DataTypes.STRING,
    },
    isVerified: BOOLEAN,
    verifiedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
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
}
