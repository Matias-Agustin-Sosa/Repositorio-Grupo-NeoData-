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
            // Buscamos el usuario por Email
            const usuario = await Usuario.findOne({ where: { Email: email } });
            
            if (!usuario || usuario.Password !== password) {
                return res.status(401).json({ error: "Credenciales incorrectas." });
            }

            // Generamos el token con la clave unificada
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

            // Verificamos si el email ya existe en la BD
            const existe = await Usuario.findOne({ where: { Email: email } });
            if (existe) {
                return res.status(400).json({ error: "El correo electrónico ya está registrado." });
            }

            // Creamos el usuario en MySQL usando Sequelize
            const nuevoUsuario = await Usuario.create({
                Nombre: nombre,
                Apellido: apellido,
                DNI: dni,          
                Email: email,
                Password: password, 
                administrador: 0    // Cliente por defecto
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

// 💡 Exportamos el objeto único COMPLETO
module.exports = authController;