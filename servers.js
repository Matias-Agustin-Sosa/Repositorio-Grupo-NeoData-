// Inicializar el proyecto: npm init -y
// Instalar dependencias: npm install express ejs

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// CONFIGURACIÓN DE EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
app.use(express.static('Image'));

// MIDDLEWARE: Permite que Express entienda el "body" en formato JSON
app.use(express.json());  

// Base de datos simulada en memoria
const listaProductos = [
    { nombre: "Smartwatch", precio: 125000, stock: 12, descuento: "5%", imagen: "/Smartwatch.png"},
    { nombre: "Celular", precio: 350000, stock: 8, descuento: "2%", imagen: "/Celular.png"},
    { nombre: "Auriculares", precio: 45000, stock: 20, descuento: "7%", imagen: "/Auriculares.png"},
    { nombre: "Mouse", precio: 25000, stock: 15, descuento: "3%", imagen: "/Mouse.png"}
];

// ==========================================
// 1. RUTA PARA NAVEGAR (FRONTEND)
// ==========================================
// Cuando entrás a http://localhost:3000/ se renderiza la interfaz principal
app.get('/', (req, res) => {
    res.render('index', { productos: listaProductos }); 
});

// ==========================================
// 2. ENDPOINT DE LA API (BACKEND - POST) 
// ==========================================
// Aquí es donde el botón "Iniciar Pago" enviará el carrito usando Fetch
app.post('/api/checkout', (req, res) => {
    const carritoRecibido = req.body;
    
    console.log("¡NUEVA COMPRA RECIBIDA EN EL SERVIDOR!");
    console.log(carritoRecibido);
    
    res.json({ mensaje: "Ticket generado con éxito, gracias por su compra" });
});

// INICIAR SERVIDOR
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});