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

app.use(express.static('Image'));

app.get("/", function(rec, res){
    res.render("index");
})

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});