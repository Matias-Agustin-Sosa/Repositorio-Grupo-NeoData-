// npm install sequelize mysql2 dotenv

const { Sequelize } = require('sequelize');
require('dotenv').config(); // Abre y lee las variables del archivo .env

// Configuración de la conexión apuntando a MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME,     // Nombre de la BD
    process.env.DB_USER,     // Usuario
    process.env.DB_PASSWORD, // Tu contraseña
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT, // Especificamos 'mysql'
        logging: false // Evita llenar la consola con logs de SQL innecesarios
    }
);

module.exports = sequelize;