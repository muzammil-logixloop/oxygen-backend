const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Checklist = sequelize.define('Checklist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    chamberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Chambers',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('Daily', 'Weekly', 'Monthly'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pass', 'Fail', 'Incomplete'),
        defaultValue: 'Incomplete'
    },
    data: {
        type: DataTypes.JSON, // Stores the QA pairs
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    evidencePath: {
        type: DataTypes.STRING, // Path to image/video if required
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Checklist;
