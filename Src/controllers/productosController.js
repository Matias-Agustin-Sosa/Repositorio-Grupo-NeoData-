// Base de datos simulada en memoria (Tu arreglo real, ahora con un ID para poder buscar/modificar)
let listaProductos = [
    { id: 1, nombre: "Smartwatch", precio: 125000, stock: 12, descuento: "5%", imagen: "/Smartwatch.png"},
    { id: 2, nombre: "Celular", precio: 350000, stock: 8, descuento: "2%", imagen: "/Celular.png"},
    { id: 3, nombre: "Auriculares", precio: 45000, stock: 20, descuento: "7%", imagen: "/Auriculares.png"},
    { id: 4, nombre: "Mouse", precio: 25000, stock: 15, descuento: "3%", imagen: "/Mouse.png"}
];

const productosController = {
    // 1. GET -> Trae la colección completa (Catálogo) [cite: 221, 276]
    getAll: (req, res) => {
        res.json(listaProductos); // [cite: 289]
    },

    // 2. GET -> Busca un producto específico por su ID [cite: 221, 276]
    getById: (req, res) => {
        const idBuscado = parseInt(req.params.id); // Capturamos el :id de la URL [cite: 299, 337]
        const encontrado = listaProductos.find(p => p.id === idBuscado); // 
        
        if (encontrado) {
            res.json(encontrado); // [cite: 301]
        } else {
            res.status(404).json({ error: "Producto no encontrado" }); // [cite: 301]
        }
    },

    // 3. POST -> Crea un nuevo producto (o procesa el checkout) [cite: 221, 276]
    create: (req, res) => {
        const nuevoProducto = req.body; // Capturamos los datos que vienen en el body [cite: 303]
        
        // Si el body es el carrito del checkout (un arreglo), procesamos la compra como antes
        if (Array.isArray(nuevoProducto)) {
            console.log("¡NUEVA COMPRA RECIBIDA EN EL SERVIDOR!");
            console.log(nuevoProducto);
            return res.json({ mensaje: "Ticket generado con éxito, gracias por su compra" });
        }
        
        // Si no es un arreglo, asumimos que el Admin está agregando un producto al catálogo [cite: 221]
        // Le asignamos un ID dinámico sumando 1 al último ID existente
        nuevoProducto.id = listaProductos.length > 0 ? listaProductos[listaProductos.length - 1].id + 1 : 1;
        listaProductos.push(nuevoProducto); // Lo agregamos al array [cite: 166, 304]
        
        res.status(201).json({ mensaje: "Creado con éxito", producto: nuevoProducto }); // [cite: 305]
    },

    // 4. PUT -> Busca un producto por ID y actualiza sus datos [cite: 167, 221, 277]
    update: (req, res) => {
        const idBuscado = parseInt(req.params.id); // 
        const datosActualizados = req.body;
        const indice = listaProductos.findIndex(p => p.id === idBuscado);

        if (indice !== -1) {
            // Reemplazamos los datos viejos manteniendo el mismo ID
            listaProductos[indice] = { ...listaProductos[indice], ...datosActualizados };
            res.json({ mensaje: "Actualizado con éxito", producto: listaProductos[indice] }); // [cite: 310]
        } else {
            res.status(404).json({ error: "Producto no encontrado para actualizar" });
        }
    },

    // 5. DELETE -> Busca un producto por ID y lo elimina del arreglo [cite: 168, 229, 230, 277]
    remove: (req, res) => {
        const idBuscado = parseInt(req.params.id); // 
        const longitudInicial = listaProductos.length;
        
        // Filtramos el arreglo para conservar todos menos el que queremos borrar 
        listaProductos = listaProductos.filter(p => p.id !== idBuscado);

        if (listaProductos.length < longitudInicial) {
            res.json({ mensaje: "Eliminado con éxito" }); // [cite: 313]
        } else {
            res.status(404).json({ error: "Producto no encontrado para eliminar" });
        }
    },

    // Exportamos la lista para que server.js la pueda renderizar en la vista '/'
    listaProductos: listaProductos
};

module.exports = productosController;