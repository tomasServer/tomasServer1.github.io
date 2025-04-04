function mostrar(){
    
    let hash = window.location.hash; //obtenemos el # actual

    document.getElementById("nosotros").style.display = "none";
    document.getElementById("tabueno").style.display = "none";
    document.getElementById("doritos").style.display = "none";
    document.getElementById("granola").style.display = "none";
    document.getElementById("pedidos").style.display = "none"
    document.getElementById("login").style.display = "none";
    document.getElementById("registrarse").style.display = "none"

    if (window.location.hash === "#nosotros") {
        document.getElementById("nosotros").style.display = "";

    }else if(window.location.hash === "#tabueno"){
        document.getElementById("tabueno").style.display = "block";

    }else if(window.location.hash === "#doritos"){
        document.getElementById("doritos").style.display = "block";

    }else if(hash === "#granola"){
        document.getElementById("granola").style.display = "block";
    }else if(hash === "#pedidos"){
        document.getElementById("pedidos").style.display = "block";
    }
    
    else if(hash === "#login") {
        document.getElementById("login").style.display = "block";

    } else if(hash === "#registrarse"){
        document.getElementById("registrarse").style.display = "block"
    }
}

window.addEventListener("hashchange",mostrar);

mostrar();


