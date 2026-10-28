const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clerical_secure_secret_key_2026';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de autenticación.' });
    }

    // El formato del header suele ser "Bearer [token]"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token malformado o ausente.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // Guardamos los datos del usuario decodificados en la petición
        next(); // Continuar con la ejecución de la ruta
    } catch (error) {
        res.status(403).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = verifyToken;