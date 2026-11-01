
const EDAD_MINIMA = 12; // definimos una constante donde la edad minima para entrar al juego sean 12 años

// le decimos a la ventana (window): "cuando pase el evento DOMContentLoaded, ejecuta esta función"
window.addEventListener("DOMContentLoaded", function () {// DOMContentLoaded se lanza cuando el navegador ya ha cargado todo el HTML de la página
    const boton = document.getElementById("btnEntrar");// buscamos en el HTML el elemento que tiene id="btnEntrar" y lo guardamos n¡en la constante boton
    boton.addEventListener("click", validarPerfil);// le decimos al boton que si se hace click, ejecute el validar perfil
 
});
//primero declaramos la funcion para validar el perfil, que se ejecutará cuando hagamos click en el boton
function validarPerfil() {
    const nombre = document.getElementById("nombre").value.trim();// buscmos el input con id="nombre" y cogemos lo que ha escrito el usuario (.value)
    const fechaTexto = document.getElementById("fecha").value;// buscamos el input de fecha y cogemos su valor
    const mensaje = document.getElementById("mensaje");// buscamos el <p id="mensaje"> donde vamos a escribir los avisos

    // por si el nombre o la fecha esta vacio
    if (nombre === "" || fechaTexto === "") {
        mensaje.textContent = "Acceso denegado"; // escribir acceso denegado dentro del HTML
        return;
    }

    const fechaNacimiento = new Date(fechaTexto); // convertimos el test que pongamos de fecha en un objeto Date
    const hoy = new Date(); //fecha y hora de hoy mismo

    // si la edad es menor que la minima, no puede entrar
    if (edad < EDAD_MINIMA) {
        mensaje.textContent = "Acceso denegado";
        return;
    }

    // si ha llegado hasta aqui, todo esta bien: mostramos el panel
    mensaje.textContent = "";// borramos cualquier mensaje anterior
    mostrarPanel(nombre, edad);// llamamos a la funcion que vamos a crear abajo

    // calculamos la edad
    // getFullYear() devuelve el año con 4 cifra
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();// restamos año actual con año de nacimiento

    // getMonth() devuelve el mes de 0 a 11 (enero = 0, diciembre = 11)
    const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();// diferencia de meses entre hoy y el mes de nacimiento

    // comprobamos si todavia no ha cumplido años este año.
    if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        //si aun no ha cumplido años le quitamos 1 a la edad
        edad--;
    }
    
}
// funcion que esconde el perfil y muestra el panel del jugador
function mostrarPanel(nombre, edad) {
    const panel = document.getElementById("panel");

    // METODOS DE STRING: primera letra en mayuscula y el resto en minuscula
    // charAt(0) coge la primera letra, slice(1) coge desde la segunda hasta el final
    const nombreFormateado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    document.getElementById("tituloPanel").textContent = "Jugador: " + nombreFormateado;
    document.getElementById("datoEdad").textContent = "Edad: " + edad + " años";

    // CAMBIO DE ESTILOS segun la edad: fondo azul si es menor de 18, verde si no
    if (edad < 18) {
        panel.style.backgroundColor = "lightblue";
    } else {
        panel.style.backgroundColor = "lightgreen";
    }

    // escondemos el perfil y mostramos el panel cambiando sus clases
    document.getElementById("perfil").classList.add("oculto");
    panel.classList.remove("oculto");
}
