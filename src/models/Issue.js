const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Issue = sequelize.define('Issue', {
    issueId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    chamberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Chambers',
            key: 'id'
        }
    },

    createdByMemberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

    createdByName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    category: {
        type: DataTypes.ENUM(
            'Leak',
            'Zip',
            'Door',
            'Window',
            'Valves',
            'Gauge',
            'Electrical',
            'Noise',
            'Other'
        ),
        allowNull: false,
        defaultValue: 'Other'
    },

    severity: {
        type: DataTypes.ENUM(
            'Info',
            'Minor',
            'Urgent',
            'SafetyCritical'
        ),
        defaultValue: 'Minor'
    },

    status: {
        type: DataTypes.ENUM(
            'New',
            'InProgress',
            'WaitingOnCustomer',
            'Resolved',
            'Closed'
        ),
        defaultValue: 'New'
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    uploads: {
        type: DataTypes.JSON,
        allowNull: true
    },

    doNotOperateRecommended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    assignedEngineer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

    resolutionSummary: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    closedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    timestamps: true
});

module.exports = Issue;
