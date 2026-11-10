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


