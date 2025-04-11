
document.addEventListener('DOMContentLoaded', function() {
    function verificarSesion() {
        const clienteActual = localStorage.getItem('usuarioActual');
        return clienteActual !== null;
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const numero = document.getElementById('numeroLogin').value;
            const contrasena = document.getElementById('contrasenaLogin').value;

            // Admin login (hardcoded for now)
            if (numero === 'admin' && contrasena === '1234') {
                document.getElementById('admin-panel').style.display = 'block';
                window.location.hash = '#admin-panel';
                return;
            }

            // Regular user login via API
            try {
                const response = await fetch('http://localhost:3001/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ numero, contrasena })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Store user data in localStorage
                    localStorage.setItem('usuarioActual', JSON.stringify(data.user));
                    
                    // Update UI with user info
                    const nombreElement = document.getElementById('pedido-nombre');
                    const direccionElement = document.getElementById('pedido-direccion');
                    
                    if (nombreElement && direccionElement) {
                        nombreElement.textContent = data.user.nombre || 'No especificado';
                        direccionElement.textContent = data.user.ubicacion || 'No especificada';
                        
                        // Redirect after a short delay
                        setTimeout(() => {
                            window.location.hash = 'pedidos';
                        }, 100);
                    }
                    
                    // Update navigation elements
                    const loginLink = document.getElementById('login-link');
                    const cerrarSesionNav = document.getElementById('cerrar-sesion-nav');
                    
                    if (loginLink) loginLink.style.display = 'none';
                    if (cerrarSesionNav) cerrarSesionNav.style.display = 'block';
                    
                } else {
                    document.getElementById('respuesta').textContent = data.error || 'Usuario o contraseña incorrectos';
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('respuesta').textContent = 'Error al conectar con el servidor';
            }
        });
    }

    const registroForm = document.getElementById('registroClienteForm');
    if (registroForm) {
        registroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const numero = document.getElementById('numero').value;
            const contrasena = document.getElementById('contrasena').value;
            const contrasena2 = document.getElementById('contrasena2').value;
            const nombre = document.getElementById('nombre').value;
            const ubicacion = document.getElementById('ubicacion').value;
            
            // Validate passwords match
            if (contrasena !== contrasena2) {
                alert('Las contraseñas no coinciden');
                return;
            }
            
            // Create user object
            const nuevoCliente = {
                numero: numero,
                contrasena: contrasena,
                nombre: nombre,
                ubicacion: ubicacion
            };
            
            try {
                console.log('Enviando datos de registro:', nuevoCliente);
                
                // Send registration request to server
                const response = await fetch('http://localhost:3001/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(nuevoCliente)
                });
                
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                
                if (data.success) {
                    alert('Usuario registrado correctamente. Por favor inicia sesión con tus credenciales.');
                    registroForm.reset();
                    // Redirect to login page
                    window.location.hash = '#login';
                } else {
                    alert(data.error || 'Error al registrar usuario');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor. Verifica que el servidor esté en ejecución.');
            }
        });
    }

    // Cerrar sesión button event
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', cerrarSesion);
    }
    
    // Check login status on page load
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    const loginLink = document.getElementById('login-link');
    const cerrarSesionNav = document.getElementById('cerrar-sesion-nav');
    
    if (usuario) {
        // El usuario está logueado
        if (loginLink) loginLink.style.display = 'none';
        if (cerrarSesionNav) cerrarSesionNav.style.display = 'block';
    } else {
        // No hay usuario logueado
        if (loginLink) loginLink.style.display = 'block';
        if (cerrarSesionNav) cerrarSesionNav.style.display = 'none';
    }
});

// Verificar y mostrar información del usuario al cargar cada sección
window.addEventListener('hashchange', function() {
    if (window.location.hash === '#pedidos') {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (usuarioActual) {
            const nombreElement = document.getElementById('pedido-nombre');
            const direccionElement = document.getElementById('pedido-direccion');
            
            if (nombreElement && direccionElement) {
                nombreElement.textContent = usuarioActual.nombre || 'No especificado';
                direccionElement.textContent = usuarioActual.ubicacion || 'No especificada';
            }
        }
    }
});

function cerrarSesion() {
    // Limpiar datos de sesión
    localStorage.removeItem('usuarioActual');
    
    // Limpiar información del cliente en la interfaz
    const nombreElement = document.getElementById('pedido-nombre');
    const direccionElement = document.getElementById('pedido-direccion');
    
    if (nombreElement && direccionElement) {
        nombreElement.textContent = '';
        direccionElement.textContent = '';
    }
    
    // Update navigation elements
    const loginLink = document.getElementById('login-link');
    const cerrarSesionNav = document.getElementById('cerrar-sesion-nav');
    
    if (loginLink) loginLink.style.display = 'block';
    if (cerrarSesionNav) cerrarSesionNav.style.display = 'none';
    
    alert('Sesión cerrada correctamente');
    window.location.hash = '#nosotros';
}

function alert(message) {
    window.alert(message);
}




