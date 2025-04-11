// Variables globales
let pedido = JSON.parse(localStorage.getItem("pedidos")) || [];

// Precios de los productos
const precios = {
    "TaBueno 17gr": 10,
    "TaBueno 200gr": 5,
    "Doritos 50gr": 8,
    "Doritos 100gr": 5,
    "Granola SanCristobal": 5
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar pedidos guardados
    cargarPedidosGuardados();
    
    // Asignar evento al botón "Agregar Todo"
    const agregarTodoBtn = document.getElementById('agregarTodo');
    if (agregarTodoBtn) {
        agregarTodoBtn.addEventListener('click', agregarProductosSeleccionados);
    }
    
    // Asignar eventos a los botones de enviar y limpiar
    const enviarPedidoBtn = document.getElementById('enviar-pedido');
    if (enviarPedidoBtn) {
        enviarPedidoBtn.addEventListener('click', enviarPedido);
    }
    
    const limpiarPedidoBtn = document.getElementById('limpiar-pedido');
    if (limpiarPedidoBtn) {
        limpiarPedidoBtn.addEventListener('click', limpiarPedido);
    }
});


function agregarProductosSeleccionados() {
    alert("agregado al carrito");
    const tablas = ['tablaProductos', 'tablanachos', 'tablagranola'];
    let productosAgregados = 0;//contador

    tablas.forEach(tablaId => {         //cantidad clase
        const inputs = document.querySelectorAll(`#${tablaId} .cantidad`);
        
        inputs.forEach(input => {
            const cantidad = parseInt(input.value);
                                    //data-.....
            const producto = input.dataset.producto;
            const precio = parseFloat(input.dataset.precio);

            if (!isNaN(cantidad) && cantidad > 0) {
                agregarAlPedido(producto, cantidad, precio);
                productosAgregados++;
                input.value = '';
            }
        });
    });

    if (productosAgregados > 0) {
        guardarPedido();
        actualizarTablaPedidos();
        mostrarAlerta(`${productosAgregados} productos agregados al pedido`, 'success');
        setTimeout(() => {
            document.getElementById('pedidos').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    } else {
        mostrarAlerta('Por favor ingresa cantidades válidas', 'error');
    }
}



function agregarAlPedido(nombre, cantidad, precio) {
    
    const productoExistente = pedido.find(item => item.producto === nombre);
    
    if (productoExistente) {

        productoExistente.cantidad += cantidad;
        productoExistente.total = productoExistente.cantidad * productoExistente.precio;
    } else {

        pedido.push({
            producto: nombre,
            cantidad: cantidad,
            precio: precio,
            total: cantidad * precio
        });
    }
}


function actualizarTablaPedidos() {         //tbody cuerpo de tabla creo
    const tbody = document.querySelector('#tabla-pedido tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let totalGeneral = 0;

    pedido.forEach((item, index) => {
        totalGeneral += item.total;
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.producto}</td>
            <td>${item.cantidad}</td>
            <td>${item.precio.toFixed(2)} Bs</td>
            <td>${item.total.toFixed(2)} Bs</td>
            <td><button class="btn-eliminar" data-index="${index}">✕</button></td>
        `;
        tbody.appendChild(fila);
    });


    const totalElement = document.getElementById('total-pedido');
    if (totalElement) {//mostrar tabla pe
        totalElement.textContent = `${totalGeneral.toFixed(2)} Bs`;
    }


    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            eliminarDelPedido(index);
        });
    });
}

// Función para eliminar un producto del pedido
function eliminarDelPedido(index) {
    //plice eliminar
    pedido.splice(index, 1);
    guardarPedido();
    actualizarTablaPedidos();
    mostrarAlerta('Producto eliminado del pedido', 'info');
}

function guardarPedido() {
    localStorage.setItem("pedidos", JSON.stringify(pedido));
}


function cargarPedidosGuardados() {
    const pedidosGuardados = localStorage.getItem("pedidos");
    if (pedidosGuardados) {
        pedido = JSON.parse(pedidosGuardados);
        actualizarTablaPedidos();
    }
}


// ... existing code ...

function enviarPedido() {
    if (pedido.length === 0) {
        mostrarAlerta('agrege productos :)', 'error');
        return;
    }
    const nombreCliente = document.getElementById('pedido-nombre').textContent;
    const direccionCliente = document.getElementById('pedido-direccion').textContent;
    
    if (!nombreCliente || !direccionCliente) {
        mostrarAlerta('inicia secion por favor', 'error');
        window.location.hash = '#login';
        return;
    }

    const tabla = document.getElementById('tabla-pedido');
    const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const total = document.getElementById('total-pedido').textContent;
    
    // Guardar en historial
    const historialPedido = {
        fecha: new Date().toLocaleString(),
        cliente: nombreCliente,
        direccion: direccionCliente,
        productos: pedido.map(item => ({
            nombre: item.producto,
            cantidad: item.cantidad,
            precio: item.precio,
            total: item.total
        })),
        total: total
    };

    // Obtener historial existente o crear nuevo array
    const historial = JSON.parse(localStorage.getItem('historialPedidos')) || [];
    historial.push(historialPedido);
    localStorage.setItem('historialPedidos', JSON.stringify(historial));
    
    // Construir el mensaje para WhatsApp
    let mensaje = " *Nuevo Pedido*\n\n";
    // ... resto del código del mensaje ...

    const telefono = "59173173372";
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    // Limpiar después de enviar
    pedido = [];
    guardarPedido();
    actualizarTablaPedidos();
    mostrarAlerta('pedido enviado y guardado en historial', 'success');
}

// Función para mostrar el historial de pedidos
function mostrarHistorialPedidos() {
    const historial = JSON.parse(localStorage.getItem('historialPedidos')) || [];
    const contenedor = document.getElementById('historial-pedidos');
    
    if (contenedor) {
        contenedor.innerHTML = `
            <h3>Historial de Pedidos</h3>
            <table class="tabla-historial">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Productos</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${historial.map(pedido => `
                        <tr>
                            <td>${pedido.fecha}</td>
                            <td>${pedido.cliente}</td>
                            <td>${pedido.productos.map(p => 
                                `${p.cantidad}x ${p.nombre}`).join(', ')}</td>
                            <td>${pedido.total}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

// Agregar al evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Mostrar historial si existe el contenedor
    mostrarHistorialPedidos();
});
// Función para limpiar el pedido
function limpiarPedido() {
    if (pedido.length === 0 || confirm('seguro que quieres eliminar los productos del pedido?')) {
        pedido = [];
        guardarPedido();
        actualizarTablaPedidos();
}
}
