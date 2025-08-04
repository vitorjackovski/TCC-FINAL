const pool = require('../db');

async function createTracking(produtoId, status, localizacao, atualizado_em) {
  const result = await pool.query(
    'INSERT INTO tracking (produto_id, status, localizacao, atualizado_em) VALUES ($1, $2, $3, $4) RETURNING *',
    [produtoId, status, localizacao, atualizado_em]
  );
  return result.rows[0];
}

async function getTrackings() {
  const result = await pool.query('SELECT * FROM tracking');
  return result.rows;
}

async function getTrackingById(id) {
  const result = await pool.query('SELECT * FROM tracking WHERE id = $1', [id]);
  return result.rows[0];
}

async function updateTracking(id, data) {
  const { produtoId, status, localizacao, atualizado_em } = data;
  const result = await pool.query(
    'UPDATE tracking SET produto_id = $1, status = $2, localizacao = $3, atualizado_em = $4 WHERE id = $5 RETURNING *',
    [produtoId, status, localizacao, atualizado_em, id]
  );
  return result.rows[0];
}

async function deleteTracking(id) {
  const result = await pool.query('DELETE FROM tracking WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
  createTracking,
  getTrackings,
  getTrackingById,
  updateTracking,
  deleteTracking
};
