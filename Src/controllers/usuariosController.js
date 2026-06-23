const Usuario = require('../models/Usuario');

const usuariosController = {
    // Listar todos los usuarios
    getAll: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll();
            return res.json(usuarios);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al obtener la lista de usuarios." });
        }
    },

    // Obtener un usuario por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });
            return res.json(usuario);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener el usuario." });
        }
    },

    // En src/controllers/usuariosController.js
    create: async (req, res) => {
        try {
            const { Nombre, Apellido, DNI, Email, Administrador, Password } = req.body;

            const existe = await Usuario.findOne({ where: { Email } });
            if (existe) return res.status(400).json({ error: "El correo electrónico ya está registrado." });

            const nuevoUsuario = await Usuario.create({
                Nombre,
                Apellido,
                DNI,
                Email,
                // 🌟 CORRECCIÓN: Asignamos el valor a la propiedad con minúscula 'administrador'
                administrador: parseInt(Administrador) || 0,
                Password 
            });

            return res.status(201).json({ mensaje: "Usuario creado con éxito.", usuario: nuevoUsuario });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al crear el usuario." });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { Nombre, Apellido, DNI, Email, Administrador, Password } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

            // 🌟 CORRECCIÓN: Usamos 'administrador' en minúscula para que Sequelize lo detecte
            const updateData = { Nombre, Apellido, DNI, Email, administrador: parseInt(Administrador) };
            
            if (Password && Password.trim() !== "") {
                updateData.Password = Password;
            }

            await usuario.update(updateData);
            return res.json({ mensaje: "Usuario actualizado con éxito.", usuario });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al actualizar el usuario." });
        }
    },

    // Eliminar un usuario
    remove: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

            await usuario.destroy();
            return res.json({ mensaje: "Usuario eliminado de la base de datos con éxito." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al eliminar el usuario." });
        }
    }
};

module.exports = usuariosController;