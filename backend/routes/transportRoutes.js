const express = require('express');
const router = express.Router();
const transporteController = require('../controllers/transporteController');
const autenticar = require('../middlewares/autenticar'); // Seu middleware de autenticação

router.use(autenticar);

router.get('/transportes', transporteController.listarTransportes);
router.post('/transportes', transporteController.criarTransporte);
router.put('/transportes/:id', transporteController.atualizarTransporte);
router.delete('/transportes/:id', transporteController.deletarTransporte);

module.exports = router;
