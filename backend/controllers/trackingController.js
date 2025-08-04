const db = require('../db');

const criarRastreamento = async (req, res) => {
    const { transporte_id, localizacao_atual, status} = req.body;
    const atualizado_em = new Date();
    atualizado_em.setHours(atualizado_em.getHours() - 3);
    try {
        const resultado = await db.query(
            'INSERT INTO rastreamentos (transporte_id, localizacao_atual, status, atualizado_em) VALUES ($1, $2, $3, $4) RETURNING *',
            [transporte_id, localizacao_atual, status, atualizado_em]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar rastreamento', detalhe: error.message });
    }
};

const listarRastreamentos = async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM rastreamentos');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar rastreamentos', detalhe: error.message });
    }
};

const buscarRastreamentoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await db.query('SELECT * FROM rastreamentos WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Rastreamento não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar rastreamento', detalhe: error.message });
    }
};

const atualizarRastreamento = async (req, res) => {
    const { id } = req.params;
    const { transporte_id, localizacao_atual, status} = req.body;
    const atualizado_em = new Date();
    atualizado_em.setHours(atualizado_em.getHours() - 3);
    try {
        const resultado = await db.query(
            'UPDATE rastreamentos SET transporte_id = $1, localizacao_atual = $2, status = $3, atualizado_em = $4 WHERE id = $5 RETURNING *',
            [transporte_id, localizacao_atual, status, atualizado_em, id]
        );
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Rastreamento não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar rastreamento', detalhe: error.message });
    }
};

const deletarRastreamento = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM rastreamentos WHERE id = $1', [id]);
        res.json({ mensagem: 'Rastreamento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar rastreamento', detalhe: error.message });
    }
};

module.exports = {
    criarRastreamento,
    listarRastreamentos,
    buscarRastreamentoPorId,
    atualizarRastreamento,
    deletarRastreamento
};
