const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all admin routes
router.use(authMiddleware, roleMiddleware(['Oxygens Admin']));

// ================= CUSTOMER ROUTES =================
router.post('/customers', adminController.createCustomer);
router.get('/customers', adminController.getAllCustomers);
router.put('/customers/:id', adminController.updateCustomer);
router.delete('/customers/:id', adminController.deleteCustomer);

router.post('/assign-user', adminController.assignUserToCustomer); // Only once

// ================= CHAMBER ROUTES =================
router.post('/chambers', adminController.createChamber);
router.get('/chambers', adminController.getAllChambers);
router.put('/chambers/:id', adminController.updateChamber);
router.delete('/chambers/:id', adminController.deleteChamber);

// ================= USER ROUTES =================
router.get('/users', adminController.getUsers);
router.get('/users/engineers', adminController.getEngineers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// ================= DASHBOARD =================
router.get('/dashboard-stats', adminController.getDashboardStats);

module.exports = router;
