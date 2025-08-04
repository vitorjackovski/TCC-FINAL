const db = require('../db');

exports.gerarRelatorioCompleto = async (req, res) => {
  try {
    const [produtos, producoes, transportes, armazens, alertas, parceiros] = await Promise.all([
      db.query('SELECT * FROM produtos'),
      db.query('SELECT * FROM producao'),
      db.query('SELECT * FROM transporte'),
      db.query('SELECT * FROM armazem'),
      db.query('SELECT * FROM alertas'),
      db.query('SELECT * FROM parceiros')
    ]);

    res.json({
      produtos: produtos.rows,
      producoes: producoes.rows,
      transportes: transportes.rows,
      armazens: armazens.rows,
      alertas: alertas.rows,
      parceiros: parceiros.rows
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
};
