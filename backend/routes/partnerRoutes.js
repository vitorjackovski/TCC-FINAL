const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

router.post('/', autenticarToken, autorizarRoles('admin', 'operador'), partnerController.criarParceiro);
router.get('/', autenticarToken, partnerController.listarParceiros);
router.get('/:id', autenticarToken, partnerController.buscarParceiroPorId);
router.put('/:id', autenticarToken, autorizarRoles('admin', 'operador'), partnerController.atualizarParceiro);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), partnerController.deletarParceiro);

module.exports = router;
