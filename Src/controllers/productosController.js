// src/controllers/productosController.js
const { Op } = require('sequelize'); 
const Producto = require('../models/Producto');
const { getPaginationParams } = require('../utils/pagination');

const productosController = {
    
    getAll: async (req, res) => {
        try {
            const { categoria } = req.query;
            const today = new Date();

            const { limit, offset, page } = getPaginationParams(req.query, 4);
            const whereCondition = {};

            // Removido temporalmente el filtro de vigencia estricta para que el admin pueda ver todo si lo desea,
            // o puedes mantenerlo si tus productos siempre tienen un rango válido.
            whereCondition.validFrom = { [Op.lte]: today };
            whereCondition.validTo = { [Op.gte]: today };

            if (categoria) {
                whereCondition.Category = categoria;
            }

            const { count, rows: productos } = await Producto.findAndCountAll({ 
                where: whereCondition,
                limit: limit,   
                offset: offset  
            });

            return res.json({
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                itemsPerPage: limit,
                productos: productos 
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al obtener los productos." });
        }
    },

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

    // 🆕 CREAR PRODUCTO (Real)
    create: async (req, res) => {
        try {
            const { Nombre, Marca, Category, Precio, Stock, Garanty, Descuento, Ruta_Imagen, validFrom, validTo } = req.body;
            
            const nuevoProducto = await Producto.create({
                Nombre,
                Marca,
                Category,
                Precio,
                Stock,
                Garanty,
                Descuento: Descuento || 0,
                Ruta_Imagen: Ruta_Imagen || '/default.png',
                validFrom: validFrom || new Date(), // Ajustar según requiera tu modelo
                validTo: validTo || new Date(new Date().setFullYear(new Date().getFullYear() + 1)) 
            });

            return res.status(201).json({ mensaje: "Producto creado con éxito.", producto: nuevoProducto });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al crear el producto." });
        }
    },

    // 🆕 ACTUALIZAR PRODUCTO (Real)
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { Nombre, Marca, Category, Precio, Stock, Garanty, Descuento, Ruta_Imagen } = req.body;
            
            const producto = await Producto.findByPk(id);
            if (!producto) return res.status(404).json({ error: "Producto no encontrado." });

            await producto.update({
                Nombre,
                Marca,
                Category,
                Precio,
                Stock,
                Garanty,
                Descuento,
                Ruta_Imagen
            });

            return res.json({ mensaje: "Producto actualizado con éxito.", producto });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al actualizar." });
        }
    },

    // 🆕 ELIMINAR PRODUCTO (Real)
    remove: async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);
            if (!producto) return res.status(404).json({ error: "Producto no encontrado." });

            await producto.destroy();
            return res.json({ mensaje: "Producto eliminado definitivamente de la base de datos." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al eliminar." });
        }
    }
};

module.exports = productosController;