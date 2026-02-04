const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imageFilename: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imagePath: {
        type: DataTypes.STRING, // Relative path useful for serving
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Profile;
