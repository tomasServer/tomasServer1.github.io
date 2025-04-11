
// Add this CSS to make alerts visible
document.head.insertAdjacentHTML('beforeend', `
<style>
.alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-left: 5px solid #0891b2;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 1000;
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.3s ease;
}
.alert.show {
    opacity: 1;
    transform: translateX(0);
}
.alert-error {
    border-left-color: #dc3545;
}
.alert-success {
    border-left-color: #28a745;
}
</style>
`);

// Function to check if user is logged in
export function verificarSesion() {
    const clienteActual = localStorage.getItem('usuarioActual');
    return clienteActual !== null;
}

// Function to register a new client in the database
function registrarCliente(e) {
    if (e) e.preventDefault();
    
    console.log('Registrando cliente...');
    
    const numeroTelefono = document.getElementById('numero').value;
    const contrasena = document.getElementById('contrasena').value;
    const contrasena2 = document.getElementById('contrasena2').value;
    const nombre = document.getElementById('nombre').value;
    const ubicacion = document.getElementById('ubicacion').value;
    
    // Validate data
    if (!numeroTelefono || !contrasena || !nombre || !ubicacion) {
        alert('Por favor completa todos los campos', 'error');
        return false;
    }
    
    // Check if passwords match
    if (contrasena !== contrasena2) {
        alert('Las contraseñas no coinciden', 'error');
        return false;
    }
    
    // Create client object
    const nuevoCliente = {
        numero: numeroTelefono,
        contrasena: contrasena,
        nombre: nombre,
        ubicacion: ubicacion
    };
    
    console.log('Enviando datos de registro:', nuevoCliente);
    
    // Send registration request to server
    fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCliente)
    })
    .then(response => {
        console.log('Respuesta del servidor:', response);
        return response.json();
    })
    .then(data => {
        console.log('Datos de respuesta:', data);
        if (data.success) {
            alert('Cliente registrado correctamente', 'success');
            document.getElementById('registroClienteForm').reset();
            window.location.hash = '#login';
        } else {
            alert(data.error || 'Error al registrar cliente', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al conectar con el servidor', 'error');
    });
    
    return false;
}

// Function to login
function iniciarSesion(e) {
    if (e) e.preventDefault();
    
    const numero = document.getElementById('numeroLogin').value;
    const contrasena = document.getElementById('contrasenaLogin').value;
    
    if (!numero || !contrasena) {
        document.getElementById('respuesta').textContent = 'Por favor ingresa usuario y contraseña';
        return;
    }
    
    // Send login request to server
    fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numero, contrasena })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store user data in localStorage
            localStorage.setItem('usuarioActual', JSON.stringify(data.user));
            
            // Update UI based on user role
            if (data.user.isAdmin) {
                document.getElementById('admin-link').style.display = 'block';
            }
            
            // Redirect to home page
            window.location.hash = '#nosotros';
            document.getElementById('login-link').style.display = 'none';
            document.getElementById('cerrar-sesion-nav').style.display = 'block';
            
            // Update user info in orders section
            const nombreElement = document.getElementById('pedido-nombre');
            const direccionElement = document.getElementById('pedido-direccion');
            
            if (nombreElement && direccionElement) {
                nombreElement.textContent = data.user.nombre;
                direccionElement.textContent = data.user.ubicacion;
            }
            
            document.getElementById('loginForm').reset();
            alert('Inicio de sesión exitoso', 'success');
        } else {
            document.getElementById('respuesta').textContent = data.error || 'Error al iniciar sesión';
            alert(data.error || 'Error al iniciar sesión', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('respuesta').textContent = 'Error al conectar con el servidor';
        alert('Error al conectar con el servidor', 'error');
    });
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners');
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, adding event listener');
        loginForm.addEventListener('submit', iniciarSesion);
    }
    
    const registroForm = document.getElementById('registroClienteForm');
    if (registroForm) {
        console.log('Registration form found, adding event listener');
        registroForm.addEventListener('submit', registrarCliente);
    }
    
    // Check login status on page load
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (usuario) {
        // User is logged in
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('cerrar-sesion-nav').style.display = 'block';
        
        // Show admin link if user is admin
        if (usuario.isAdmin) {
            document.getElementById('admin-link').style.display = 'block';
        }
        
        // Update user info in orders section
        const nombreElement = document.getElementById('pedido-nombre');
        const direccionElement = document.getElementById('pedido-direccion');
        
        if (nombreElement && direccionElement) {
            nombreElement.textContent = usuario.nombre;
            direccionElement.textContent = usuario.ubicacion;
        }
    }
});

// Function to show alerts
function alert(message, type = 'info') {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alertElement.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertElement);
        }, 300);
    }, 3000);
}

// Make functions available globally
window.registrarCliente = registrarCliente;
window.iniciarSesion = iniciarSesion;
window.alert = alert;
