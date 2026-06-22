const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login -> Para iniciar sesión y obtener el JWT
router.post('/login', authController.login);

module.exports = router;