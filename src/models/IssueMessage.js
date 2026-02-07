const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IssueMessage = sequelize.define('IssueMessage', {
    messageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    issueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Issues',
            key: 'issueId'
        }
    },

    memberId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    senderName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    senderRole: {
        type: DataTypes.STRING,
        allowNull: false
    },

    messageText: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    uploads: {
        type: DataTypes.JSON,
        allowNull: true
    },

    isInternalNote: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    timestamps: true
});

module.exports = IssueMessage;
