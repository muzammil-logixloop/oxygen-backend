const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all admin routes
router.use(authMiddleware, roleMiddleware(['Oxygens Admin']));

// Customer Routes
router.post('/customers', adminController.createCustomer);
router.get('/customers', adminController.getAllCustomers);
router.post('/assign-user', adminController.assignUserToCustomer);

// Chamber Routes
router.post('/chambers', adminController.createChamber);
router.get('/chambers', adminController.getAllChambers);

// User Routes
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/assign-user', adminController.assignUserToCustomer);

module.exports = router;
