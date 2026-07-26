const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admins = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = { id: admin.id, name: admin.name, email: admin.email };
    const secret = process.env.JWT_SECRET || 'replace_with_a_long_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: payload
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

const logout = async (req, res) => {
  res.json({ message: 'Logout successful.' });
};

const getMe = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admins = await db.query('SELECT id, name, email, created_at FROM admins WHERE id = ?', [adminId]);

    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin user not found.' });
    }

    res.json(admins[0]);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const admins = await db.query('SELECT * FROM admins WHERE id = ?', [adminId]);
    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE admins SET password_hash = ? WHERE id = ?', [newPasswordHash, adminId]);

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error updating password.' });
  }
};

module.exports = {
  login,
  logout,
  getMe,
  changePassword
};

