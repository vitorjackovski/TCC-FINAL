const db = require('../db');

const criarArmazem = async (req, res) => {
    const { nome, localizacao, capacidade } = req.body;
    try {
        const resultado = await db.query(
            'INSERT INTO armazens (nome, localizacao, capacidade) VALUES ($1, $2, $3) RETURNING *',
            [nome, localizacao, capacidade]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar armazém', detalhe: error.message });
    }
};

const listarArmazens = async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM armazens');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar armazéns', detalhe: error.message });
    }
};

const buscarArmazemPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await db.query('SELECT * FROM armazens WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Armazém não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar armazém', detalhe: error.message });
    }
};

const atualizarArmazem = async (req, res) => {
    const { id } = req.params;
    const { nome, localizacao, capacidade } = req.body;
    try {
        const resultado = await db.query(
            'UPDATE armazens SET nome = $1, localizacao = $2, capacidade = $3 WHERE id = $4 RETURNING *',
            [nome, localizacao, capacidade, id]
        );
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Armazém não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar armazém', detalhe: error.message });
    }
};

const deletarArmazem = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM armazens WHERE id = $1', [id]);
        res.json({ mensagem: 'Armazém deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar armazém', detalhe: error.message });
    }
};


const listarProdutosDoArmazem = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await db.query(
            `SELECT * FROM produtos WHERE id_armazem = $1`,
            [id]
        );

        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar produtos do armazém', detalhe: error.message });
    }
};


module.exports = {
    criarArmazem,
    listarArmazens,
    buscarArmazemPorId,
    atualizarArmazem,
    deletarArmazem,
    listarProdutosDoArmazem,
};
