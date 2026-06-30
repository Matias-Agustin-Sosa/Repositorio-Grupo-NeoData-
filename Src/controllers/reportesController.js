const Producto = require('../models/Producto')
const { fn, col } = require('sequelize');


const reportesController = {
    getDashboardStats: async (req, res) => {
    },

    exportarProductosCSV: async (req, res) => {
        try {
            const productos = await Producto.findAll();

            let csvContent = "ID_Producto,Nombre,Precio,Stock,Category\n";

            productos.forEach(prod => {
                const nombreLimpio = prod.Nombre.replace(/,/g, " "); 
                const categoriaLimpia = (prod.Category || "General").replace(/,/g, " ");

                csvContent += `${prod.ID_Producto},${nombreLimpio},${prod.Precio},${prod.Stock},${categoriaLimpia}\n`;
            });

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=neodata_shop_productos.csv');

            return res.status(200).send(csvContent);

        } catch (error) {
            console.error("❌ Error al generar el CSV:", error);
            return res.status(500).json({ error: "Error al compilar el archivo de reporte." });
        }
    }
};

module.exports = reportesController;