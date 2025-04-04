// Estructura para almacenar clientes
let clientes = JSON.parse(localStorage.getItem('clientesNova')) || [];

// Estructura para almacenar pedidos
let pedidos = JSON.parse(localStorage.getItem('pedidosNova')) || [];

// Función para registrar un nuevo cliente
function registrarCliente() {
    const numeroTelefono = document.getElementById('numero').value;
    const contrasena = document.getElementById('contrasena').value;
    const ubicacion = document.getElementById('ubicacion').value;
    
    // Validar datos
    if (!numeroTelefono || !contrasena || !ubicacion) {
        mostrarAlerta('Por favor completa todos los campos', 'error');
        return false;
    }
    
    // Verificar si el cliente ya existe
    const clienteExistente = clientes.find(cliente => cliente.numero === numeroTelefono);
    if (clienteExistente) {
        alert('Este número ya está registrado', 'error');
        return false;
    }
    
    // Crear nuevo cliente
    const nuevoCliente = {
        id: Date.now(), // ID único basado en timestamp
        numero: numeroTelefono,
        contrasena: contrasena, // En una app real, deberías hashear la contraseña
        ubicacion: ubicacion,
        fechaRegistro: new Date().toISOString()
    };
    
    // Agregar al array y guardar en localStorage
    clientes.push(nuevoCliente);
    localStorage.setItem('clientesNova', JSON.stringify(clientes));
    
    alert('Cliente registrado correctamente', 'success');
    document.getElementById('registroClienteForm').reset();
    
    return true;
}

// Asignar evento al formulario
document.getElementById('registroClienteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    registrarCliente();
});

// Función para iniciar sesión
function iniciarSesion() {
    const numeroTelefono = document.getElementById('numeroLogin').value;
    const contrasena = document.getElementById('contrasenaLogin').value;
    
    // Validar datos
    if (!numeroTelefono || !contrasena) {
        mostrarAlerta('Por favor completa todos los campos', 'error');
        return false;
    }
    
    // Buscar cliente
    const cliente = clientes.find(c => c.numero === numeroTelefono && c.contrasena === contrasena);
    
    if (cliente) {
        // Guardar información de sesión
        sessionStorage.setItem('clienteActual', JSON.stringify(cliente));
        
        mostrarAlerta('Inicio de sesión exitoso', 'success');
        document.getElementById('loginForm').reset();
        
        // Redirigir o mostrar panel de cliente
        setTimeout(() => {
            window.location.href = '#pedidos'; // o actualizar la interfaz
        }, 1000);
        
        return true;
    } else {
        mostrarAlerta('Número o contraseña incorrectos', 'error');
        return false;
    }
}

// Asignar evento al formulario
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    iniciarSesion();
});

