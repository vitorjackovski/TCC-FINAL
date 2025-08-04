const db = require('../db');

const criarProduto = async (nome, descricao, linha_producao, id_armazem) => {
  const resultado = await db.query(
    'INSERT INTO produtos (nome, descricao, linha_producao, id_armazem) VALUES ($1, $2, $3, $4) RETURNING *',
    [nome, descricao, linha_producao, id_armazem]
  );
  return resultado.rows[0];
};

const listarProdutos = async () => {
  const resultado = await db.query('SELECT * FROM produtos');
  return resultado.rows;
};

const buscarProdutoPorId = async (id) => {
  const resultado = await db.query('SELECT * FROM produtos WHERE id = $1', [id]);
  return resultado.rows[0];
};

const atualizarProduto = async (id, nome, descricao, linha_producao, id_armazem) => {
  const resultado = await db.query(
    `UPDATE produtos SET
      nome = COALESCE($1, nome),
      descricao = COALESCE($2, descricao),
      linha_producao = COALESCE($3, linha_producao),
      id_armazem = COALESCE($4, id_armazem)
    WHERE id = $5
    RETURNING *`,
    [nome, descricao, linha_producao, id_armazem, id]
  );
  return resultado.rows[0];
};

const deletarProduto = async (id) => {
  const resultado = await db.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
  return resultado.rows[0];
};

module.exports = {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  deletarProduto
};
