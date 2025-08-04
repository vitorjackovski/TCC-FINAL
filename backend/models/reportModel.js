const db = require('../db');

async function criarRelatorio(titulo, descricao, criadoPor) {
    const result = await db.query(
        'INSERT INTO relatorios (titulo, descricao, criadoPor, criadoEm) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [titulo, descricao, criadoPor]
    );
    return result.rows[0];
}

async function listarRelatorios() {
    const result = await db.query('SELECT * FROM relatorios');
    return result.rows;
}

async function listarRelatorioPorId(id) {
    const result = await db.query('SELECT * FROM relatorios WHERE id = $1', [id]);
    return result.rows[0];
}

async function deletarRelatorio(id) {
    const result = await db.query('DELETE FROM relatorios WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}

module.exports = {
    criarRelatorio,
    listarRelatorios,
    listarRelatorioPorId,
    deletarRelatorio
};
