const { Issue, Chamber, User } = require('../models');

// Report a new issue
exports.reportIssue = async (req, res) => {
    try {
        const { chamberId, title, description, priority } = req.body;
        const userId = req.user.userId;

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

// Get issues based on role
exports.getMyIssues = async (req, res) => {
    try {
        const { userId, role } = req.user;
        let whereClause = {};

        if (role === 'Engineer') {
            whereClause.assignedToId = userId;
        } else if (role === 'Operator' || role === 'Site Manager') {
            whereClause.reportedById = userId;
        }
        // Oxygen Admin can see all issues
        else if (role === 'Oxygen Admin') {
            // No where clause needed, admins see everything
        }

        const issues = await Issue.findAll({
            where: whereClause,
            include: [
                { model: Chamber },        // Chamber info
                { model: User, as: 'reporter' },  // Who reported it
                { model: User, as: 'assignee' }   // Who is assigned
            ]
        });

        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching issues', error: error.message });
    }
};


// Admin assigns an issue to an engineer
exports.assignIssue = async (req, res) => {
    try {
        const { issueId, engineerId } = req.body;
        const { role } = req.user;

        if (role !== 'Oxygen Admin') {
            return res.status(403).json({ message: 'Only admins can assign issues' });
        }

        const issue = await Issue.findByPk(issueId);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        issue.assignedToId = engineerId;
        await issue.save();

        res.json({ message: 'Issue assigned successfully', issue });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning issue', error: error.message });
    }
};
