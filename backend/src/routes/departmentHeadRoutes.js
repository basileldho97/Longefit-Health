const express = require('express');
const router = express.Router();
const departmentHeadController = require('../controllers/departmentHeadController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Public routes
router.get('/', departmentHeadController.getAllDepartmentHeads);
router.get('/:id', departmentHeadController.getDepartmentHeadById);

// Admin protected routes
router.post('/', authenticateJWT, departmentHeadController.createDepartmentHead);
router.put('/:id', authenticateJWT, departmentHeadController.updateDepartmentHead);
router.delete('/:id', authenticateJWT, departmentHeadController.deleteDepartmentHead);

module.exports = router;
