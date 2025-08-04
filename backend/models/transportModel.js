const db = require('../db');

async function criarTransporte(produto_id, origem, destino, data_envio, data_entrega, status) {
  const res = await db.query(
    `INSERT INTO transportes (produto_id, origem, destino, data_envio, data_entrega, status)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [produto_id, origem, destino, data_envio, data_entrega, status]
  );
  return res.rows[0];
}

async function listarTransportes() {
  const res = await db.query(`
    SELECT t.*, p.nome AS nome_produto
    FROM transportes t
    JOIN produtos p ON t.produto_id = p.id
    ORDER BY t.id DESC
  `);
  return res.rows;
}

async function buscarTransportePorId(id) {
  const res = await db.query(
    `SELECT t.*, p.nome AS nome_produto
     FROM transportes t
     JOIN produtos p ON t.produto_id = p.id
     WHERE t.id = $1`,
    [id]
  );
  return res.rows[0];
}

async function atualizarTransporte(id, data) {
  const { produto_id, origem, destino, data_envio, data_entrega, status } = data;
  const res = await db.query(
    `UPDATE transportes
     SET produto_id=$1, origem=$2, destino=$3, data_envio=$4, data_entrega=$5, status=$6
     WHERE id = $7 RETURNING *`,
    [produto_id, origem, destino, data_envio, data_entrega, status, id]
  );
  return res.rows[0];
}

async function deletarTransporte(id) {
  const res = await db.query('DELETE FROM transportes WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
}

module.exports = {
  criarTransporte,
  listarTransportes,
  buscarTransportePorId,
  atualizarTransporte,
  deletarTransporte
};
