const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChecklistTemplate = sequelize.define('ChecklistTemplate', {
    templateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('Daily', 'Weekly', 'Monthly'),
        allowNull: false
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    appliesToModels: {
        type: DataTypes.JSON,   // ["Winslet","SoftShell","All"]
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = ChecklistTemplate;
