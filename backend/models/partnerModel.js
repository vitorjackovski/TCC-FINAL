const db = require('../db');

async function createPartner(nome, tipo, contato) {
  const result = await db.query(
    'INSERT INTO parceiros (nome, tipo, contato, criado_em) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [nome, tipo, contato]
  );
  return result.rows[0];
}

async function getPartners() {
  const result = await db.query('SELECT * FROM parceiros');
  return result.rows;
}

async function getPartnerById(id) {
  const result = await db.query('SELECT * FROM parceiros WHERE id = $1', [id]);
  return result.rows[0];
}

async function updatePartner(id, data) {
  const result = await db.query(
    'UPDATE parceiros SET nome = $1, tipo = $2, contato = $3 WHERE id = $4 RETURNING *',
    [data.nome, data.tipo, data.contato, id]
  );
  return result.rows[0];
}

async function deletePartner(id) {
  const result = await db.query('DELETE FROM parceiros WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
  createPartner,
  getPartners,
  getPartnerById,
  updatePartner,
  deletePartner
};
