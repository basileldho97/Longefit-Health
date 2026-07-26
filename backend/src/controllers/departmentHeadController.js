const db = require('../config/db');

const getAllDepartmentHeads = async (req, res) => {
  try {
    const sql = `
      SELECT dh.*, d.name AS department_name
      FROM department_heads dh
      LEFT JOIN departments d ON dh.department_id = d.id
      ORDER BY dh.id ASC
    `;
    const heads = await db.query(sql);
    res.json(heads);
  } catch (error) {
    console.error('Error fetching department heads:', error);
    res.status(500).json({ message: 'Error fetching department heads.' });
  }
};

const getDepartmentHeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT dh.*, d.name AS department_name, d.profile_image AS department_image
      FROM department_heads dh
      LEFT JOIN departments d ON dh.department_id = d.id
      WHERE dh.id = ?
    `;
    const heads = await db.query(sql, [id]);

    if (heads.length === 0) {
      return res.status(404).json({ message: 'Department head not found.' });
    }

    const head = heads[0];

    // Get supervised employees
    const employees = await db.query(
      `SELECT e.id, e.name, e.employee_number, e.age, e.profile_image, e.profile_description
       FROM employees e
       WHERE e.report_to_head_id = ?`,
      [id]
    );

    res.json({
      ...head,
      supervised_employees: employees
    });
  } catch (error) {
    console.error('Error fetching department head detail:', error);
    res.status(500).json({ message: 'Error fetching department head detail.' });
  }
};

const createDepartmentHead = async (req, res) => {
  try {
    const { name, employee_number, age, profile_image, profile_description, department_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!employee_number || !employee_number.trim()) {
      return res.status(400).json({ message: 'Employee number is required.' });
    }

    // Check unique employee number
    const existing = await db.query('SELECT id FROM department_heads WHERE employee_number = ?', [employee_number.trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Employee number already exists.' });
    }

    const sql = `
      INSERT INTO department_heads (name, employee_number, age, profile_image, profile_description, department_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
      name.trim(),
      employee_number.trim(),
      age ? parseInt(age, 10) : null,
      profile_image || null,
      profile_description || null,
      department_id ? parseInt(department_id, 10) : null
    ]);

    const newHead = await db.query(
      `SELECT dh.*, d.name AS department_name FROM department_heads dh LEFT JOIN departments d ON dh.department_id = d.id WHERE dh.id = ?`,
      [result.insertId]
    );
    res.status(201).json(newHead[0]);
  } catch (error) {
    console.error('Error creating department head:', error);
    res.status(500).json({ message: 'Error creating department head.' });
  }
};

const updateDepartmentHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, employee_number, age, profile_image, profile_description, department_id } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!employee_number || !employee_number.trim()) {
      return res.status(400).json({ message: 'Employee number is required.' });
    }

    const current = await db.query('SELECT id FROM department_heads WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ message: 'Department head not found.' });
    }

    // Check duplicate employee number for other records
    const existing = await db.query('SELECT id FROM department_heads WHERE employee_number = ? AND id != ?', [
      employee_number.trim(),
      id
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Employee number already in use by another record.' });
    }

    const sql = `
      UPDATE department_heads 
      SET name = ?, employee_number = ?, age = ?, profile_image = ?, profile_description = ?, department_id = ?
      WHERE id = ?
    `;
    await db.query(sql, [
      name.trim(),
      employee_number.trim(),
      age ? parseInt(age, 10) : null,
      profile_image || null,
      profile_description || null,
      department_id ? parseInt(department_id, 10) : null,
      id
    ]);

    const updatedHead = await db.query(
      `SELECT dh.*, d.name AS department_name FROM department_heads dh LEFT JOIN departments d ON dh.department_id = d.id WHERE dh.id = ?`,
      [id]
    );
    res.json(updatedHead[0]);
  } catch (error) {
    console.error('Error updating department head:', error);
    res.status(500).json({ message: 'Error updating department head.' });
  }
};

const deleteDepartmentHead = async (req, res) => {
  try {
    const { id } = req.params;

    const current = await db.query('SELECT id FROM department_heads WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({ message: 'Department head not found.' });
    }

    await db.query('DELETE FROM department_heads WHERE id = ?', [id]);
    res.json({ message: 'Department head deleted successfully.' });
  } catch (error) {
    console.error('Error deleting department head:', error);
    res.status(500).json({ message: 'Error deleting department head.' });
  }
};

module.exports = {
  getAllDepartmentHeads,
  getDepartmentHeadById,
  createDepartmentHead,
  updateDepartmentHead,
  deleteDepartmentHead
};
