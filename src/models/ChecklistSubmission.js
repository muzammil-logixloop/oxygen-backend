const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ChecklistSubmission = sequelize.define('ChecklistSubmission', {
    submissionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: DataTypes.INTEGER,
    chamberId: DataTypes.INTEGER,
    memberId: DataTypes.INTEGER,

    userName: DataTypes.STRING,

    checkType: {
        type: DataTypes.ENUM('Daily','Weekly','Monthly')
    },

    templateVersion: DataTypes.INTEGER,

    overallResult: {
        type: DataTypes.ENUM('Pass','Fail','Conditional'),
        defaultValue: 'Pass'
    },

    declarationAccepted: DataTypes.BOOLEAN,
    signatureName: DataTypes.STRING,

    notesGeneral: DataTypes.TEXT,

    photoUploads: {
        type: DataTypes.JSON,
        defaultValue: []
    },

    videoUpload: DataTypes.STRING,

    computedFlags: DataTypes.JSON

}, {
    timestamps: true,
    createdAt: 'submittedAt'
});

module.exports = ChecklistSubmission;
