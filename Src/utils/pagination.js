// src/utils/pagination.js

/**
 * Procesa los parámetros de paginación de la URL y calcula el limit y offset para Sequelize.
 * @param {Object} query - El objeto req.query de Express
 * @param {number} defaultLimit - Cantidad de productos por página por defecto (ej: 4)
 * @returns {Object} Un objeto con el límite, el offset y la página actual parseada
 */
const getPaginationParams = (query, defaultLimit = 4) => {
    const page = parseInt(query.page, 10) || 1; // Si no viene página, por defecto es la 1
    const limit = parseInt(query.limit, 10) || defaultLimit; // Cuántos elementos traer
    
    // Matemática de la paginación: si estoy en la página 2 con límite 4, me salteo los primeros 4 (2-1 * 4 = 4) 
    const offset = (page - 1) * limit;

    return {
        limit,
        offset,
        page
    };
};

module.exports = { getPaginationParams };