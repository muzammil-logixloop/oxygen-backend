const { Customer, Chamber, User, Role, Issue } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// ================= CUSTOMER MANAGEMENT =================
exports.createCustomer = async (req, res) => {
    try {
        const { name, address, contactPerson, contactEmail, contactPhone } = req.body;
        const customer = await Customer.create({ name, address, contactPerson, contactEmail, contactPhone });
        res.status(201).json({ message: 'Customer created', customer });
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, contactPerson, contactEmail, contactPhone } = req.body;

        const customer = await Customer.findByPk(id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        await customer.update({ name, address, contactPerson, contactEmail, contactPhone });
        res.json({ message: 'Customer updated successfully', customer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findByPk(id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        await customer.destroy();
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};

// ================= CHAMBER MANAGEMENT =================
exports.createChamber = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'Oxygens Admin') {
            return res.status(403).json({ message: 'Forbidden: Only Admins can create chambers' });
        }

        const { serialNumber, modelName, customerId, installationDate, warrantyExpiryDate } = req.body;

        const chamber = await Chamber.create({
            serialNumber,
            modelName,
            customerId,
            installationDate,
            warrantyExpiryDate
        });

        res.status(201).json({ message: 'Chamber created', chamber });
    } catch (error) {
        res.status(500).json({ message: 'Error creating chamber', error: error.message });
    }
};

exports.getAllChambers = async (req, res) => {
    try {
        const chambers = await Chamber.findAll({ include: Customer });
        res.json(chambers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chambers', error: error.message });
    }
};

exports.updateChamber = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'Oxygens Admin') {
            return res.status(403).json({ message: 'Forbidden: Only Admins can update chambers' });
        }

        const { id } = req.params;
        const { serialNumber, modelName, customerId, installationDate, warrantyExpiryDate } = req.body;

        const chamber = await Chamber.findByPk(id);
        if (!chamber) return res.status(404).json({ message: 'Chamber not found' });

        await chamber.update({ serialNumber, modelName, customerId, installationDate, warrantyExpiryDate });
        res.json({ message: 'Chamber updated successfully', chamber });
    } catch (error) {
        res.status(500).json({ message: 'Error updating chamber', error: error.message });
    }
};

exports.deleteChamber = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== 'Oxygens Admin') {
            return res.status(403).json({ message: 'Forbidden: Only Admins can delete chambers' });
        }

        const { id } = req.params;
        const chamber = await Chamber.findByPk(id);
        if (!chamber) return res.status(404).json({ message: 'Chamber not found' });

        await chamber.destroy();
        res.json({ message: 'Chamber deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting chamber', error: error.message });
    }
};

// ================= USER MANAGEMENT =================
// exports.getUsers = async (req, res) => {
//     try {
//         const users = await User.findAll({
//             attributes: { exclude: ['password'] },
//             include: [
//                 { model: Role, attributes: ['name'] },
//                 { model: Customer, attributes: ['name'] }
//             ]
//         });
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching users', error: error.message });
//     }
// };

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'customerId', 'last_login_at'], // ✅ include last_login_at
      include: [
        { model: Role, attributes: ['name'] },
        { model: Customer, attributes: ['name'] }
      ]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getEngineers = async (req, res) => {
    try {
        const engineerRole = await Role.findOne({ where: { name: 'Engineer' } });
        if (!engineerRole) return res.status(404).json({ message: 'Engineer role not found' });

        const engineers = await User.findAll({
            where: { roleId: engineerRole.id },
            attributes: { exclude: ['password'] }
        });

        res.json(engineers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching engineers', error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role, customerId } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const roleObj = await Role.findOne({ where: { name: role } });
        if (!roleObj) return res.status(400).json({ message: 'Invalid role' });

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            roleId: roleObj.id,
            customerId: (role === 'Operator' || role === 'Site Manager') ? customerId : null
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role, customerId } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const roleObj = await Role.findOne({ where: { name: role } });
        if (!roleObj) return res.status(400).json({ message: 'Invalid role' });

        let updatedData = {
            username,
            email,
            roleId: roleObj.id,
            customerId: (role === 'Operator' || role === 'Site Manager') ? customerId : null
        };

        if (password && password.trim() !== '') {
            updatedData.password = bcrypt.hashSync(password, 10);
        }

        await user.update(updatedData);
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// ================= ASSIGN USER =================
exports.assignUserToCustomer = async (req, res) => {
    try {
        const { userId, customerId } = req.body;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.customerId = customerId;
        await user.save();
        res.json({ message: "User assigned to customer", user });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning user', error: error.message });
    }
};

// ================= DASHBOARD STATISTICS =================
exports.getDashboardStats = async (req, res) => {
    try {
        const userCount = await User.count();
        const customerCount = await Customer.count();
        const chamberCount = await Chamber.count();

        const suspendedChamberCount = await Chamber.count({ where: { warrantyStatus: 'Suspended' } });

        const openIssuesCount = await Issue.count({ where: { status: { [Op.in]: ['New', 'InProgress', 'WaitingOnCustomer'] } } });
        const closedIssuesCount = await Issue.count({ where: { status: { [Op.in]: ['Resolved', 'Closed'] } } });

        res.json({
            userCount,
            customerCount,
            chamberCount,
            suspendedChamberCount,
            openIssuesCount,
            closedIssuesCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
};
