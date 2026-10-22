
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

    // la fecha tiene que ser anterior a hoy
    if (fechaNacimiento >= hoy) { //podemos comoarar los objetos Date porque dentro son numeros
        mensaje.textContent = "Acceso denegado"; //no tendría sentido nacer en una fecha futura asique lanzamks un mensaje de error
        return; //para que la funcion no siga 
    }

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
