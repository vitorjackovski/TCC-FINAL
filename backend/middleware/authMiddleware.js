const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // sempre lowercase no express
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, role, ... }
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido.' });
  }
};

module.exports = autenticarToken;
