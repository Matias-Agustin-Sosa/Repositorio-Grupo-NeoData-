// Inicializar el proyecto (package.json) -- npm init -y
// Instalar Express -- npm install express
// Instalar EJS -- npm install ejs

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// CONFIGURACIÓN DE EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
app.use(express.static('Image'));

// MIDDLEWARE: Permite que el servidor entienda los datos en formato JSON en los POST
app.use(express.json());  

// Base de datos simulada en memoria (Disponible para todas las rutas)
const listaProductos = [
    { nombre: "Smartwatch", precio: 125000, stock: 12, descuento: "5%", imagen: "/Producto.png"},
    { nombre: "Celular", precio: 350000, stock: 8, descuento: "2%", imagen: "/Producto.png"},
    { nombre: "Auriculares", precio: 45000, stock: 20, descuento: "7%", imagen: "/Producto.png"},
    { nombre: "Mouse", precio: 25000, stock: 15, descuento: "3%", imagen: "/Producto.png"}
];

// ==========================================
// 1. RUTA PARA NAVEGAR (FRONTEND)
// ==========================================
// Cuando el usuario entra a http://localhost:3000/ ve la interfaz hecha en EJS
app.get('/', (req, res) => {
    res.render('index', { productos: listaProductos }); 
});

// ==========================================
// 2. ENDPOINT DE LA API (BACKEND - POST)
// ==========================================
// Aquí es donde el botón "Iniciar Pago" del Modal enviará el carrito mediante Fetch
app.post('/api/checkout', (req, res) => {
    const carritoRecibido = req.body; // Aquí viene la info desde el Frontend
    
    console.log("¡NUEVA COMPRA RECIBIDA EN EL SERVIDOR!");
    console.log(carritoRecibido); // Verás el desglose en la consola de VS Code
    
    // Respondemos al cliente con un objeto JSON
    res.json({ mensaje: "Ticket generado con éxito, gracias por su compra" });
});


// INICIAR SERVIDOR
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});