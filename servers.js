require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./src/config/database');
const productosRouter = require('./src/routes/productosRoutes'); 
const authRoutes = require('./src/routes/authRoutes');
const reportesRouter = require('./src/routes/reportesRoutes');
const usuariosRouter = require('./src/routes/usuariosRoutes');

const app = express();

// ==========================================
// 💡 MIDDLEWARES GLOBAL (PUESTOS ARRIBA DE LAS RUTAS)
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('Image'));

// ==========================================
// 🔌 DECLARACIÓN DE RUTAS (DESPUÉS DE LOS MIDDLEWARES)
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRouter); 
app.use('/api/reportes', reportesRouter);
app.use('/api/usuarios', usuariosRouter);
app.get('/usuarios', (req, res) => {
    res.render('usuarios');
});
// Configuración del motor de plantillas para renderizar la página inicial
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * RUTA FRONTEND: Carga la estructura básica de la página.
 */
app.get('/', (req, res) => {
    res.render('index'); 
});

// ==========================================
//       SINCRONIZACIÓN Y ARRANQUE (MYSQL)
// ==========================================
const PORT = process.env.PORT || 3000; 

sequelize.sync({ force: false }) 
    .then(() => {
        console.log('🔌 Base de datos MySQL (neodatashop) conectada y sincronizada'); 
        app.listen(PORT, () => {
            console.log(`🚀 Servidor de NeoData Shop corriendo en: http://localhost:${PORT}`); 
        });
    })
    .catch((err) => {
        console.error('❌ Error crítico de conexión a MySQL:', err); 
    });