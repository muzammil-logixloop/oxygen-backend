const express = require('express');
const router = express.Router();
const chamberController = require('../controllers/chamberController');
const checklistController = require('../controllers/checklistController');
const issueController = require('../controllers/issueController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

// Chambers
router.get('/chambers', chamberController.getMyChambers);
router.get('/chambers/:id', chamberController.getChamberDetails);

// Checklists
router.post('/checklists', upload.single('evidence'), checklistController.submitChecklist);
router.get('/chambers/:chamberId/checklists', checklistController.getHistory);

// Issues
router.post('/issues', upload.single('evidence'), issueController.reportIssue);
router.get('/issues', issueController.getMyIssues);

module.exports = router;
