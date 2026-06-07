const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
    ID_Producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'ID_Producto'
    },
    Nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Marca: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Category: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Precio: {
        type: DataTypes.DECIMAL(60, 0),
        allowNull: false,
        defaultValue: 0
    },
    Stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    Garanty: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Descuento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    
    Ruta_Imagen: {
        type: DataTypes.STRING(80),
        allowNull: true,
        field: 'Ruta_Imagen'
    }
}, {
    tableName: 'producto', 
    timestamps: false      
});

module.exports = Producto;