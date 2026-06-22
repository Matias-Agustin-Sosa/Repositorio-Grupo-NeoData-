// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = {
    verificarToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({ error: "Acceso denegado. No se proporcionó un token válido." });
        }

        try {
            // 💡 CORREGIDO: Ahora usa 'secret_key_temporal' igual que el Login
            const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temporal');
            
            req.usuario = verificado; 
            next(); 
        } catch (error) {
            return res.status(403).json({ error: "Token inválido o expirado." });
        }
    },

    esAdmin: (req, res, next) => {
        // Doble seguridad: Validamos transformando a número
        if (!req.usuario || Number(req.usuario.administrador) !== 1) {
            return res.status(403).json({ error: "Permiso denegado. Se requieren privilegios de administrador." });
        }
        next(); 
    }
};

module.exports = authMiddleware;