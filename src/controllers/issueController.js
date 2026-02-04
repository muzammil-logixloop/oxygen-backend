const { Issue, Chamber } = require('../models');

exports.reportIssue = async (req, res) => {
    try {
        const { chamberId, title, description, priority } = req.body;
        const userId = req.user.userId;

        // Verify access
        // ...

        let evidencePath = null;
        if (req.file) {
            evidencePath = `/uploads/${req.file.filename}`;
        }

        const issue = await Issue.create({
            chamberId,
            reportedById: userId,
            title,
            description,
            priority,
            evidencePath
        });

        res.status(201).json({ message: 'Issue reported successfully', issue });
    } catch (error) {
        res.status(500).json({ message: 'Error reporting issue', error: error.message });
    }
};

exports.getMyIssues = async (req, res) => {
    // Operator sees issues they reported (or for their chambers)
    // Engineer sees assigned issues
    try {
        const { userId, role } = req.user;
        let whereClause = {};

        if (role === 'Engineer') {
            whereClause.assignedToId = userId;
        } else if (role === 'Operator' || role === 'Site Manager') {
            whereClause.reportedById = userId;
        }

        const issues = await Issue.findAll({ where: whereClause, include: Chamber });
        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching issues', error: error.message });
    }
}
