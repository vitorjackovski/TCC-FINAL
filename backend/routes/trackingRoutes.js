const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const autenticarToken = require('../middleware/authMiddleware');

router.post('/', autenticarToken, trackingController.criarRastreamento);
router.get('/', autenticarToken, trackingController.listarRastreamentos);
router.get('/:id', autenticarToken, trackingController.buscarRastreamentoPorId);
router.put('/:id', autenticarToken, trackingController.atualizarRastreamento);
router.delete('/:id', autenticarToken, trackingController.deletarRastreamento);

module.exports = router;
