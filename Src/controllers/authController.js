// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario'); 

const authController = {
    // ==========================================
    // 1. LOGIN DE USUARIOS
    // ==========================================
    login: async (req, res) => {
        const { email, password } = req.body;
        try {

            const usuario = await Usuario.findOne({ where: { Email: email } });
            
            if (!usuario || usuario.Password !== password) {
                return res.status(401).json({ error: "Credenciales incorrectas." });
            }


            if (usuario.Activo === 0) {
                return res.status(403).json({ error: "Cuenta inhabilitada. Por favor, contacte al administrador." });
            }


            const token = jwt.sign(
                { id: usuario.ID_Usuario, administrador: usuario.administrador }, 
                process.env.JWT_SECRET || 'secret_key_temporal', 
                { expiresIn: '1h' }
            );

            return res.status(200).json({ 
                mensaje: "Login exitoso", 
                token, 
                usuario: { nombre: usuario.Nombre, administrador: usuario.administrador } 
            });

        } catch (error) {
            console.error("❌ Error en Login:", error);
            return res.status(500).json({ error: "Error en el servidor al intentar loguearse." });
        }
    },

    // ==========================================
    // 2. REGISTRO DE USUARIOS
    // ==========================================
    register: async (req, res) => {
        try {
            const { nombre, apellido, dni, email, password } = req.body;


            const existe = await Usuario.findOne({ where: { Email: email } });
            if (existe) {
                return res.status(400).json({ error: "El correo electrónico ya está registrado." });
            }


            const nuevoUsuario = await Usuario.create({
                Nombre: nombre,
                Apellido: apellido,
                DNI: dni,          
                Email: email,
                Password: password, 
                administrador: 0
            });

            return res.status(201).json({ 
                mensaje: "Usuario registrado con éxito.", 
                id: nuevoUsuario.ID_Usuario 
            });

        } catch (error) {
            console.error("❌ ERROR EN REGISTER:", error);
            return res.status(500).json({ error: "Error al registrar el usuario: " + error.message });
        }
    }
};

module.exports = authController;