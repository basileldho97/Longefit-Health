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

module.exports = {
  login,
  logout,
  getMe
};
