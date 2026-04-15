class producto {
    constructor(producto_id, nombre, marca, categoria, precio, stock, garantia) {
        this.producto_id = producto_id;
        this.nombre = nombre;
        this.marca = marca;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
        this.garantia = garantia;
    }

    AgregarProducto() {
        
    }

    EliminarProducto() {

    }

    ElegirProcucto() {

    }
    
    MostrarProducto() {

    }
}

class detalle {
    constructor(oc_id, detalle_id, cantidad, producto_id) {
        this.oc_id = oc_id;
        this.detalle_id = detalle_id;
        this.cantidad = cantidad;
        this.producto_id - producto_id;
    }

    DisplayDetalle() {
        return {
            oc_id : this.oc_id,
            detalle_id : this.detalle_id,
            cantidad : this.cantidad,
            producto_id : this.producto_id
        }
    }
}

class cabecera {
    constructor(oc_id, fecha_compra, metodo_entrega_id, id_cliente, medio_pago_id) {
        this.oc_id = oc_id;
        this.fecha_compra = fecha_compra;
        this.metodo_entrega_id = metodo_entrega_id;
        this.id_cliente = id_cliente;
        this.medio_pago_id = medio_pago_id;
    }
}

class entrega {
    constructor(metodo_entrega_id, metodo_entrega) {
        this.metodo_entrega_id = metodo_entrega_id;
        this.metodo_entrega = metodo_entrega;
    }
}

class cliente {
    constructor(id_cliente, nombre, apellido, dni, telefono, email, habilitado, cantidad, cupon, corporativo, medio_pago_id) {
        this.id_cliente = id_cliente;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.telefono = telefono;
        this.email = email;
        this.habilitado = habilitado;
        this.cantidad = cantidad;
        this.cupon = cupon;
        this.corporativo = corporativo;
        this.medio_pago_id = medio_pago_id;
    }
}

class pago {
    constructor(medio_pago_id, medio_pago) {
        this.medio_pago_id = medio_pago_id;
        this.medio_pago = medio_pago;
    }
}