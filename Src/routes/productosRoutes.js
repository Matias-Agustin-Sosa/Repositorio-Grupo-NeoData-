const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');

// 🆕 Importamos los guardianes de seguridad
const { verificarToken, esAdministrador } = require('../middlewares/authmiddleware');


// RUTAS PÚBLICAS (Cualquier visitante puede ver los celulares)
router.get('/', controller.getAll);        
router.get('/:id', controller.getById);    

// RUTAS PROTEGIDAS (Solo accesibles para Usuarios Autenticados AND con flag administrador = 1)
router.post('/', verificarToken, esAdministrador, controller.create);       
router.put('/:id', verificarToken, esAdministrador, controller.update);     
router.delete('/:id', verificarToken, esAdministrador, controller.remove);  

module.exports = router;