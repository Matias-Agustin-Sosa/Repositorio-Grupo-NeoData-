// src/routes/reportesRoutes.js
const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// Ruta de estadísticas
router.get('/dashboard', reportesController.getDashboardStats);

// 🆕 Ruta de descarga que faltaba (mapea con /api/reportes/productos)
router.get('/productos', reportesController.exportarProductosCSV);

module.exports = router;