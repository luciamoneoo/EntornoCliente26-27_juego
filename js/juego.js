//VARIABLES GLOBALES:
const EDAD_MINIMA = 12;         //edad minima para entrar
const PUNTOS_PARA_GANAR = 20;   //puntos para ganar

let nombreJugador = "";         //nombre -> ya con la inicial en mayúsculas
let puntos = 0;                 //puntuacion
let mejorTirada = 0;            //tirada más alta
let tiradas = [];               //array -> todas las tiradas del jugador

//CARGA DE LA PÁGINA Y EVENTO CLICK:
//como el script está en el head, tenemos que esperar a que cargue el HTML
//DOMContentLoaded se dispara cuando el DOM ya está construido, es decir,
//cuando ya existen los botones, inputs, etc. Sin esto, getElementById
//devolvería null (porque el body aún no existe cuando se lee el head).
window.addEventListener("DOMContentLoaded", function () {
    //se pasa el nombre de la función sin paréntesis (validarPerfil, no validarPerfil()),
    //porque si no, se ejecutaría en el momento de cargar la página.
    document.getElementById("btnEntrar").addEventListener("click", validarPerfil);
    document.getElementById("btnLanzar").addEventListener("click", lanzar);
    document.getElementById("btnVentana").addEventListener("click", abrirVentana);
    //aquí la función se escribe directamente dentro (función anónima)
    document.getElementById("btnNueva").addEventListener("click", function () {
        window.location.reload();   //al recargar la página, se empieza otra partida
    });

    //COOKIE:
    //si hay un ultimo jugador guardado, lo mostramos en el perfil
    //leerCookie devuelve "" (cadena vacía) si no existe la cookie
    const ultimo = leerCookie("jugador");
    if (ultimo !== "") {
        //textContent = escribe SOLO texto dentro del elemento (más seguro que innerHTML)
        document.getElementById("ultimoJugador").textContent = "Último jugador: " + ultimo;
    }
});

//PERFIL DEL JUGADOR:
//aquí validaremos el nombre y la fecha
function validarPerfil() {

    //.value -> lo que hay escrito en el input (siempre es string)
    //.trim() -> quita los espacios del principio y del final 
    const nombre = document.getElementById("nombre").value.trim();
    //en un input type="date" el value es un texto con formato "AAAA-MM-DD"
    const fechaTexto = document.getElementById("fecha").value;
    const mensaje = document.getElementById("mensaje");

    //nombre o fecha vacios
    if (nombre === "" || fechaTexto === "") {
        mensaje.textContent = "Acceso denegado";
        return; //si falta algo -> mostramos error y salimos con return
    }

    // new Date("2005-03-20") convierte el texto en un objeto Date
    const fechaNacimiento = new Date(fechaTexto);
    const hoy = new Date();// new Date() sin nada -> fecha y hora actuales

    //como la fecha tiene que ser anterior a hoy
    //Las fechas se pueden comparar con >, <, >=
    //se comparan en milisegundos
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
    mensaje.textContent = ""; //limpiamos el posible error anterior
    mostrarPanel(nombre, edad); //pasamos nombre y edad a la siguiente 
}

//MÉTODOS DATE:
//calculamos la edad, definida arriba, con el método date
//se calcula a partir de la fecha de nacimineto
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    //restamos los años
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();//getFullYear() -> año con 4 cifras (2025)
    const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();//getMonth() -> mes de 0 a 11 (0 = enero, 11 = diciembre)

    //puede no haber cumplido años este año todavia, por eso le quitamos 1
    //caso 1 -> mesDiferencia < 0  -> su cumpleaños es en un mes que aún no ha llegado
    //caso 2 -> mismo mes (=== 0) pero el día de hoy es menor -> aún no es su cumpleaños
    //getDate() -> día del MES (1-31)
    //getDay() sería el día de la SEMANA 0-6
    if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad; //devolvemos el resultado a quien llamó a la función
}

//PANEL DEL JUGADOR:
function mostrarPanel(nombre, edad) {
    const panel = document.getElementById("panel");

    //METODOS STRING -> primera letra en mayuscula
    //charAt(0) -> primera letra
    //.toUpperCase() -> la pasa a mayúscula
    //slice(1) -> el resto desde la posición 1  ("ana" -> "na")
    //.toLowerCase() -> el resto en minúsculas
    //se juntan con + -> "A" + "na" = "Ana"
    nombreJugador = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    //escribimos los datos en el panel
    document.getElementById("tituloPanel").textContent = "Jugador: " + nombreJugador;
    document.getElementById("datoEdad").textContent = "Edad: " + edad + " años";

    //CAMBIO DE ESTILOS
    //azul -> menor de 18 verde -> mayor
    //elemento.style.propiedad -> valor
    //propiedades CSS con guion se escriben en camelCase:
    //background-color -> backgroundColor
    if (edad < 18) {
        panel.style.backgroundColor = "lightblue";
    } else {
        panel.style.backgroundColor = "lightgreen";
    }

    //LOCALSTORAGE:
    //aquí mostramos el record guardado solo si lo hay
    //getItem devuelve null si la clave no existe
    const record = localStorage.getItem("record");
    if (record !== null) {
        document.getElementById("record").textContent = record;
    }

    //COOKIE:
    //guardamos el nombre del ultimo jugador por 7 dias
    //max-age en SEGUNDOS: 7 d * 24 h * 60 min * 60 s = 604800
    //(sin "path=/" la cookie solo es visible desde la carpeta de esta página)
    document.cookie = "jugador=" + nombreJugador + "; max-age=604800";

    //escondemos el perfil y mostramos el panel
    //classList.add("oculto") -> pone la clase (display:none en el CSS)
    //classList.remove("oculto") -> la quita, y el panel se ve
    document.getElementById("perfil").classList.add("oculto");
    panel.classList.remove("oculto");
}

