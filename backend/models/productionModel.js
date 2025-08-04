const pool = require('../db');

async function createProduction(produtoId, dataProducao, quantidade, linhaProducao, id) {
  const result = await pool.query(
    'INSERT INTO production (id, produtoId, data_producao, quantidade, linha_producao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, produtoId, dataProducao, quantidade, linhaProducao]
  );
  return result.rows[0];
}

async function getProductions() {
  const result = await pool.query('SELECT * FROM production');
  return result.rows;
}

// 🔹 Compatível com alertController.js
async function listarProducoes() {
  return getProductions();
}

async function getProductionById(id) {
  const result = await pool.query('SELECT * FROM production WHERE id = $1', [id]);
  return result.rows[0];
}

async function updateProduction(id, data) {
  const { produtoId, dataProducao, quantidade, linhaProducao } = data;
  const result = await pool.query(
    'UPDATE production SET produto_id = $1, data_producao = $2, quantidade = $3, linha_producao = $4 WHERE id = $5 RETURNING *',
    [produtoId, dataProducao, quantidade, linhaProducao, id]
  );
  return result.rows[0];
}

async function deleteProduction(id) {
  const result = await pool.query('DELETE FROM production WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
  createProduction,
  getProductions,
  getProductionById,
  updateProduction,
  deleteProduction,
  listarProducoes // <-- adicionado
};
