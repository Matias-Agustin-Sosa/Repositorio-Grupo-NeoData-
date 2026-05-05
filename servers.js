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

// USAR LA CARPETA IMAGEN DE MANERA MAS CORRECTA
app.use(express.static('Image'));
app.use(express.json());  

app.get("/", function(rec, res){
    res.render("index");
})

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


// Simulamos una base de datos en memoria 
const productosDB = [ 
{ id: 1, nombre: "Teclado Mecánico", precio: 50000, img: 
"[https://via.placeholder.com/150](https://via.placeholder.com/150)", descuento: true }, 
{ id: 2, nombre: "Mouse Gamer", precio: 25000, img: 
"[https://via.placeholder.com/150](https://via.placeholder.com/150)", descuento: false }, 
{ id: 3, nombre: "Monitor 24", precio: 180000, img: 
"[https://via.placeholder.com/150](https://via.placeholder.com/150)", descuento: true } 
]; 
app.get('/api/productos', (req, res) => { 
res.json(productosDB); // Enviamos el arreglo convertido a JSON 
}); 