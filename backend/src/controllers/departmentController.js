const db = require('../config/db');

const getAllDepartments = async (req, res) => {
  try {
    const sql = `
      SELECT d.*, 
        COUNT(DISTINCT dh.id) AS head_count,
        COUNT(DISTINCT e.id) AS employee_count
      FROM departments d
      LEFT JOIN department_heads dh ON d.id = dh.department_id
      LEFT JOIN employees e ON d.id = e.department_id
      GROUP BY d.id
      ORDER BY d.id ASC
    `;
    const departments = await db.query(sql);
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Error fetching departments.' });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const depts = await db.query('SELECT * FROM departments WHERE id = ?', [id]);

    if (depts.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    const department = depts[0];

    // Fetch department heads belonging to this department
    const heads = await db.query(
      'SELECT id, name, employee_number, age, profile_image, profile_description FROM department_heads WHERE department_id = ?',
      [id]
    );

    // Fetch employees belonging to this department
    const employees = await db.query(
      `SELECT e.id, e.name, e.employee_number, e.age, e.profile_image, e.profile_description, e.report_to_head_id, dh.name AS report_to_head_name
       FROM employees e
       LEFT JOIN department_heads dh ON e.report_to_head_id = dh.id
       WHERE e.department_id = ?`,
      [id]
    );

    res.json({
      ...department,
      department_heads: heads,
      employees: employees
    });
  } catch (error) {
    console.error('Error fetching department detail:', error);
    res.status(500).json({ message: 'Error fetching department detail.' });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, profile_image, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Department name is required.' });
    }

    const result = await db.query(
      'INSERT INTO departments (name, profile_image, description) VALUES (?, ?, ?)',
      [name.trim(), profile_image || null, description || null]
    );

    const newDept = await db.query('SELECT * FROM departments WHERE id = ?', [result.insertId]);
    res.status(201).json(newDept[0]);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Error creating department.' });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profile_image, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Department name is required.' });
    }

    const existing = await db.query('SELECT id FROM departments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    await db.query(
      'UPDATE departments SET name = ?, profile_image = ?, description = ? WHERE id = ?',
      [name.trim(), profile_image || null, description || null, id]
    );

    const updatedDept = await db.query('SELECT * FROM departments WHERE id = ?', [id]);
    res.json(updatedDept[0]);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Error updating department.' });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.query('SELECT id FROM departments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    await db.query('DELETE FROM departments WHERE id = ?', [id]);
    res.json({ message: 'Department deleted successfully.' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Error deleting department.' });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
