const pool = require('../db');
const bcrypt = require('bcrypt');

async function createUser(nome, email, senha, role = 'operador') {
  const hashedPassword = await bcrypt.hash(senha, 10);
  const result = await pool.query(
    'INSERT INTO users (nome, email, senha, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [nome, email, hashedPassword, role]
  );
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function getUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

async function getAllUsers() {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}

async function deleteUser(id) {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  deleteUser
};
