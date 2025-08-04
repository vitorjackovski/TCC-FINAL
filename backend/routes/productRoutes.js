const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/productController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

// 🔒 Rotas protegidas
router.post('/', autenticarToken, autorizarRoles('admin'), produtoController.criarProduto);
router.get('/', autenticarToken, produtoController.listarProdutos);
router.get('/:id', autenticarToken, produtoController.buscarProdutoPorId);
router.put('/:id', autenticarToken, autorizarRoles('admin'), produtoController.atualizarProduto);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), produtoController.deletarProduto);

module.exports = router;
