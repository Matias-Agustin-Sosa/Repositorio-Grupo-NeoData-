// npm install cors
require('dotenv').config(); // Carga la caja fuerte de las variables de entorno (.env) 
const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./src/config/database'); // Conexión de Sequelize a MySQL
const productosRouter = require('./src/routes/productosRoutes'); // Router de la API 

const app = express();

// ==========================================
//           MIDDLEWARES GLOBAL
// ==========================================
app.use(cors()); // 🆕 Permite que tu JavaScript del Frontend haga fetch a este servidor sin bloqueos de seguridad
app.use(express.json()); // Traductor para que el servidor entienda peticiones JSON (como el checkout) 
app.use(express.static(path.join(__dirname, 'public'))); // Servidor de archivos estáticos (CSS, JS, imágenes)
app.use(express.static('Image'));

// Configuración del motor de plantillas para renderizar la página inicial
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
//                 RUTAS
// ==========================================

/**
 * RUTA FRONTEND: Carga la estructura básica de la página.
 * Siguiendo la Guía 8, esta ruta ya no consulta la base de datos aquí adentro,
 * simplemente envía el archivo HTML/EJS vacío y deja que el JS del navegador haga el trabajo.
 */
app.get('/', (req, res) => {
    res.render('index'); 
});

/**
 * RUTAS DE LA API (ENDPOINT RESTful):
 * Aquí cuelgan tus métodos GET, POST, PUT y DELETE en /api/productos.
 * El controlador asociado es el encargado de interactuar de forma asíncrona con tu tabla 'producto'.
 */
app.use('/api/productos', productosRouter); // 

// ==========================================
//      SINCRONIZACIÓN Y ARRANQUE (MYSQL)
// ==========================================
const PORT = process.env.PORT || 3000; // Lee el puerto del .env o usa el 3000 por defecto 

// Sincroniza los modelos con las tablas de MySQL Workbench
sequelize.sync({ force: false }) // force: false evita que se borren tus productos reales al reiniciar 
    .then(() => {
        console.log('🔌 Base de datos MySQL (neodatashop) conectada y sincronizada'); // 
        app.listen(PORT, () => {
            console.log(`🚀 Servidor de NeoData Shop corriendo en: http://localhost:${PORT}`); // 
        });
    })
    .catch((err) => {
        console.error('❌ Error crítico de conexión a MySQL:', err); // 
    });