const { Issue, Chamber, User , IssueMessage } = require('../models');

// Report a new issue

exports.reportIssue = async (req, res) => {
    try {
        const {
            chamberId,
            title,
            description,
            category,
            severity,
            doNotOperateRecommended
        } = req.body;

        // --- Ensure req.user is valid ---
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized: invalid user' });
        }

        // --- Fetch user from DB ---
        const user = await User.findByPk(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log('Reporting issue by user:', user.username);

        // --- Fetch chamber ---
        const chamber = await Chamber.findByPk(chamberId);
        if (!chamber) return res.status(404).json({ message: 'Chamber not found' });

        const customerId = chamber.customerId;
        console.log('Customer ID for the issue:', customerId);

        // --- Handle file uploads ---
        let uploads = [];
        if (req.files && req.files.length > 0) {
            uploads = req.files.map(file => `/uploads/${file.filename}`);
        }

        // --- Create Issue ---
        const issue = await Issue.create({
            customerId,
            chamberId,
            createdByMemberId: user.id,
            createdByName: user.username,
            title,
            description,
            category: category || 'Other',
            severity: severity || 'Minor',
            doNotOperateRecommended: doNotOperateRecommended || false,
            uploads
        });

        res.status(201).json({
            message: 'Issue reported successfully',
            issue
        });

    } catch (error) {
        console.error('Error reporting issue:', error);
        res.status(500).json({
            message: 'Error reporting issue',
            error: error.message
        });
    }
};



exports.getMyIssues = async (req, res) => {
    try {
        const { userId, role, customerId } = req.user;

        let whereClause = {};

        if (role === 'Engineer') {
            // Engineers see issues assigned to them
            whereClause.assignedEngineer = userId;
        } 
        else if (role === 'Operator' || role === 'Site Manager') {
            // Operators / Site Managers see issues they reported
            whereClause.createdByMemberId = userId;
        }
        // Admin / Superadmin see everything → no whereClause filter

        const issues = await Issue.findAll({
            where: whereClause,
            include: [
                { model: Chamber },
                { model: User, as: 'creator' },
                { model: User, as: 'engineer' }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(issues);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching issues',
            error: error.message
        });
    }
};



// Admin assigns an issue to an engineer
exports.assignIssue = async (req, res) => {
    try {
        const { issueId, engineerId } = req.body;
        const { role } = req.user;
        console.log('Assigning issue:', issueId, 'to engineer:', engineerId, 'by user with role:', role);
        if (role !== 'Oxygens Admin') {
            return res.status(403).json({
                message: 'Only admins can assign issues'
            });
        }

        const issue = await Issue.findByPk(issueId);

        if (!issue) {
            return res.status(404).json({
                message: 'Issue not found'
            });
        }

        issue.assignedEngineer = engineerId;
        issue.status = 'InProgress';

        await issue.save();

        res.json({
            message: 'Issue assigned successfully',
            issue
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error assigning issue',
            error: error.message
        });
    }
};

exports.addIssueMessage = async (req, res) => {
    try {
        const { issueId, messageText, isInternalNote } = req.body;

        const user = req.user;

        let uploads = [];

        if (req.files && req.files.length > 0) {
            uploads = req.files.map(file => `/uploads/${file.filename}`);
        }

        const message = await IssueMessage.create({
            issueId,
            memberId: user.userId,
            senderName: user.name,
            senderRole: user.role,
            messageText,
            uploads,
            isInternalNote: isInternalNote || false
        });

        res.status(201).json({
            message: 'Message added',
            data: message
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error adding message',
            error: error.message
        });
    }
};
