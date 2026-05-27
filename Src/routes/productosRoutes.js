const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');

// El Router asocia el Verbo HTTP + la URL con la función del Controlador [cite: 275]

router.get('/', controller.getAll);        // GET /api/productos -> Trae todos [cite: 221, 276]
router.get('/:id', controller.getById);    // GET /api/productos/:id -> Trae uno por ID [cite: 221, 276]
router.post('/', controller.create);       // POST /api/productos -> Crea uno nuevo / Checkout [cite: 221, 276]
router.put('/:id', controller.update);     // PUT /api/productos/:id -> Modifica uno por ID [cite: 221, 277]
router.delete('/:id', controller.remove);  // DELETE /api/productos/:id -> Elimina uno por ID [cite: 229, 230, 277]

module.exports = router;