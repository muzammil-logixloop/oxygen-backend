const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ChecklistResponse = sequelize.define('ChecklistResponse', {
    responseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    submissionId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ChecklistSubmissions',
            key: 'submissionId'
        }
    },

    itemId: DataTypes.STRING,

    result: {
        type: DataTypes.ENUM('Pass','Fail','NA')
    },

    notes: DataTypes.TEXT,

    attachment: DataTypes.STRING

}, {
    timestamps: true
});

module.exports = ChecklistResponse;
