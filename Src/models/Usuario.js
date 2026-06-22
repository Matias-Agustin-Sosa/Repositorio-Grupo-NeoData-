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
    Email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    Password: { type: DataTypes.STRING(255), allowNull: false },
    // 🆕 Tu campo modificado: stores 1 (True) or 0 (False)
    administrador: { 
        type: DataTypes.INTEGER,
        defaultValue: 0 
    }
}, {
    tableName: 'usuario', // Nombre físico de tu tabla en el DER
    timestamps: false
});

module.exports = Usuario;