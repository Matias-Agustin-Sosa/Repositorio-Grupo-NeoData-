// src/controllers/productosController.js
const { Op } = require('sequelize'); 
const Producto = require('../models/Producto');
const { getPaginationParams } = require('../utils/pagination');
const sequelize = require('../config/database');

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
    // 📦 1. GUARDAR UN NUEVO PRODUCTO EN EL CATÁLOGO (Acción original del Admin)
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
                Descuento,
                Ruta_Imagen,
                validFrom: validFrom || new Date(),
                validTo: validTo || new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            });

            return res.status(201).json({ mensaje: "Producto añadido con éxito al catálogo.", producto: nuevoProducto });
        } catch (error) {
            console.error("Error al crear producto:", error);
            return res.status(500).json({ error: "Error al procesar la creación del producto." });
        }
    },

    // 🛒 2. PROCESAR LA COMPRA DEL CARRITO (Factura + Detalle + Descontar Stock)
    checkout: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { medioPago, items } = req.body;
            const idUsuario = req.usuario.id; 
            const fechaActual = new Date();

            if (!items || items.length === 0) {
                return res.status(400).json({ error: "El carrito no tiene productos." });
            }

            // Inserción en la tabla factura
            const [facturaResultado] = await sequelize.query(
                `INSERT INTO factura (Fecha, ID_usuario, ID_MedioPago) VALUES (?, ?, ?)`,
                { replacements: [fechaActual, idUsuario, medioPago], transaction: t }
            );
            
            const idFacturaGenerada = facturaResultado;
            const primerProductoId = items[0].id;

            // Formatear ID_Producto_Cantidad (Ej: "3,3,4")
            let listaIdsRepetidos = [];
            items.forEach(item => {
                for (let i = 0; i < item.cantidad; i++) {
                    listaIdsRepetidos.push(item.id);
                }
            });
            const cadenaProductoCantidad = listaIdsRepetidos.join(',');

            // Inserción en la tabla detalle
            await sequelize.query(
                `INSERT INTO detalle (ID_Factura, ID_Producto, ID_Producto_Cantidad) VALUES (?, ?, ?)`,
                { replacements: [idFacturaGenerada, primerProductoId, cadenaProductoCantidad], transaction: t }
            );

            // Descontar Stock
            for (const item of items) {
                await sequelize.query(
                    `UPDATE producto SET Stock = Stock - ? WHERE ID_Producto = ?`,
                    { replacements: [item.cantidad, item.id], transaction: t }
                );
            }

            await t.commit();
            return res.status(201).json({ 
                mensaje: `Compra efectuada con éxito. Factura Nº ${idFacturaGenerada} emitida.`,
                idFactura: idFacturaGenerada
            });

        } catch (error) {
            await t.rollback();
            console.error("❌ ERROR EN CHECKOUT CRÍTICO:", error);
            return res.status(500).json({ error: "Error al registrar la factura en la base de datos." });
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