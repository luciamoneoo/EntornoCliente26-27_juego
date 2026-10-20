
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
}
