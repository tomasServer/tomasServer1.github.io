let imagenes = ['imagenes/tabuenoNegro.jpg', 'imagenes/nacho.jpg', 'imagenes/granola.jpeg'];
let actual = 0;

function cargarImagenes() {
    let contenedor = document.querySelector('.imagenes');
    let img = contenedor.querySelector('img');
    img.style.opacity = '0';
    
    setTimeout(() => {
        img.src = imagenes[actual];
        img.style.opacity = '1';
    }, 500);
}

function rotarImagenes() {
    actual = (actual + 1) % imagenes.length;
    cargarImagenes();
}

document.addEventListener('DOMContentLoaded', function() {
    cargarImagenes();
    setInterval(rotarImagenes, 3000); // Cambia cada 3 segundos
});