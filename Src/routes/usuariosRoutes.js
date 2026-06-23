const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuariosController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas de usuarios requieren Token y Rol de Administrador
router.get('/', verificarToken, esAdmin, controller.getAll);
router.get('/:id', verificarToken, esAdmin, controller.getById);
router.post('/', verificarToken, esAdmin, controller.create);
router.put('/:id', verificarToken, esAdmin, controller.update);
router.delete('/:id', verificarToken, esAdmin, controller.remove);

module.exports = router;