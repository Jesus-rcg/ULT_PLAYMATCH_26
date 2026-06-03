export const verificarRol = (rolPermitido) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const rolUsuario = Number(req.user.rol);
    const rolNecesario = Number(rolPermitido);

    if (Number.isNaN(rolUsuario)) {
      return res.status(403).json({ message: "Rol inválido en token" });
    }

    if (rolUsuario !== rolNecesario) {
      return res.status(403).json({ message: "No autorizado" });
    }

    next();
  };
};
