const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    ID_Usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: { type: DataTypes.STRING(100) },
    Apellido: { type: DataTypes.STRING(100) },
    DNI: { type: DataTypes.INTEGER, allowNull: false },
    Email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    Password: { type: DataTypes.STRING(255), allowNull: false },
    administrador: { 
        type: DataTypes.INTEGER,
        defaultValue: 0 
    },
    // 🌟 NUEVO CAMPO MAPEADO DE TU BD:
    Activo: {
        type: DataTypes.INTEGER,
        defaultValue: 1 // 1 = Habilitado, 0 = Deshabilitado
    }
}, {
    tableName: 'usuario', 
    timestamps: false
});

module.exports = Usuario;