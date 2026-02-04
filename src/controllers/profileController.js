const { Profile, User, Role } = require('../models');
const fs = require('fs');
const path = require('path');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        // Find or Create profile if not exists (for robustness)
        let profile = await Profile.findOne({ where: { userId } });

        if (!profile) {
            profile = await Profile.create({ userId });
        }

        const user = await User.findByPk(userId, {
            attributes: ['username', 'email'],
            include: { model: Role, attributes: ['name'] }
        });

        res.json({ profile, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { fullName, bio } = req.body;

        const profile = await Profile.findOne({ where: { userId } });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        profile.fullName = fullName || profile.fullName;
        profile.bio = bio || profile.bio;
        await profile.save();

        res.json({ message: 'Profile updated', profile });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.user.userId;
        const profile = await Profile.findOne({ where: { userId } });

        // Delete old image if exists
        if (profile.imageFilename) {
            const oldPath = path.join(__dirname, '../../uploads', profile.imageFilename);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        profile.imageFilename = req.file.filename;
        // Construct local path URL (ensure backend serves /uploads)
        profile.imagePath = `/uploads/${req.file.filename}`;
        await profile.save();

        res.json({ message: 'Image uploaded', imagePath: profile.imagePath });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
