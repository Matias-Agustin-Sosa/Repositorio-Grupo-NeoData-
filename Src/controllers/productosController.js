// src/controllers/productosController.js
const { Op } = require('sequelize'); // Recordá importar Op si usás los filtros de la Clase 9
const Producto = require('../models/Producto');

const productosController = {
    
    // 1. Esta función DEBE llamarse getAll (es la de la línea 8 que daba el error)
    getAll: async (req, res) => {
        try {
            const { categoria } = req.query;
            const whereCondition = {};
            const today = new Date();

            // Lógica de vigencia temporal (Clase 9)
            whereCondition.validFrom = { [Op.lte]: today };
            whereCondition.validTo = { [Op.gte]: today };

            // Filtrado por categoría si viene en la URL
            if (categoria) {
                whereCondition.Category = categoria;
            }

            const productos = await Producto.findAll({ where: whereCondition });
            return res.json(productos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al obtener los productos." });
        }
    },

    // 2. Esta función DEBE llamarse getById
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);
            if (!producto) return res.status(404).json({ error: "Producto no encontrado." });
            return res.json(producto);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener el producto." });
        }
    },

    // 3. Esta función DEBE llamarse create (Tu proceso de Checkout / Creación)
    create: async (req, res) => {
        try {
            const carrito = req.body;
            // Aquí va tu lógica para restar stock o procesar el JSON del carrito
            return res.status(201).json({ mensaje: "Checkout/Producto procesado con éxito." });
        } catch (error) {
            return res.status(500).json({ error: "Error al procesar la solicitud." });
        }
    },

    // 4. Esta función DEBE llamarse update
    update: async (req, res) => {
        try {
            const { id } = req.params;
            // Lógica para actualizar mediante Sequelize
            return res.json({ mensaje: "Producto actualizado con éxito." });
        } catch (error) {
            return res.status(500).json({ error: "Error al actualizar." });
        }
    },

    // 5. Esta función DEBE llamarse remove
    remove: async (req, res) => {
        try {
            const { id } = req.params;
            // Lógica para eliminar (o dar baja lógica si corresponde)
            return res.json({ mensaje: "Producto eliminado." });
        } catch (error) {
            return res.status(500).json({ error: "Error al eliminar." });
        }
    }
};

// Esta es la línea que ya tenías y está perfecta
module.exports = productosController;