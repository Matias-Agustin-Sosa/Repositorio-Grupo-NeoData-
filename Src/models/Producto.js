const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
    ID_Producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: { type: DataTypes.STRING(100), allowNull: false },
    Marca: { type: DataTypes.STRING(100), allowNull: false },
    Category: { type: DataTypes.STRING(100), allowNull: false },
    Precio: { type: DataTypes.DECIMAL(60, 0), allowNull: false },
    Stock: { type: DataTypes.INTEGER, allowNull: false },
    Garanty: { type: DataTypes.INTEGER, allowNull: false }, // 🌟 ASEGÚRATE DE QUE ESTÉ ASÍ (INTEGER)
    Descuento: { type: DataTypes.INTEGER, allowNull: false },
    Ruta_Imagen: { type: DataTypes.STRING(80), allowNull: false },
    Habilitado: { type: DataTypes.TINYINT, defaultValue: 1 }
}, {
    tableName: 'producto',
    timestamps: false
});

module.exports = Producto;