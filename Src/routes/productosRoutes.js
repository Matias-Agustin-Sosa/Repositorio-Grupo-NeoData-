const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');

// El Router asocia el Verbo HTTP + la URL con la función del Controlador

router.get('/', controller.getAll);        // GET /api/productos -> Trae todos
router.get('/:id', controller.getById);    // GET /api/productos/:id -> Trae uno por ID
router.post('/', controller.create);       // POST /api/productos -> Crea uno nuevo / Checkout
router.put('/:id', controller.update);     // PUT /api/productos/:id -> Modifica uno por ID
router.delete('/:id', controller.remove);  // DELETE /api/productos/:id -> Elimina uno por ID

module.exports = router;