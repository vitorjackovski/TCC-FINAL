const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({ mensagem: 'Acesso negado. Permissão insuficiente.' });
    }
    next();
  };
};

module.exports = autorizarRoles;