//LANZAR EL DADO:
function lanzar() {
    const resultado = document.getElementById("resultado");

    //vamos a crear el dado: Math.random() * 6 da 0-6, Math.floor() redondea hacia abajo, + 1 da 1-6
    //Math.random() -> decimal entre 0 y 0.999...
    //Math.random() * 6 -> decimal entre 0 y 5.999...
    //Math.floor(...) -> entero entre 0 y 5
    //+ 1 -> entero entre 1 y 6
    //para un dado de X caras: Math.floor(Math.random() * X) + 1
    const tirada = Math.floor(Math.random() * 6) + 1;

    tiradas.push(tirada);                          //guardamos la tirada en el array
    mejorTirada = Math.max(mejorTirada, tirada);   //Math.max() se queda con la mayor tirada

    //REGLA DEL JUEGO:
    //si sale 1, el contador vuelve a 0
    if (tirada === 1) {
        puntos = 0;
        resultado.textContent = "Has sacado un 1: ¡pierdes todos los puntos!";
    } else {
        puntos += tirada;
        resultado.textContent = "Has sacado un " + tirada;
    }

    document.getElementById("puntos").textContent = puntos;
    document.getElementById("listaTiradas").textContent =
        "Tiradas: " + tiradas.join(", ") + " (mejor: " + mejorTirada + ")";
        // join(", ") convierte el array en un texto separado por comas: [3,5,2] -> "3, 5, 2"

    //SESSIONSTORAGE: 
    //puntos de la partida actual
    //se borra al cerrar la pestaña, aquí solo se guarda (no se lee en ningún sitio)
    //para leerlo: sessionStorage.getItem("puntos") -> devuelvestring
    sessionStorage.setItem("puntos", puntos);

    // Comprobamos si ha ganado
    if (puntos >= PUNTOS_PARA_GANAR) {
        resultado.textContent = "¡Has ganado, " + nombreJugador + "! Lo has conseguido en " + tiradas.length + " tiradas";
        guardarRecord();
    }
}

//LOCALSTORAGE: 
//guarda el record si es mejor (menos tiradas) que el anterior
function guardarRecord() {
    const record = localStorage.getItem("record");

    //tiradas.length -> n de elementos del array = n de tiradas hechas
    //Number(record) -> convierte el texto guardado en número para comparar
    //si no hay récord (null) o hemos hecho menos tiradas, se guarda el nuevo
    if (record === null || tiradas.length < Number(record)) {
        localStorage.setItem("record", tiradas.length);//localStorage no caduca
        document.getElementById("record").textContent = tiradas.length;
    }
}

//VENTANA ADICIONAL:
function abrirVentana() {
    //window.open abre una ventana nueva con las medidas que pongamos en el width 
    //window.open(url, nombre, parámetros)
    //url "" -> ventana en blanco
    //"tiradas" -> nombre de la ventana (si ya existe, se reutiliza)
    //"width=300,height=250" -> tamaño (sin espacios entre parámetros)
    //devuelve el objeto window de la ventana nueva (o null si el navegador la bloquea)

    const ventana = window.open("", "tiradas", "width=300,height=250");

    //escribimos dentro de la ventana nueva, join() une el array con comas
    //ventana.document.body = el body de la ventana nueva
    //innerHTML -> aquí sí lo usamos porque metemos etiquetas HTML (<h2>, <p>)
    ventana.document.body.innerHTML =
        "<h2>Jugador: " + nombreJugador + "</h2>" +
        "<p>Puntos: " + puntos + "</p>" +
        "<p>Tiradas: " + tiradas.join(", ") + "</p>";
}

//COOKIES:
function leerCookie(clave) {
    //document.cookie devuelve todas las cookies en un string -> "jugador=Ana; otra=5"
    const cookies = document.cookie.split("; ");  //cada cookie está separada por "; "

    //ahora cookies = ["jugador=Ana", "otra=5"]
    for (let i = 0; i < cookies.length; i++) {
        const partes = cookies[i].split("=");  //partes[0] = nombre, partes[1] = valor
        if (partes[0] === clave) {
            return partes[1]; //encontrada -> devolvemos su valor
        }
    }
    return "";   //si no la encuentra
}


