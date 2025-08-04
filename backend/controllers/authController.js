const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  deleteUser
} = require('../models/userModel');

require('dotenv').config();

const secret = process.env.JWT_SECRET;

// Registrar usuário
async function register(req, res) {
  const { nome, email, senha, role } = req.body;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ msg: 'Email já cadastrado' });
  }

  const user = await createUser(nome, email, senha, role);
  res.status(201).json({ msg: 'Usuário criado com sucesso', user });
}

// Login
async function login(req, res) {
  const { email, senha } = req.body;
  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(400).json({ msg: 'Credenciais inválidas' });
  }

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) {
    return res.status(400).json({ msg: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, nome: user.nome },
    secret,
    { expiresIn: '8h' }
  );

  res.json({ token, role: user.role });
}

// Ver perfil
async function getProfile(req, res) {
  const user = await getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado' });
  }
  res.json(user);
}

// Listar todos os usuários (somente admin)
async function listUsers(req, res) {
  const users = await getAllUsers();
  res.json(users);
}

// Deletar usuário (somente admin)
async function removeUser(req, res) {
  const user = await deleteUser(req.params.id);
  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado' });
  }
  res.json({ msg: 'Usuário deletado com sucesso', user });
}

module.exports = {
  register,
  login,
  getProfile,
  listUsers,
  removeUser
};
