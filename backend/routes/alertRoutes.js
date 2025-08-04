const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

// Apenas admin pode criar alertas
router.post('/', autenticarToken, autorizarRoles('admin'), alertController.criarAlerta);

// Listar alertas (qualquer autenticado)
router.get('/', autenticarToken, alertController.listarAlertas);

// Atualizar alerta (admin)
router.put('/:id', autenticarToken, autorizarRoles('admin'), alertController.atualizarAlerta);

// Excluir alerta (admin)
router.delete('/:id', autenticarToken, autorizarRoles('admin'), alertController.excluirAlerta);

module.exports = router;
