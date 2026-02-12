const { User, Customer } = require('../models');

// Get customer assigned to logged-in operator
exports.getMyCustomer = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware

        // 1️⃣ Check if user exists
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 2️⃣ Ensure operator has customer assigned
        if (!user.customerId) {
            return res.status(400).json({
                success: false,
                message: "Operator has no customer assigned"
            });
        }

        // 3️⃣ Fetch customer
        const customer = await Customer.findByPk(user.customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Assigned customer not found"
            });
        }

        // 4️⃣ Return customer data
        return res.status(200).json({
            success: true,
            data: customer
        });

    } catch (error) {
        console.error("Error fetching operator customer:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
