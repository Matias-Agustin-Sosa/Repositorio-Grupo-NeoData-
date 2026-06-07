require('dotenv').config(); // Cargamos las variables de entorno al inicio de todo
const express = require('express');
const path = require('path');
const app = express();

const sequelize = require('./src/config/database'); // Conexión a MySQL
const productosRouter = require('./src/routes/productosRoutes');

// Configuraciones del Servidor
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('Image'));
app.use(express.json()); // Middleware traductor de JSON

// Buscá la sección de la ruta raíz '/' en tu server.js y reemplazala por esta:
app.get('/', async (req, res) => {
    try {
        const Producto = require('./src/models/Producto');
        const listaDesdeDB = await Producto.findAll(); // Equivale a SELECT * FROM producto
        
        // Mapeamos los datos de MySQL directo a las propiedades que requiere tu Frontend
        const listaProductos = listaDesdeDB.map(p => {
            return {
                nombre: p.Nombre,
                precio: p.Precio,
                stock: p.Stock,
                descuento: p.Descuento ? `${p.Descuento}% OFF` : "0% OFF", 
                imagen: p.Ruta_Imagen ? p.Ruta_Imagen : "/default.png" 
            };
        });

        res.render('index', { productos: listaProductos }); 
    } catch (error) {
        console.error("Error al renderizar el catálogo:", error);
        res.status(500).send("Error al cargar el catálogo desde neodatashop.");
    }
});

// VINCULACIÓN DE RUTAS DE LA API
app.use('/api/productos', productosRouter);

// SINCRONIZACIÓN CON MYSQL Y ENCENDIDO DEL MOTOR
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }) // 'force: false' evita borrar y recrear las tablas cada vez que guardás cambios en el código
    .then(() => {
        console.log('🔌 Base de datos MySQL conectada y sincronizada con éxito');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor NeoData Shop corriendo en: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error crítico de conexión a MySQL:', err);
    });