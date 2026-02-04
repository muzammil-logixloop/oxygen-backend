const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chamber = sequelize.define('Chamber', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Must belong to a customer
        references: {
            model: 'Customers',
            key: 'id'
        }
    },
    serialNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    modelName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    installationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    warrantyExpiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    // Status can be used for warranty logic (Active, Expired, Void)
    warrantyStatus: {
        type: DataTypes.ENUM('Active', 'Expired', 'Void', 'Suspended'),
        defaultValue: 'Active'
    }
}, {
    timestamps: true,
});

module.exports = Chamber;
