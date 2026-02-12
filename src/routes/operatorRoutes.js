const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/operator/my-customer
router.get('/my-customer', authMiddleware, operatorController.getMyCustomer);

module.exports = router;
