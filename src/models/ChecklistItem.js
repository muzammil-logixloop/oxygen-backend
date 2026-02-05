const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ChecklistItem = sequelize.define('ChecklistItem', {
    itemId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    templateId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ChecklistTemplates',
            key: 'templateId'
        }
    },
    section: DataTypes.STRING,
    title: DataTypes.STRING,
    instruction: DataTypes.TEXT,
    responseType: {
        type: DataTypes.ENUM('PassFailNA'),
        defaultValue: 'PassFailNA'
    },
    criticalFail: DataTypes.BOOLEAN,
    requiresPhotoOnFail: DataTypes.BOOLEAN,
    appliesToModels: DataTypes.STRING,
    order: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
});

module.exports = ChecklistItem;
