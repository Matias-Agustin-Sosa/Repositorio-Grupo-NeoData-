const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken'); // 🌟 Importamos jwt para procesar el token opcional

// 🌟 MIDDLEWARE INTERMEDIO PARA EL CATÁLOGO PÚBLICO
// Intenta leer el token para identificar si es Admin, pero NO bloquea el acceso si no hay token
const leerTokenOpcional = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (token) {
        try {
            // Usamos la misma clave secreta que tu authMiddleware
            const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temporal');
            req.usuario = verificado; // Guardamos el usuario en la petición
        } catch (error) {
            // Si el token es inválido o expiró, no tiramos error, solo continuamos como invitado
            console.log("Token opcional inválido o expirado, continuando como invitado.");
        }
    }
    next(); 
};

// RUTAS PÚBLICAS (Ahora con soporte para identificar Admins de forma opcional)
router.get('/', leerTokenOpcional, controller.getAll);        
router.get('/:id', controller.getById);    

// 🛒 NUEVA RUTA PARA COMPRAR (Abierta a cualquier usuario logueado)
router.post('/checkout', verificarToken, controller.checkout); 

// 📦 RUTA PARA CREAR UN NUEVO PRODUCTO (Solo Administradores)
router.post('/', verificarToken, esAdmin, controller.create);       

router.put('/:id', verificarToken, esAdmin, controller.update);     

// 🌟 Esta sigue siendo tu ruta DELETE para deshabilitar (borrado lógico), protegida para admins
router.delete('/:id', verificarToken, esAdmin, controller.remove);  

module.exports = router;