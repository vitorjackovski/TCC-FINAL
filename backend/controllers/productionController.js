const db = require('../db');

const criarProducao = async (req, res) => {
    const { produto_id, quantidade, data_producao } = req.body;
    try {
        const resultado = await db.query(
            'INSERT INTO producoes (produto_id, quantidade, data_producao) VALUES ($1, $2, $3) RETURNING *',
            [produto_id, quantidade, data_producao]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar produção', detalhe: error.message });
    }
};

const listarProducoes = async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM producoes');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar produções', detalhe: error.message });
    }
};

const buscarProducaoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await db.query('SELECT * FROM producoes WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Produção não encontrada' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar produção', detalhe: error.message });
    }
};

const atualizarProducao = async (req, res) => {
    const { id } = req.params;
    const { produto_id, quantidade, data_producao } = req.body;
    try {
        const resultado = await db.query(
            'UPDATE producoes SET produto_id = $1, quantidade = $2, data_producao = $3 WHERE id = $4 RETURNING *',
            [produto_id, quantidade, data_producao, id]
        );
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Produção não encontrada' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar produção', detalhe: error.message });
    }
};

const deletarProducao = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM producoes WHERE id = $1', [id]);
        res.json({ mensagem: 'Produção deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar produção', detalhe: error.message });
    }
};

module.exports = {
    criarProducao,
    listarProducoes,
    buscarProducaoPorId,
    atualizarProducao,
    deletarProducao
};
