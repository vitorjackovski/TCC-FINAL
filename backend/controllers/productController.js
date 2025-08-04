const db = require('../db');

// ✅ Criar Produto
const criarProduto = async (req, res) => {
    const { nome, descricao, linha_producao, id_armazem } = req.body;
    try {
        const resultado = await db.query(
            'INSERT INTO produtos (nome, descricao, linha_producao, id_armazem) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, descricao, linha_producao, id_armazem]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar produto', detalhe: error.message });
    }
};


// ✅ Listar Produtos
const listarProdutos = async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM produtos');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar produtos', detalhe: error.message });
    }
};

// ✅ Buscar Produto por ID
const buscarProdutoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await db.query('SELECT * FROM produtos WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar produto', detalhe: error.message });
    }
};

// ✅ Atualizar Produto
const atualizarProduto = async (req, res) => {
    const { id } = req.params;
    const {nome, descricao, linha_producao, id_armazem } = req.body;
    try {
        const resultado = await db.query(
            `
            UPDATE produtos SET
                nome = COALESCE($1, nome),
                descricao = COALESCE($2, descricao),
                linha_producao = COALESCE($3, linha_producao),
                id_armazem = COALESCE($4, id_armazem)
            WHERE id = $5
            RETURNING *`,
            [nome, descricao, linha_producao, id_armazem, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        res.json({ mensagem: 'Produto atualizado com sucesso', produto: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar produto', detalhe: error.message });
    }
};

// ✅ Deletar Produto
const deletarProduto = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await db.query(
            'DELETE FROM produtos WHERE id = $1 RETURNING *',
            [id]
        );
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }
        res.json({ mensagem: 'Produto deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar produto', detalhe: error.message });
    }
};

module.exports = {
    criarProduto,
    listarProdutos,
    buscarProdutoPorId,
    atualizarProduto,
    deletarProduto
};
