const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const verificarPermissao = require('../middleware/roleMiddleware');

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas protegidas
router.get('/me', authMiddleware, authController.getProfile);

// Somente admin pode ver todos ou deletar
router.get('/users', authMiddleware, verificarPermissao('admin'), authController.listUsers);
router.delete('/users/:id', authMiddleware, verificarPermissao('admin'), authController.removeUser);

module.exports = router;
