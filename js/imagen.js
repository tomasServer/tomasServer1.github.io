let imagenes = [
    "imagenes/doritos.jpg",
    "imagenes/granola.jpeg",
    "imagenes/tabuenoNegro.jpg"
];

let index = 0;
function cambiarImagen() {
    let img = document.getElementById("imagen-3");
    if (img) {
        img.src = imagenes[index];
        index = (index + 1) % imagenes.length; // para que vuelva al inicio de paginita
    }
}
//cambia de imagen
setInterval(cambiarImagen, 3500);