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

    // METODOS DE STRING: primera letra en mayuscula y el resto en minuscula
    nombreJugador = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    document.getElementById("tituloPanel").textContent = "Jugador: " + nombreJugador;
    document.getElementById("datoEdad").textContent = "Edad: " + edad + " años";

    // CAMBIO DE ESTILOS segun la edad: azul si es menor de 18, verde si no
    if (edad < 18) {
        panel.style.backgroundColor = "lightblue";
    } else {
        panel.style.backgroundColor = "lightgreen";
    }
}
