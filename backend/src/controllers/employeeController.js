const db = require('../config/db');

const getAllEmployees = async (req, res) => {
  try {
    const sql = `
      SELECT 
        e.*, 
        d.name AS department_name,
        dh.name AS report_to_head_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN department_heads dh ON e.report_to_head_id = dh.id
      ORDER BY e.id ASC
    `;
    const employees = await db.query(sql);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees.' });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        e.*, 
        d.name AS department_name,
        d.profile_image AS department_image,
        dh.name AS report_to_head_name,
        dh.profile_image AS report_to_head_image,
        dh.employee_number AS report_to_head_emp_no
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN department_heads dh ON e.report_to_head_id = dh.id
      WHERE e.id = ?
    `;
    const employees = await db.query(sql, [id]);

    if (employees.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.json(employees[0]);
  } catch (error) {
    console.error('Error fetching employee detail:', error);
    res.status(500).json({ message: 'Error fetching employee detail.' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, employee_number, age, profile_image, profile_description, department_id, report_to_head_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!employee_number || !employee_number.trim()) {
      return res.status(400).json({ message: 'Employee number is required.' });
    }

    // Check unique employee number
    const existing = await db.query('SELECT id FROM employees WHERE employee_number = ?', [employee_number.trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Employee number already exists.' });
    }

    const sql = `
      INSERT INTO employees (name, employee_number, age, profile_image, profile_description, department_id, report_to_head_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
      name.trim(),
      employee_number.trim(),
      age ? parseInt(age, 10) : null,
      profile_image || null,
      profile_description || null,
      department_id ? parseInt(department_id, 10) : null,
      report_to_head_id ? parseInt(report_to_head_id, 10) : null
    ]);

    const newEmp = await db.query(
      `SELECT e.*, d.name AS department_name, dh.name AS report_to_head_name 
       FROM employees e 
       LEFT JOIN departments d ON e.department_id = d.id 
       LEFT JOIN department_heads dh ON e.report_to_head_id = dh.id 
       WHERE e.id = ?`,
      [result.insertId]
    );
    res.status(201).json(newEmp[0]);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Error creating employee.' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, employee_number, age, profile_image, profile_description, department_id, report_to_head_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!employee_number || !employee_number.trim()) {
      return res.status(400).json({ message: 'Employee number is required.' });
    }

    const current = await db.query('SELECT id FROM employees WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const existing = await db.query('SELECT id FROM employees WHERE employee_number = ? AND id != ?', [
      employee_number.trim(),
      id
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Employee number already in use by another employee.' });
    }

    const sql = `
      UPDATE employees 
      SET name = ?, employee_number = ?, age = ?, profile_image = ?, profile_description = ?, department_id = ?, report_to_head_id = ?
      WHERE id = ?
    `;
    await db.query(sql, [
      name.trim(),
      employee_number.trim(),
      age ? parseInt(age, 10) : null,
      profile_image || null,
      profile_description || null,
      department_id ? parseInt(department_id, 10) : null,
      report_to_head_id ? parseInt(report_to_head_id, 10) : null,
      id
    ]);

    const updatedEmp = await db.query(
      `SELECT e.*, d.name AS department_name, dh.name AS report_to_head_name 
       FROM employees e 
       LEFT JOIN departments d ON e.department_id = d.id 
       LEFT JOIN department_heads dh ON e.report_to_head_id = dh.id 
       WHERE e.id = ?`,
      [id]
    );
    res.json(updatedEmp[0]);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee.' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const current = await db.query('SELECT id FROM employees WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    await db.query('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Error deleting employee.' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
