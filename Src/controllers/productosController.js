const Producto = require('../models/Producto');

const productosController = {
    // 1. GET -> Trae todos los productos de neodatashop
    getAll: async (req, res) => {
    try {
        const productos = await Producto.findAll(); 
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar la base de datos" });
    }
},

    // 2. GET -> Busca por la Primary Key específica (ID_Producto)
    getById: async (req, res) => {
        try {
            // Pasamos el ID que viene de la URL (req.params.id)
            const producto = await Producto.findByPk(req.params.id); 
            if (producto) {
                res.json(producto);
            } else {
                res.status(404).json({ error: "Producto no encontrado en neodatashop" });
            }
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    },

    // 3. POST -> Crea un producto o procesa el Checkout
    create: async (req, res) => {
        try {
            const entrada = req.body;

            // Mantenemos el flujo del botón "Iniciar Pago" del Frontend
            if (Array.isArray(entrada)) {
                console.log("🛒 Carrito recibido para checkout:", entrada);
                return res.json({ mensaje: "Ticket generado con éxito, gracias por su compra" });
            }

            // Para crear un producto individual (el Admin), los datos del body deben coincidir 
            // con las mayúsculas: { Nombre: "Celular", Precio: 350000, Stock: 8, ... }
            const nuevoProducto = await Producto.create(entrada);
            res.status(201).json({ mensaje: "Creado con éxito", producto: nuevoProducto });
        } catch (error) {
            res.status(400).json({ error: "Datos inválidos o estructuralmente incorrectos" });
        }
    },

    // 4. PUT -> Actualiza usando el identificador correcto
    update: async (req, res) => {
        try {
            
            const [actualizado] = await Producto.update(req.body, {
                where: { ID_Producto: req.params.id } 
            });

            if (actualizado) {
                res.json({ mensaje: "Producto actualizado correctamente en MySQL" });
            } else {
                res.status(404).json({ error: "No se encontró el producto a actualizar" });
            }
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar" });
        }
    },

    // 5. DELETE -> Elimina usando el identificador correcto
    remove: async (req, res) => {
        try {
            
            const borrados = await Producto.destroy({
                where: { ID_Producto: req.params.id } 
            });

            if (borrados > 0) {
                res.json({ mensaje: "Producto eliminado correctamente" });
            } else {
                res.status(404).json({ error: "El producto no existe" });
            }
        } catch (error) {
            res.status(500).json({ error: "Error al intentar eliminar" });
        }
    }
};

module.exports = productosController;