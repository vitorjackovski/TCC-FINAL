const db = require('../db');

// Criar Transporte
const criarTransporte = async (req, res) => {
  const { produto_id, origem, destino, data_envio, data_entrega, status } = req.body;
  try {
    const resultado = await db.query(
      `INSERT INTO transportes (produto_id, origem, destino, data_envio, data_entrega, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [produto_id, origem, destino, data_envio, data_entrega, status]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar transporte', detalhe: error.message });
  }
};

// Listar Transportes
const listarTransportes = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT
        t.*,
        p.nome AS nome_produto,
        o.id AS origem,
        o.nome AS nome_origem,
        o.localizacao AS localizacao_origem,
        d.id AS destino,
        d.nome AS nome_destino,
        d.localizacao AS localizacao_destino
      FROM transportes t
      JOIN produtos p ON t.produto_id = p.id
      JOIN armazens o ON t.origem = o.id
      JOIN armazens d ON t.destino = d.id
      ORDER BY t.id DESC
    `);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar transportes', detalhe: error.message });
  }
};

// Atualizar Transporte
const atualizarTransporte = async (req, res) => {
  const { id } = req.params;
  const { produto_id, origem, destino, data_envio, data_entrega, status } = req.body;
  try {
    const resultado = await db.query(
      `UPDATE transportes
       SET produto_id = $1, origem = $2, destino = $3, data_envio = $4, data_entrega = $5, status = $6
       WHERE id = $7
       RETURNING *`,
      [produto_id, origem, destino, data_envio, data_entrega, status, id]
    );
    if (resultado.rowCount === 0) return res.status(404).json({ erro: 'Transporte não encontrado' });
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar transporte', detalhe: error.message });
  }
};

// Deletar Transporte
const deletarTransporte = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query('DELETE FROM transportes WHERE id = $1', [id]);
    if (resultado.rowCount === 0) return res.status(404).json({ erro: 'Transporte não encontrado' });
    res.json({ mensagem: 'Transporte deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar transporte', detalhe: error.message });
  }
};

module.exports = {
  criarTransporte,
  listarTransportes,
  atualizarTransporte,
  deletarTransporte
};
