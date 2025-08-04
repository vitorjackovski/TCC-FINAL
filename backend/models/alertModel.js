const db = require('../db');

const Alert = {
  async criar({ titulo, mensagem, tipo }) {
    const result = await db.query(
      'INSERT INTO alertas (titulo, mensagem, tipo, criado_em) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [titulo, mensagem, tipo]
    );
    return result.rows[0];
  },

  async listarTodos() {
    const result = await db.query('SELECT * FROM alertas ORDER BY criado_em DESC');
    return result.rows;
  },

  async atualizar(id, { titulo, mensagem, tipo }) {
    const result = await db.query(
      `UPDATE alertas
       SET titulo = $1, mensagem = $2, tipo = $3
       WHERE id = $4
       RETURNING *`,
      [titulo, mensagem, tipo, id]
    );

    return result.rows[0] || null;
  },

  async excluir(id) {
    const result = await db.query(
      `DELETE FROM alertas WHERE id = $1 RETURNING *`,
      [id]
    );

    return result.rows[0] || null;
  }
};

module.exports = Alert;
