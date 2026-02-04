const { Chamber, Customer } = require('../models');

exports.getMyChambers = async (req, res) => {
    try {
        const { role, customerId } = req.user;

        let whereClause = {};

        // If Admin/Engineer, they might see all (or filtered). 
        // If Operator/Site Manager, MUST be restricted to their customer.
        if (role === 'Operator' || role === 'Site Manager') {
            if (!customerId) {
                return res.status(403).json({ message: 'No customer assigned to your account.' });
            }
            whereClause.customerId = customerId;
        }

        const chambers = await Chamber.findAll({
            where: whereClause,
            include: {
                model: Customer,
                attributes: ['name']
            }
        });

        res.json(chambers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chambers', error: error.message });
    }
};

exports.getChamberDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, customerId } = req.user;

        const chamber = await Chamber.findByPk(id, { include: Customer });

        if (!chamber) {
            return res.status(404).json({ message: 'Chamber not found' });
        }

        // Authorization check
        if ((role === 'Operator' || role === 'Site Manager') && chamber.customerId !== customerId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.json(chamber);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chamber details', error: error.message });
    }
};
