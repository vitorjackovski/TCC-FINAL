const pool = require('../db');

async function createWarehouse(localizacao, capacidade) {
  const result = await pool.query(
    'INSERT INTO warehouse (localizacao, capacidade) VALUES ($1, $2) RETURNING *',
    [localizacao, capacidade]
  );
  return result.rows[0];
}

async function getWarehouses() {
  const result = await pool.query('SELECT * FROM warehouse');
  return result.rows;
}

async function getWarehouseById(id) {
  const result = await pool.query('SELECT * FROM warehouse WHERE id = $1', [id]);
  return result.rows[0];
}

async function updateWarehouse(id, data) {
  const { localizacao, capacidade } = data;
  const result = await pool.query(
    'UPDATE warehouse SET localizacao = $1, capacidade = $2 WHERE id = $3 RETURNING *',
    [localizacao, capacidade, id]
  );
  return result.rows[0];
}

async function deleteWarehouse(id) {
  const result = await pool.query('DELETE FROM warehouse WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse
};
