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

//ahora tenemos que validar los datos(nombre y fecha)
function validarPerfil() {
    const nombre = document.getElementById("nombre").value.trim();
    const fechaTexto = document.getElementById("fecha").value;
    const mensaje = document.getElementById("mensaje");

    // nombre o fecha vacios
    if (nombre === "" || fechaTexto === "") {
        mensaje.textContent = "Acceso denegado";
        return;
    }

    const fechaNacimiento = new Date(fechaTexto);
    const hoy = new Date();

    // la fecha tiene que ser anterior a hoy
    if (fechaNacimiento >= hoy) {
        mensaje.textContent = "Acceso denegado";
        return;
    }

    // calculamos la edad con la funcion de abajo
    const edad = calcularEdad(fechaNacimiento);

    // edad minima
    if (edad < EDAD_MINIMA) {
        mensaje.textContent = "Acceso denegado";
        return;
    }

    // todo correcto: mostramos el panel
    mensaje.textContent = "";
    mostrarPanel(nombre, edad);
}

//continuamos con los metodos "date"
//lo usamos para el calculo de la fecha de nacimento
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();

    //si todavia no ha cumplido años este año le quitamos 1
    if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad;
}

//ahora segumos con otra función que sera para mostrar el panel
//junto con esta función, usaremos algunos metdos string (como el uppercase para el nombre)
function mostrarPanel(nombre, edad) {
    const panel = document.getElementById("panel");

    //primera letra en mayuscula y el resto en minuscula
    nombreJugador = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    document.getElementById("tituloPanel").textContent = "Jugador: " + nombreJugador;
    document.getElementById("datoEdad").textContent = "Edad: " + edad + " años";

    //azul si es menor de 18, verde si no
    if (edad < 18) {
        panel.style.backgroundColor = "lightblue";
    } else {
        panel.style.backgroundColor = "lightgreen";
    }

    //sesionstorage -> recuperamos los puntos de la partida (si no hay nada, Number(null) es 0)
    puntos = Number(sessionStorage.getItem("puntos"));
    document.getElementById("puntos").textContent = puntos;

    //localstorage -> recuperamos el record
    document.getElementById("record").textContent = Number(localStorage.getItem("record"));

    //cookie -> guardamos el nombre del ultimo jugador durante 7 dias (604800 segundos)
    document.cookie = "jugador=" + encodeURIComponent(nombreJugador) + "; max-age=604800";

    //escondemos el perfil y mostramos el panel
    document.getElementById("perfil").classList.add("oculto");
    panel.classList.remove("oculto");
}

//tenemos que crear ahora funciones que hara el jugador, como atacar, abrir cofres, o cuando se tengas uwe sumar puntos ...
function atacar() {
    // Math.random() da un decimal entre 0 y 1
    // * 10 y Math.floor() (redondeo hacia abajo) + 1 = entero entre 1 y 10
    const golpe = Math.floor(Math.random() * 10) + 1;

    ataques++;
    document.getElementById("resultado").textContent = "Atacas al monstruo y ganas " + golpe + " puntos";
    sumarPuntos(golpe);
}

function abrirCofre() {
    //entre -5 y 10 (los negativos son trampas)
    const valor = Math.floor(Math.random() * 16) - 5;

    cofres++;
    if (valor < 0) {
        // Math.abs() quita el signo negativo para que se lea bien
        document.getElementById("resultado").textContent = "¡Trampa! Pierdes " + Math.abs(valor) + " puntos";
    } else {
        document.getElementById("resultado").textContent = "Cofre abierto: ganas " + valor + " puntos";
    }
    sumarPuntos(valor);
}

// suma (o resta) puntos y actualiza todo lo demas
function sumarPuntos(cantidad) {
    // Math.max() para que los puntos nunca sean menores que 0
    puntos = Math.max(0, puntos + cantidad);
    document.getElementById("puntos").textContent = puntos;

    comprobarMisiones();
    guardarPartida();

    if (puntos >= PUNTOS_PARA_GANAR) {
        document.getElementById("mensajeFinal").textContent = "¡Has ganado, " + nombreJugador + "!";
    } else {
        document.getElementById("mensajeFinal").textContent = "";
    }
}

//creamos otros arrays para lo que serán las misiones
function comprobarMisiones() {
    if (puntos >= 20) {
        completarMision(misiones[0]);
    }
    if (ataques >= 3) {
        completarMision(misiones[1]);
    }
    if (cofres >= 1) {
        completarMision(misiones[2]);
    }
    document.getElementById("misionesHechas").textContent =
        "Misiones completadas: " + misionesCompletadas.length + " de " + misiones.length;
}

// push() -> añade al array, includes() -> comprueba si ya esta (para no repetir)
function completarMision(mision) {
    if (!misionesCompletadas.includes(mision)) {
        misionesCompletadas.push(mision);
    }
}

//ventana adicional:
function abrirVentana() {
    // window.open abre una ventana nueva (vacia) de 350x300
    const ventana = window.open("", "misiones", "width=350,height=300");

    // join() une el array en un texto separado por comas
    let lista = misionesCompletadas.join(", ");
    if (lista === "") {
        lista = "ninguna todavía";
    }

    // escribimos dentro de la ventana nueva
    ventana.document.body.innerHTML =
        "<h2>Jugador: " + nombreJugador + "</h2>" +
        "<p>Puntos: " + puntos + "</p>" +
        "<p>Misiones completadas: " + lista + "</p>";
}

//almacenamiento:
function guardarPartida() {
    // SESSIONSTORAGE: puntos de la partida actual
    sessionStorage.setItem("puntos", puntos);

    // LOCALSTORAGE: record maximo (todo se guarda como texto, por eso Number())
    const recordActual = Number(localStorage.getItem("record"));
    const nuevoRecord = Math.max(recordActual, puntos);
    localStorage.setItem("record", nuevoRecord);
    document.getElementById("record").textContent = nuevoRecord;
}

// COOKIES: busca una cookie por su nombre y devuelve su valor
function leerCookie(clave) {
    const cookies = document.cookie.split("; ");// cada cookie viene separada por "; "
    for (let i = 0; i < cookies.length; i++) {
        const partes = cookies[i].split("=");// partes[0] = nombre, partes[1] = valor
        if (partes[0] === clave) {
            return decodeURIComponent(partes[1]);
        }
    }
    return "";// si no la encuentra
}


