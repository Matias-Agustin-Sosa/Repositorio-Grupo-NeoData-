const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/dashboard', verificarToken, esAdmin, reportesController.getDashboardStats);
router.get('/productos', verificarToken, esAdmin, reportesController.exportarProductosCSV);

module.exports = router;