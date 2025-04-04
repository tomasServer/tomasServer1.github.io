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

// Función principal para agregar productos seleccionados
function agregarProductosSeleccionados() {
    const inputs = document.querySelectorAll('#tablaProductos .cantidad');


    let productosAgregados = 0;

    inputs.forEach(input => {
        const cantidad = parseInt(input.value);
        const producto = input.dataset.producto;
        const precio = parseFloat(input.dataset.precio);

        if (!isNaN(cantidad) && cantidad > 0) {
            agregarAlPedido(producto, cantidad, precio);
            productosAgregados++;
            input.value = ''; // Limpiar el input
        }
    });

    if (productosAgregados > 0) {
        guardarPedido();
        actualizarTablaPedidos();
        mostrarAlerta(`${productosAgregados} productos agregados al pedido`, 'success');
        // Desplazarse a la sección de pedidos
        setTimeout(() => {
            document.getElementById('pedidos').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    } else {
        mostrarAlerta('Por favor ingresa cantidades válidas', 'error');
    }
}

// Función para agregar un producto al pedido
function agregarAlPedido(nombre, cantidad, precio) {
    // Buscar si el producto ya está en el pedido
    const productoExistente = pedido.find(item => item.producto === nombre);
    
    if (productoExistente) {
        // Si existe, actualizar cantidad y total
        productoExistente.cantidad += cantidad;
        productoExistente.total = productoExistente.cantidad * productoExistente.precio;
    } else {
        // Si no existe, agregar nuevo producto
        pedido.push({
            producto: nombre,
            cantidad: cantidad,
            precio: precio,
            total: cantidad * precio
        });
    }
}

// Función para actualizar la tabla de pedidos
function actualizarTablaPedidos() {
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

    // Actualizar total general
    const totalElement = document.getElementById('total-pedido');
    if (totalElement) {
        totalElement.textContent = `${totalGeneral.toFixed(2)} Bs`;
    }

    // Asignar eventos a los botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            eliminarDelPedido(index);
        });
    });
}

// Función para eliminar un producto del pedido
function eliminarDelPedido(index) {
    pedido.splice(index, 1);
    guardarPedido();
    actualizarTablaPedidos();
    mostrarAlerta('Producto eliminado del pedido', 'info');
}

// Función para guardar el pedido en localStorage
function guardarPedido() {
    localStorage.setItem("pedidos", JSON.stringify(pedido));
}

// Función para cargar pedidos guardados
function cargarPedidosGuardados() {
    const pedidosGuardados = localStorage.getItem("pedidos");
    if (pedidosGuardados) {
        pedido = JSON.parse(pedidosGuardados);
        actualizarTablaPedidos();
    }
}

// Función para enviar el pedido
function enviarPedido() {
    if (pedido.length === 0) {
        mostrarAlerta('No hay productos en el pedido', 'error');
        return;
    }

    // Aquí puedes agregar lógica para enviar el pedido a tu backend
    const resumen = pedido.map(item => 
        `${item.cantidad} x ${item.producto} - ${item.total.toFixed(2)} Bs`
    ).join('\n');
    
    const total = pedido.reduce((sum, item) => sum + item.total, 0);
    
    mostrarAlerta(`Pedido enviado:\n${resumen}\n\nTotal: ${total.toFixed(2)} Bs`, 'success');
    
    // Limpiar después de enviar
    pedido = [];
    guardarPedido();
    actualizarTablaPedidos();
}

// Función para limpiar el pedido
function limpiarPedido() {
    if (pedido.length === 0 || confirm('¿Estás seguro de limpiar todo el pedido?')) {
        pedido = [];
        guardarPedido();
        actualizarTablaPedidos();
        mostrarAlerta('Pedido limpiado', 'info');
    }
}

// Función para mostrar alertas/notificaciones
function mostrarAlerta(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    // Agregar al cuerpo del documento
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}




