const { Customer, Chamber, User, Role } = require('../models');

// --- Customer Management ---

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

// --- Chamber Management ---

exports.createChamber = async (req, res) => {
    try {
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
        // Admin sees all. 
        // If we wanted to filter by customer, we'd do it here or in a separate scoped controller.
        const chambers = await Chamber.findAll({ include: Customer });
        res.json(chambers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chambers', error: error.message });
    }
};

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
}
// --- User Management ---

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
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

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role, customerId } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const roleObj = await Role.findOne({ where: { name: role } });
        if (!roleObj) return res.status(400).json({ message: 'Invalid role' });

        const hashedPassword = require('bcryptjs').hashSync(password, 10);

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

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
