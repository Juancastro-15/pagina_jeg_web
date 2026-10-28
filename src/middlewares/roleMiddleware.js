const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        // req.user se llena automáticamente cuando pasa por verifyToken
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acceso denegado: No tienes permisos para realizar esta acción 🚫' });
        }
        next();
    };
};
module.exports = verifyRole;