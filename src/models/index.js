const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Profile = require('./Profile');
// New Models
const Customer = require('./Customer');
const Chamber = require('./Chamber');
const Checklist = require('./Checklist');
const Issue = require('./Issue');
const ChecklistTemplate = require('./ChecklistTemplate');
const ChecklistItem = require('./ChecklistItem');
const ChecklistSubmission = require('./ChecklistSubmission');
const ChecklistResponse = require('./ChecklistResponse');

// --- Associations ---

// Role <-> User
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// User <-> Profile
User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId' });

// Customer <-> User (One Customer has many Users/Operators)
Customer.hasMany(User, { foreignKey: 'customerId' });
User.belongsTo(Customer, { foreignKey: 'customerId' });

// Customer <-> Chamber (One Customer has many Chambers)
Customer.hasMany(Chamber, { foreignKey: 'customerId' });
Chamber.belongsTo(Customer, { foreignKey: 'customerId' });

// Chamber <-> Checklist
Chamber.hasMany(Checklist, { foreignKey: 'chamberId' });
Checklist.belongsTo(Chamber, { foreignKey: 'chamberId' });


ChecklistTemplate.hasMany(ChecklistItem, { foreignKey: 'templateId' });
ChecklistItem.belongsTo(ChecklistTemplate, { foreignKey: 'templateId' });

ChecklistSubmission.hasMany(ChecklistResponse, { foreignKey: 'submissionId' });
ChecklistResponse.belongsTo(ChecklistSubmission, { foreignKey: 'submissionId' });

// User <-> Checklist (Who performed it)
User.hasMany(Checklist, { foreignKey: 'userId' });
Checklist.belongsTo(User, { foreignKey: 'userId' });


// Chamber <-> Issue
Chamber.hasMany(Issue, { foreignKey: 'chamberId' });
Issue.belongsTo(Chamber, { foreignKey: 'chamberId' });

// User <-> Issue (Reported By)
User.hasMany(Issue, { foreignKey: 'reportedById', as: 'reportedIssues' });
Issue.belongsTo(User, { foreignKey: 'reportedById', as: 'reporter' });

// User <-> Issue (Assigned To)
User.hasMany(Issue, { foreignKey: 'assignedToId', as: 'assignedIssues' });
Issue.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignee' });


const ROLES = ['Operator', 'Site Manager', 'Oxygens Admin', 'Engineer'];

async function initDB() {
    try {
        // Determine if we need to sync. 
        // WARN: using { alter: true } matches existing columns but isn't perfect for production.
        await sequelize.sync({ alter: true });

        // Seed Roles
        for (const roleName of ROLES) {
            await Role.findOrCreate({
                where: { name: roleName },
                defaults: { name: roleName }
            });
        }
        console.log('Database synced and Roles seeded.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

module.exports = {
    sequelize,
    User,
    Role,
    Profile,
    Customer,
    Chamber,
    Checklist,
    Issue,
    initDB,
    ChecklistTemplate,
    ChecklistItem,
    ChecklistSubmission,
    ChecklistResponse
};
