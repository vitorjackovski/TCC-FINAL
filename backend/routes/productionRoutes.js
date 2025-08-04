const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

router.post('/', autenticarToken, autorizarRoles('admin', 'operador'), productionController.criarProducao);
router.get('/', autenticarToken, productionController.listarProducoes);
router.get('/:id', autenticarToken, productionController.buscarProducaoPorId);
router.put('/:id', autenticarToken, autorizarRoles('admin', 'operador'), productionController.atualizarProducao);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), productionController.deletarProducao);

module.exports = router;
