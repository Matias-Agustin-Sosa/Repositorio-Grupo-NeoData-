const Usuario = require('../models/Usuario');

const usuariosController = {
    getAll: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll(); 
            return res.json(usuarios);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al obtener la lista de usuarios." });
        }
    },

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

    remove: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);
            if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

            const nuevoEstado = usuario.Activo === 0 ? 1 : 0;
            
            await usuario.update({ Activo: nuevoEstado });
            
            const accion = nuevoEstado === 1 ? "habilitado" : "deshabilitado";
            return res.json({ mensaje: `Usuario ${accion} con éxito.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al procesar el estado del usuario." });
        }
    }
};

module.exports = usuariosController;