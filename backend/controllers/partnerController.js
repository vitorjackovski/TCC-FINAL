const db = require('../db');

const criarParceiro = async (req, res) => {
    const { nome, cnpj, endereco, contato } = req.body;
    try {
        const resultado = await db.query(
            'INSERT INTO parceiros (nome, cnpj, endereco, contato) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, cnpj, endereco, contato]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar parceiro', detalhe: error.message });
    }
};

const listarParceiros = async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM parceiros');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar parceiros', detalhe: error.message });
    }
};

const buscarParceiroPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await db.query('SELECT * FROM parceiros WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Parceiro não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar parceiro', detalhe: error.message });
    }
};

const atualizarParceiro = async (req, res) => {
    const { id } = req.params;
    const { nome, cnpj, endereco, contato } = req.body;
    try {
        const resultado = await db.query(
            'UPDATE parceiros SET nome = $1, cnpj = $2, endereco = $3, contato = $4 WHERE id = $5 RETURNING *',
            [nome, cnpj, endereco, contato, id]
        );
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Parceiro não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar parceiro', detalhe: error.message });
    }
};

const deletarParceiro = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM parceiros WHERE id = $1', [id]);
        res.json({ mensagem: 'Parceiro deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar parceiro', detalhe: error.message });
    }
};

module.exports = {
    criarParceiro,
    listarParceiros,
    buscarParceiroPorId,
    atualizarParceiro,
    deletarParceiro
};
