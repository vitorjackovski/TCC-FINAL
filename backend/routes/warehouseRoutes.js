const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

router.post('/', autenticarToken, autorizarRoles('admin', 'operador'), warehouseController.criarArmazem);
router.get('/', autenticarToken, warehouseController.listarArmazens);
router.get('/:id', autenticarToken, warehouseController.buscarArmazemPorId);
router.put('/:id', autenticarToken, autorizarRoles('admin', 'operador'), warehouseController.atualizarArmazem);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), warehouseController.deletarArmazem);
router.get('/:id/produtos', autenticarToken, warehouseController.listarProdutosDoArmazem);


module.exports = router;
