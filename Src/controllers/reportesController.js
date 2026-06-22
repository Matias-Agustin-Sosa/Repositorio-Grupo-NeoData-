// src/controllers/reportesController.js
const Producto = require('../models/Producto'); // Asegurate de que el nombre del modelo coincida
const { fn, col } = require('sequelize');


const reportesController = {
    getDashboardStats: async (req, res) => {
        // ... (Tu código actual de estadísticas queda igual) ...
    },

    // 🆕 AGREGÁ ESTE NUEVO MÉTODO REQUERIDO POR EL BOTÓN:
    exportarProductosCSV: async (req, res) => {
        try {
            // 1. Traemos todos los productos de la base de datos
            const productos = await Producto.findAll();

            // 2. Creamos la cabecera del archivo CSV (Nombres de las columnas)
            let csvContent = "ID_Producto,Nombre,Precio,Stock,Category\n";

            // 3. Recorremos los productos y los sumamos fila por fila
            productos.forEach(prod => {
                // Limpiamos comas por las dudas para no romper el formato CSV
                const nombreLimpio = prod.Nombre.replace(/,/g, " "); 
                const categoriaLimpia = (prod.Category || "General").replace(/,/g, " ");

                csvContent += `${prod.ID_Producto},${nombreLimpio},${prod.Precio},${prod.Stock},${categoriaLimpia}\n`;
            });

            // 4. Configuramos las cabeceras HTTP para indicarle al navegador que es un archivo adjunto
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=neodata_shop_productos.csv');

            // 5. Enviamos el contenido de texto puro que se transformará en archivo
            return res.status(200).send(csvContent);

        } catch (error) {
            console.error("❌ Error al generar el CSV:", error);
            return res.status(500).json({ error: "Error al compilar el archivo de reporte." });
        }
    }
};

module.exports = reportesController;