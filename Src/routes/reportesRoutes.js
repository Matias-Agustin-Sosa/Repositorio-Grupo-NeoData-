// src/routes/reportesRoutes.js
const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// 🆕 Importamos nuestro middleware protector
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

// 🛡️ Aplicamos la protección: primero verifica el token, después si es admin, y recién ahí da el reporte
router.get('/dashboard', verificarToken, esAdmin, reportesController.getDashboardStats);
router.get('/productos', verificarToken, esAdmin, reportesController.exportarProductosCSV);

module.exports = router;