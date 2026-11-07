//empezamos creando la svariables globales
const EDAD_MINIMA = 12;         //edad minima para entrar
const PUNTOS_PARA_GANAR = 50;   //puntos para ganar

let nombreJugador = "";         //nombre (ya con lo de la inicial en mayus))
let puntos = 0;                 //puntuacion
let ataques = 0;                //cuantas veces ha atacado
let cofres = 0;                 //cofres ha abierto

//ahora creamos un array con lo que serán las misiones y las que se completemj
const misiones = ["Llegar a 20 puntos", "Atacar 3 veces", "Abrir un cofre"];
let misionesCompletadas = [];

//página(mostrala) y los clicks
window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnEntrar").addEventListener("click", validarPerfil);
    document.getElementById("btnAtacar").addEventListener("click", atacar);
    document.getElementById("btnCofre").addEventListener("click", abrirCofre);
    document.getElementById("btnMisiones").addEventListener("click", abrirVentana);

    //cookie:
    const ultimo = leerCookie("jugador");
    if (ultimo !== "") {
        document.getElementById("ultimoJugador").textContent = "Último jugador: " + ultimo;
    }
    });