const jwt = require('jsonwebtoken');

// Middleware 1: Verifica que el usuario esté logueado (Token válido)
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // El token suele venir como "Bearer <TOKEN>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Token no provisto." });
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY_NEODATA');
        req.user = decoded; // Guardamos los datos del usuario en la petición para el siguiente middleware
        next(); // Continuar a la ruta o al siguiente filtro
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};

// Middleware 2: Filtra según tu columna modificada 'administrador' (1 = True)
const esAdministrador = (req, res, next) => {
    // req.user viene del middleware anterior
    if (!req.user || req.user.esAdmin !== 1) {
        return res.status(403).json({ error: "Permisos insuficientes. Requiere rol de Administrador." });
    }
    next();
};

module.exports = { verificarToken, esAdministrador };