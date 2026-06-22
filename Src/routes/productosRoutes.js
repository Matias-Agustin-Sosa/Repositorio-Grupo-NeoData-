const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');

// 🆕 Importamos con el nombre correcto: esAdmin
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

// RUTAS PÚBLICAS
router.get('/', controller.getAll);        
router.get('/:id', controller.getById);    

// RUTAS PROTEGIDAS (Usando esAdmin)
router.post('/', verificarToken, esAdmin, controller.create);       
router.put('/:id', verificarToken, esAdmin, controller.update);     
router.delete('/:id', verificarToken, esAdmin, controller.remove);  

module.exports = router;