//VARIABLES GLOBALES:
const EDAD_MINIMA = 12;         //edad minima para entrar
const PUNTOS_PARA_GANAR = 20;   //puntos para ganar

let nombreJugador = "";         //nombre -> ya con la inicial en mayúsculas
let puntos = 0;                 //puntuacion
let mejorTirada = 0;            //tirada más alta
let tiradas = [];               //array -> todas las tiradas del jugador

//CARGA DE LA PÁGINA Y EVENTO CLICK:
//como el script está en el head, tenemos que esperar a que cargue el HTML
window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnEntrar").addEventListener("click", validarPerfil);
    document.getElementById("btnLanzar").addEventListener("click", lanzar);
    document.getElementById("btnVentana").addEventListener("click", abrirVentana);
    document.getElementById("btnNueva").addEventListener("click", function () {
        window.location.reload();   //al recargar la página, se empieza otra partida
    });

    //COOKIE:
    //si hay un ultimo jugador guardado, lo mostramos en el perfil
    const ultimo = leerCookie("jugador");
    if (ultimo !== "") {
        document.getElementById("ultimoJugador").textContent = "Último jugador: " + ultimo;
    }
});

//PERFIL DEL JUGADOR:
//aquí validaremos el nombre y la fecha
function validarPerfil() {
    const nombre = document.getElementById("nombre").value.trim();
    const fechaTexto = document.getElementById("fecha").value;
    const mensaje = document.getElementById("mensaje");

    //nombre o fecha vacios
    if (nombre === "" || fechaTexto === "") {
        mensaje.textContent = "Acceso denegado";
        return;
    }

    const fechaNacimiento = new Date(fechaTexto);
    const hoy = new Date();

    //como la fecha tiene que ser anterior a hoy
    if (fechaNacimiento >= hoy) {
        mensaje.textContent = "Acceso denegado";
        return;
    }

    //calculamos la edad 
    const edad = calcularEdad(fechaNacimiento);

    //edad minima
    if (edad < EDAD_MINIMA) {
        mensaje.textContent = "Acceso denegado";
        return;
    }

    //si todo va bien, mostramos el panel
    mensaje.textContent = "";
    mostrarPanel(nombre, edad);
}

//MÉTODOS DATE:
//calculamos la edad, definida arriba, con el método date
//se calcula a partir de la fecha de nacimineto
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();

    //puede no haber cumplido años este año todavia, por eso le quitamos 1
    if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad;
}

