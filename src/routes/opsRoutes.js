const express = require('express');
const router = express.Router();
const chamberController = require('../controllers/chamberController');
const checklistController = require('../controllers/checklistController');
const issueController = require('../controllers/issueController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadchecklist = require('../middleware/uploadChecklist');

router.use(authMiddleware);

// Chambers
router.get('/chambers', chamberController.getMyChambers);
router.get('/chambers/:id', chamberController.getChamberDetails);

// Checklists
router.post('/checklists/submit', uploadchecklist, checklistController.submitChecklist);
router.get('/checklists/template/:type', checklistController.getChecklistTemplate);
router.get('/chambers/:chamberId/checklists', checklistController.getHistory);
router.get('/checklists/my-submissions', checklistController.getMySubmissions);

// Issues
router.post('/issues', upload.single('evidence'), issueController.reportIssue);
router.get('/issues', issueController.getMyIssues);

module.exports = router;
