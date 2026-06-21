const jwt = require('jsonwebtoken');
// Nota: Aquí importarías tu modelo de Usuario según tu DER
const Usuario = require('../models/Usuario'); 

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Buscamos el usuario en tu base de datos neodatashop por su Email
            const usuario = await Usuario.findOne({ where: { Email: email } });

            // Validación básica de credenciales (en texto plano por ahora, como pide la guía)
            if (!usuario || usuario.Password !== password) {
                return res.status(401).json({ error: "Credenciales inválidas." });
            }

            // Creamos el Payload del JWT incluyendo tu flag modificada 'administrador'
            const userPayload = {
                id: usuario.ID_Usuario,
                email: usuario.Email,
                esAdmin: usuario.administrador // 1 o 0
            };

            // Firmamos el token con una clave secreta (usá tu .env en producción)
            const token = jwt.sign(userPayload, 'SECRET_KEY_NEODATA', { expiresIn: '1h' });

            // Devolvemos el token al cliente
            return res.json({ 
                mensaje: "Autenticación exitosa", 
                token 
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error en el servidor durante el login." });
        }
    }
};

module.exports = authController;