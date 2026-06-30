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

            whereCondition.validFrom = { [Op.lte]: today };
            whereCondition.validTo = { [Op.gte]: today };

            if (categoria) {
                whereCondition.Category = categoria;
            }

            const esAdmin = req.usuario && Number(req.usuario.administrador) === 1;

            if (!esAdmin) {
                whereCondition.Habilitado = 1;
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

    create: async (req, res) => {
        try {
            const { Nombre, Marca, Category, Precio, Stock, Garanty, Descuento, Ruta_Imagen } = req.body;

            const nuevoProducto = await Producto.create({
                Nombre,
                Marca,
                Category,
                Precio: parseFloat(Precio),
                Stock: parseInt(Stock),
                Garanty: parseInt(Garanty),
                Descuento: parseInt(Descuento),
                Ruta_Imagen,
                Habilitado: 1
            });

            return res.status(201).json({ 
                mensaje: "¡Producto creado con éxito en NeoData Shop!", 
                producto: nuevoProducto 
            });
        } catch (error) {
            console.error("❌ Error al crear producto:", error);
            return res.status(500).json({ error: "Error interno en el servidor al intentar registrar el producto." });
        }
    },
    
    checkout: async (req, res) => {
        let t;
        try {
            const productos = Array.isArray(req.body.productos) ? req.body.productos : req.body.items;
            const medioPago = Number(req.body.ID_MedioPago ?? req.body.medioPago);
            const cuponIngresado = req.body.ID_Cupon ?? req.body.cupon ?? "";
            const idUsuario = req.usuario.id; 
            const fechaActual = new Date();

            if (!Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ error: "El carrito no tiene productos." });
            }

            if (!Number.isInteger(medioPago) || medioPago <= 0) {
                return res.status(400).json({ error: "El medio de pago no es valido." });
            }

            const cuponNormalizado = typeof cuponIngresado === 'string' ? cuponIngresado.trim() : cuponIngresado;
            const idCupon = cuponNormalizado === "" || cuponNormalizado === null ? 0 : Number(cuponNormalizado);
            if (![0, 1, 2].includes(idCupon)) {
                return res.status(400).json({ error: "Cupon Invalido" });
            }

            const descuentoCupon = idCupon === 1 ? 20 : idCupon === 2 ? 15 : null;

            const items = productos.map(item => ({
                id: Number(item.ID_Producto ?? item.id),
                cantidad: Number(item.Cantidad ?? item.cantidad)
            }));

            const tieneItemInvalido = items.some(item =>
                !Number.isInteger(item.id) || item.id <= 0 ||
                !Number.isInteger(item.cantidad) || item.cantidad <= 0
            );

            if (tieneItemInvalido) {
                return res.status(400).json({ error: "Los productos del carrito no son validos." });
            }

            t = await sequelize.transaction();


            const [facturaResultado, facturaMetadata] = await sequelize.query(
                `INSERT INTO factura (Fecha, ID_usuario, ID_MedioPago) VALUES (?, ?, ?)`,
                { replacements: [fechaActual, idUsuario, medioPago], transaction: t }
            );
            
            const idFacturaGenerada = facturaResultado?.insertId || facturaMetadata?.insertId || facturaResultado;
            const primerProductoId = items[0].id;
            let totalCompra = 0;
            let totalSinDescuentos = 0;

            let listaIdsRepetidos = [];
            for (const item of items) {
                const producto = await Producto.findByPk(item.id, { transaction: t });
                if (!producto) {
                    await t.rollback();
                    return res.status(404).json({ error: `Producto ${item.id} no encontrado.` });
                }

                if (producto.Stock < item.cantidad) {
                    await t.rollback();
                    return res.status(400).json({ error: `No hay stock suficiente para ${producto.Nombre}.` });
                }

                const subtotalSinDescuento = Number(producto.Precio) * item.cantidad;
                totalSinDescuentos += subtotalSinDescuento;

                if (descuentoCupon === null) {
                    totalCompra += subtotalSinDescuento * (1 - Number(producto.Descuento || 0) / 100);
                }

                for (let i = 0; i < item.cantidad; i++) {
                    listaIdsRepetidos.push(item.id);
                }
            }

            if (descuentoCupon !== null) {
                totalCompra = totalSinDescuentos * (1 - descuentoCupon / 100);
            }

            const cadenaProductoCantidad = listaIdsRepetidos.join(',');

            if (idCupon === 0) {
                await sequelize.query(
                    `SET SESSION sql_mode = IF(@@sql_mode LIKE '%NO_AUTO_VALUE_ON_ZERO%', @@sql_mode, IF(@@sql_mode = '', 'NO_AUTO_VALUE_ON_ZERO', CONCAT(@@sql_mode, ',NO_AUTO_VALUE_ON_ZERO')))`,
                    { transaction: t }
                );
                await sequelize.query(
                    `INSERT IGNORE INTO Cupon (ID_Cupon, Descuento, Tipo) VALUES (?, ?, ?)`,
                    { replacements: [0, 0, 'Sin cupon'], transaction: t }
                );
            }

            await sequelize.query(
                `INSERT INTO detalle (ID_Factura, ID_Producto, ID_Producto_Cantidad, ID_Cupon) VALUES (?, ?, ?, ?)`,
                { replacements: [idFacturaGenerada, primerProductoId, cadenaProductoCantidad, idCupon], transaction: t }
            );


            for (const item of items) {
                await sequelize.query(
                    `UPDATE producto SET Stock = Stock - ? WHERE ID_Producto = ?`,
                    { replacements: [item.cantidad, item.id], transaction: t }
                );
            }

            await t.commit();
            return res.status(201).json({ 
                mensaje: `Compra efectuada con éxito. Factura Nº ${idFacturaGenerada} emitida.`,
                idFactura: idFacturaGenerada,
                id_factura: idFacturaGenerada,
                total: Math.round(totalCompra)
            });

        } catch (error) {
            if (t && !t.finished) await t.rollback();
            console.error("❌ ERROR EN CHECKOUT CRÍTICO:", error);
            return res.status(500).json({ error: "Error al registrar la factura en la base de datos." });
        }
    },

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

    remove: async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);
            if (!producto) return res.status(404).json({ error: "Producto no encontrado." });


            const nuevoEstado = producto.Habilitado === 0 ? 1 : 0;
            await producto.update({ Habilitado: nuevoEstado });

            const accion = nuevoEstado === 1 ? "habilitado" : "deshabilitado";
            return res.json({ mensaje: `Producto ${accion} con éxito en la base de datos.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al cambiar el estado del producto." });
        }
    },
};

module.exports = productosController;
