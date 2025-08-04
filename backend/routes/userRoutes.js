const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');


router.post('/registrar', autenticarToken, autorizarRoles('admin'), userController.registrar);

router.post('/login', userController.login);

router.get('/', autenticarToken, autorizarRoles('admin'), userController.listar);
router.get('/:id', autenticarToken, userController.buscarPorId);

router.put('/:id', autenticarToken, autorizarRoles('admin'), userController.atualizar);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), userController.deletar);

module.exports = router;
