const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Public routes
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);

// Admin protected routes
router.post('/', authenticateJWT, employeeController.createEmployee);
router.put('/:id', authenticateJWT, employeeController.updateEmployee);
router.delete('/:id', authenticateJWT, employeeController.deleteEmployee);

module.exports = router;
