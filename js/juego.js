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

//PANEL DEL JUGADOR:
function mostrarPanel(nombre, edad) {
    const panel = document.getElementById("panel");

    //METODOS STRING -> primera letra en mayuscula
    nombreJugador = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    document.getElementById("tituloPanel").textContent = "Jugador: " + nombreJugador;
    document.getElementById("datoEdad").textContent = "Edad: " + edad + " años";

    //CAMBIO DE ESTILOS
    //azul -> menor de 18 verde -> mayor
    if (edad < 18) {
        panel.style.backgroundColor = "lightblue";
    } else {
        panel.style.backgroundColor = "lightgreen";
    }

    //LOCALSTORAGE:
    //aquí mostramos el record guardado solo si lo hay
    const record = localStorage.getItem("record");
    if (record !== null) {
        document.getElementById("record").textContent = record;
    }

    //COOKIE:
    //guardamos el nombre del ultimo jugador por 7 dias
    document.cookie = "jugador=" + nombreJugador + "; max-age=604800";

    //escondemos el perfil y mostramos el panel
    document.getElementById("perfil").classList.add("oculto");
    panel.classList.remove("oculto");
}

//LANZAR EL DADO:
function lanzar() {
    const resultado = document.getElementById("resultado");

    //vamos a crear el dado: Math.random() * 6 da 0-6, Math.floor() redondea hacia abajo, + 1 da 1-6
    const tirada = Math.floor(Math.random() * 6) + 1;

    tiradas.push(tirada);                          //guardamos la tirada en el array
    mejorTirada = Math.max(mejorTirada, tirada);   //Math.max() se queda con la mayor tirada

    if (tirada === 1) {
        puntos = 0;
        resultado.textContent = "Has sacado un 1: ¡pierdes todos los puntos!";
    } else {
        puntos = puntos + tirada;
        resultado.textContent = "Has sacado un " + tirada;
    }

    document.getElementById("puntos").textContent = puntos;
    document.getElementById("listaTiradas").textContent =
        "Tiradas: " + tiradas.join(", ") + " (mejor: " + mejorTirada + ")";

    //SESSIONSTORAGE: 
    //puntos de la partida actual
    sessionStorage.setItem("puntos", puntos);

    if (puntos >= PUNTOS_PARA_GANAR) {
        resultado.textContent = "¡Has ganado, " + nombreJugador + "! Lo has conseguido en " + tiradas.length + " tiradas";
        guardarRecord();
    }
}

//LOCALSTORAGE: 
//guarda el record si es mejor (menos tiradas) que el anterior
function guardarRecord() {
    const record = localStorage.getItem("record");
    if (record === null || tiradas.length < Number(record)) {
        localStorage.setItem("record", tiradas.length);
        document.getElementById("record").textContent = tiradas.length;
    }
}

//VENTANA ADICIONAL:
function abrirVentana() {
    //window.open abre una ventana nueva con las medidas que pongamos en el width 
    const ventana = window.open("", "tiradas", "width=300,height=250");

    //escribimos dentro de la ventana nueva, join() une el array con comas
    ventana.document.body.innerHTML =
        "<h2>Jugador: " + nombreJugador + "</h2>" +
        "<p>Puntos: " + puntos + "</p>" +
        "<p>Tiradas: " + tiradas.join(", ") + "</p>";
}

//COOKIES:
function leerCookie(clave) {
    const cookies = document.cookie.split("; ");   //cada cookie está separada por "; "
    for (let i = 0; i < cookies.length; i++) {
        const partes = cookies[i].split("=");      //partes[0] = nombre, partes[1] = valor
        if (partes[0] === clave) {
            return partes[1];
        }
    }
    return "";   //si no la encuentra
}


