// src/controllers/productosController.js
const { Op } = require('sequelize'); 
const Producto = require('../models/Producto');
const { getPaginationParams } = require('../utils/pagination'); // 🆕 Importamos la utilidad que calcula limit y offset

const productosController = {
    
    // 1. MODIFICADO PARA LA CLASE 11 (Reemplaza solo este método)
    getAll: async (req, res) => {
        try {
            const { categoria } = req.query;
            const today = new Date();

            // 🆕 Calculamos los parámetros matemáticos del query string (?page=X)
            const { limit, offset, page } = getPaginationParams(req.query, 4); // Traemos de a 4 productos

            const whereCondition = {};

            // Lógica de vigencia temporal (Clase 9)
            whereCondition.validFrom = { [Op.lte]: today };
            whereCondition.validTo = { [Op.gte]: today };

            // Filtrado por categoría si viene en la URL (Clase 9)
            if (categoria) {
                whereCondition.Category = categoria;
            }

            // 🆕 Usamos findAndCountAll en lugar de findAll para saber el total de productos en tu MySQL
            const { count, rows: productos } = await Producto.findAndCountAll({ 
                where: whereCondition,
                limit: limit,   // Cantidad a traer (4)
                offset: offset  // Cantidad a saltearse
            });

            // 🆕 Devolvemos la estructura con los metadatos que pide la guía
            return res.json({
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                itemsPerPage: limit,
                productos: productos // El arreglo con los 4 productos de esta página
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al obtener los productos." });
        }
    },

    // 2. SE MANTIENE IGUAL
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

    // 3. SE MANTIENE IGUAL
    create: async (req, res) => {
        try {
            const carrito = req.body;
            return res.status(201).json({ mensaje: "Checkout/Producto procesado con éxito." });
        } catch (error) {
            return res.status(500).json({ error: "Error al procesar la solicitud." });
        }
    },

    // 4. SE MANTIENE IGUAL
    update: async (req, res) => {
        try {
            const { id } = req.params;
            return res.json({ mensaje: "Producto actualizado con éxito." });
        } catch (error) {
            return res.status(500).json({ error: "Error al actualizar." });
        }
    },

    // 5. SE MANTIENE IGUAL
    remove: async (req, res) => {
        try {
            const { id } = req.params;
            return res.json({ mensaje: "Producto eliminado." });
        } catch (error) {
            return res.status(500).json({ error: "Error al eliminar." });
        }
    }
};

module.exports = productosController;