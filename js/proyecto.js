function mostrar(){
    let hash = window.location.hash;

    // Hide all sections
    document.getElementById("nosotros").style.display = "none";
    document.getElementById("tabueno").style.display = "none";
    document.getElementById("doritos").style.display = "none";
    document.getElementById("granola").style.display = "none";
    document.getElementById("pedidos").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("registrarse").style.display = "none";
    document.getElementById("admin-panel").style.display = "none";

    if(hash === "#nosotros"){
        document.getElementById("nosotros").style.display = "block";
    }
    if(hash === "#tabueno"){
        document.getElementById("tabueno").style.display = "block";
    }
    if(hash === "#doritos"){
        document.getElementById("doritos").style.display = "block";
    }
    if(hash === "#granola"){
        document.getElementById("granola").style.display = "block";
    }
    if(hash === "#pedidos"){
        document.getElementById("pedidos").style.display = "block";
     }
    if(hash === "#login"){
        document.getElementById("login").style.display = "block"; 
    }
    if(hash === "#registrarse"){
        document.getElementById("registrarse").style.display = "block"; 
    }if(hash === "#admin-panel"){
        document.getElementById("admin-panel").style.display = "block";
    }
}
mostrar();
window.addEventListener("hashchange", mostrar);
