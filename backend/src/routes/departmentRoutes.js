const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Public routes
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);

// Admin protected routes
router.post('/', authenticateJWT, departmentController.createDepartment);
router.put('/:id', authenticateJWT, departmentController.updateDepartment);
router.delete('/:id', authenticateJWT, departmentController.deleteDepartment);

module.exports = router;
