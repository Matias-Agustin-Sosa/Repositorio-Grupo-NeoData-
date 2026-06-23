const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

// RUTAS PÚBLICAS
router.get('/', controller.getAll);        
router.get('/:id', controller.getById);    

// 🛒 NUEVA RUTA PARA COMPRAR (Abierta a cualquier usuario logueado)
router.post('/checkout', verificarToken, controller.checkout); 

// 📦 RUTA PARA CREAR UN NUEVO PRODUCTO (Solo Administradores)
router.post('/', verificarToken, esAdmin, controller.create);       

router.put('/:id', verificarToken, esAdmin, controller.update);     
router.delete('/:id', verificarToken, esAdmin, controller.remove);  

module.exports = router;