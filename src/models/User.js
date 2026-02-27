const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Roles",
        key: "id",
      },
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Only for Operators/Site Managers
      references: {
        model: "Customers",
        key: "id",
      },
    },

    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = User;
