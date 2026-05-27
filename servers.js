const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Importamos el controlador y el router que creamos con la lógica MVC
const productosController = require('./src/controllers/productosController');
const productosRouter = require('./src/routes/productosRoutes');

// CONFIGURACIÓN DE EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
app.use(express.static('Image'));

// MIDDLEWARE: Permite que Express entienda el "body" en formato JSON
app.use(express.json());  

// ==========================================
// 1. RUTA PARA NAVEGAR (FRONTEND)
// ==========================================
// Mantenemos tu ruta '/' igual, pero trayendo tu listaProductos desde el controlador
app.get('/', (req, res) => {
    res.render('index', { productos: productosController.listaProductos }); 
});

// ==========================================
// 2. ENDPOINT DE LA API (VINCULACIÓN DEL ROUTER)
// ==========================================
// Siguiendo el estándar RESTful, todo lo que esté en productosRouter colgará de /api/productos
app.use('/api/productos', productosRouter);

// INICIAR SERVIDOR
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});