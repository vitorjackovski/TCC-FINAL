const Alert = require('../models/alertModel');

exports.criarAlerta = async (req, res) => {
  try {
    const { titulo, mensagem, tipo } = req.body;

    if (!titulo || !mensagem || !tipo) {
      return res.status(400).json({ erro: 'Título, mensagem e tipo são obrigatórios.' });
    }

    const novoAlerta = await Alert.criar({ titulo, mensagem, tipo });
    res.status(201).json(novoAlerta);
  } catch (err) {
    console.error('Erro ao criar alerta:', err);
    res.status(500).json({ erro: 'Erro interno ao criar alerta.' });
  }
};

exports.listarAlertas = async (req, res) => {
  try {
    const alertas = await Alert.listarTodos();

    if (!Array.isArray(alertas)) {
      return res.status(500).json({ erro: 'Erro ao carregar alertas' });
    }

    res.json(alertas);
  } catch (err) {
    console.error('Erro ao listar alertas:', err);
    res.status(500).json({ erro: 'Erro interno ao listar alertas.' });
  }
};

exports.atualizarAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, mensagem, tipo } = req.body;

    if (!titulo || !mensagem || !tipo) {
      return res.status(400).json({ erro: 'Título, mensagem e tipo são obrigatórios.' });
    }

    const alertaAtualizado = await Alert.atualizar(id, { titulo, mensagem, tipo });

    if (!alertaAtualizado) {
      return res.status(404).json({ erro: 'Alerta não encontrado.' });
    }

    res.json(alertaAtualizado);
  } catch (err) {
    console.error('Erro ao atualizar alerta:', err);
    res.status(500).json({ erro: 'Erro interno ao atualizar alerta.' });
  }
};

exports.excluirAlerta = async (req, res) => {
  try {
    const { id } = req.params;

    const excluido = await Alert.excluir(id);

    if (!excluido) {
      return res.status(404).json({ erro: 'Alerta não encontrado.' });
    }

    res.json({ mensagem: 'Alerta excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir alerta:', err);
    res.status(500).json({ erro: 'Erro interno ao excluir alerta.' });
  }
};
