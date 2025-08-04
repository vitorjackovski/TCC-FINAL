const express = require('express');
const path = require('path');
const router = express.Router();
const pool = require('../db'); // Certifique-se que você exporta o Pool no seu db.js
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

router.get('/', autenticarToken, autorizarRoles('admin'), async (req, res) => {
  try {
    // Total de produtos
    const totalProdutosResult = await pool.query('SELECT COUNT(*) FROM produtos');
    const totalProdutos = parseInt(totalProdutosResult.rows[0].count);

    // Total de produções
    const totalProducoesResult = await pool.query('SELECT COUNT(*) FROM producoes');
    const totalProducoes = parseInt(totalProducoesResult.rows[0].count);

    // Total de transportes
    const totalTransportesResult = await pool.query('SELECT COUNT(*) FROM transportes');
    const totalTransportes = parseInt(totalTransportesResult.rows[0].count);

    // Últimas 10 produções
    const producoesResult = await pool.query(`
      SELECT p.id, pr.nome AS produto, p.data_producao AS data, p.quantidade
      FROM producoes p
      JOIN produtos pr ON p.produto_id = pr.id
      ORDER BY p.data_producao DESC
      LIMIT 10
    `);

    // Últimos 10 transportes
    const transportesResult = await pool.query(`
      SELECT t.id, t.origem, t.destino, t.status
      FROM transportes t
      ORDER BY t.data_envio DESC
      LIMIT 10
    `);

    res.json({
      totalProdutos,
      totalProducoes,
      totalTransportes,
      producoes: producoesResult.rows,
      transportes: transportesResult.rows,
    });

  } catch (err) {
    console.error('Erro ao gerar relatório:', err);
    res.status(500).json({ erro: 'Erro interno ao gerar relatório' });
  }
});

// Rota protegida da página
router.get('/pagina', autenticarToken, autorizarRoles('admin'), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/protegido/relatorio.html'));
});

router.get('/relatorio.css', autenticarToken, autorizarRoles('admin'), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/protegido/relatorio.css'));
});

router.get('/relatorio.js', autenticarToken, autorizarRoles('admin'), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/protegido/relatorio.js'));
});

module.exports = router;
