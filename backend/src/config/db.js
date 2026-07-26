const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'office_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper for query execution
const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

module.exports = {
  pool,
  query
};
