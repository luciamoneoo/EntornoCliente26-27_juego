## 0. Mapa rápido: qué requisito cumple cada parte de mi código

| Requisito del enunciado | Dónde está en mi código |
|---|---|
| 1. Perfil de jugador (nombre y fecha, «Acceso denegado») | `validarPerfil()` + `#perfil` en el HTML |
| 2. String | `charAt`, `toUpperCase`, `slice`, `toLowerCase` en `mostrarPanel()` |
| 2. Date | `calcularEdad()`: `getFullYear`, `getMonth`, `getDate` |
| 2. Estilos según los datos | `panel.style.backgroundColor` según la edad en `mostrarPanel()` |
| 3. Números aleatorios | `Math.random()` en `lanzar()` |
| 3. Redondear | `Math.floor()` en `lanzar()` |
| 3. Otra función de Number/Math | `Math.max()` (y `Number()` en `guardarRecord()`) |
| 3. Array | `tiradas` con `push`, `join` y `length` |
| 4. Ventana adicional | `abrirVentana()` con `window.open` |
| 5. Cookie | `document.cookie` en `mostrarPanel()` y `leerCookie()` |
| 5. localStorage | `guardarRecord()` y lectura en `mostrarPanel()` |
| 5. sessionStorage | `sessionStorage.setItem('puntos', ...)` en `lanzar()` |
| 6. Script en el head | `<script>` en el `<head>` + `DOMContentLoaded` |
| Cambiar de pantalla / recargar | `window.location.reload()` en el botón Nueva partida |

---

## 1. Creación de perfil de jugador

**Dónde está:** `index.html` (`#perfil`: inputs `nombre` y `fecha`, botón `btnEntrar`) y `validarPerfil()` en `juego.js`.

**Flujo:** clic en Entrar → `validarPerfil()` → lee nombre y fecha → comprueba (vacíos, fecha futura, edad mínima) → si algo falla escribe «Acceso denegado» y hace `return` → si todo va bien llama a `mostrarPanel(nombre, edad)`.

### Cambios típicos

Cambiar la edad mínima: solo la constante de arriba.

```javascript
const EDAD_MINIMA = 16;
```

Nombre de al menos 3 letras (añadir en el primer `if`):

```javascript
if (nombre === '' || nombre.length < 3 || fechaTexto === '') { ... }
```

Mensajes de error distintos (en vez de siempre «Acceso denegado», aunque el enunciado pide ese texto, así se justifica cada caso):

```javascript
if (nombre === '') { mensaje.textContent = 'Acceso denegado: falta el nombre'; return; }
if (fechaTexto === '') { mensaje.textContent = 'Acceso denegado: falta la fecha'; return; }
```

Mensaje de error en rojo:

```javascript
mensaje.style.color = 'red';
```

Nombre solo con letras (expresión regular + `test`):

```javascript
if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre)) { mensaje.textContent = 'Acceso denegado'; return; }
```

Edad máxima o año mínimo razonable:

```javascript
if (edad > 120) { mensaje.textContent = 'Acceso denegado'; return; }
if (fechaNacimiento.getFullYear() < 1900) { mensaje.textContent = 'Acceso denegado'; return; }
```

Fecha incorrecta (texto raro): un `<input type='date'>` ya evita casi todo, pero la comprobación genérica es `isNaN(fechaNacimiento.getTime())`.

---

## 2. Personalización del entorno

**Dónde está:** `mostrarPanel(nombre, edad)` y `calcularEdad(fechaNacimiento)`.

### 2.1 String (nombre formateado)

Mi código: `nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase()` → «ana» pasa a «Ana».

```javascript
nombre.toUpperCase()          // TODO EN MAYÚSCULAS
nombre.toLowerCase()          // todo en minúsculas
nombre.length                 // nº de letras
nombre.split(' ')[0]          // solo el primer nombre (si escribe nombre y apellido)
nombre.slice(0, 3)            // las 3 primeras letras
nombre.includes('a')          // true/false
nombre.indexOf('a')           // posición de la primera 'a' (-1 si no hay)
nombre.replaceAll('a', '4')   // cambia todas las 'a'
nombre.padEnd(10, '*')        // 'Ana*******'
```

Cada palabra con inicial mayúscula (para nombre y apellido):

```javascript
nombreJugador = nombre.split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
```

Mostrar iniciales:

```javascript
const iniciales = nombre.split(' ').map(p => p.charAt(0).toUpperCase()).join('');
```

### 2.2 Date

Mi código: `calcularEdad` usa `getFullYear()`, `getMonth()` (0 a 11) y `getDate()` (día del mes) para saber si ya cumplió años este año.

Para mostrar otros datos hay que pasar la fecha a `mostrarPanel`:

```javascript
// en validarPerfil():
mostrarPanel(nombre, edad, fechaNacimiento);

// la función:
function mostrarPanel(nombre, edad, fechaNacimiento) { ... }
```

```javascript
// Fecha de nacimiento formateada
fechaNacimiento.toLocaleDateString('es-ES');      // 20/3/2005

// Año y mes de nacimiento
fechaNacimiento.getFullYear();
fechaNacimiento.getMonth() + 1;                   // +1 porque el mes va de 0 a 11

// Día de la semana en que nació
const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
dias[fechaNacimiento.getDay()];                   // getDay: 0 = domingo

// Mes en letras
const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
meses[fechaNacimiento.getMonth()];

// Días vividos (restar fechas da milisegundos)
const hoy = new Date();
Math.floor((hoy - fechaNacimiento) / (1000 * 60 * 60 * 24));

// Días que faltan para el próximo cumpleaños
let proximo = new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());
if (proximo < hoy) { proximo.setFullYear(hoy.getFullYear() + 1); }
Math.ceil((proximo - hoy) / (1000 * 60 * 60 * 24));

// ¿Es hoy su cumpleaños?
hoy.getDate() === fechaNacimiento.getDate() && hoy.getMonth() === fechaNacimiento.getMonth();

// Hora de entrada al juego
new Date().toLocaleTimeString('es-ES');
```

Para mostrarlo: `document.getElementById('datoEdad').textContent += ' · Nació un ' + dias[fechaNacimiento.getDay()];` (o crear otro `<p id='...'></p>` en el HTML y rellenarlo).

### 2.3 Estilos del panel según los datos

Mi código: fondo `lightblue` si `edad < 18`, `lightgreen` si no.

```javascript
// Tres tramos
if (edad < 18) { panel.style.backgroundColor = 'lightblue'; }
else if (edad < 65) { panel.style.backgroundColor = 'lightgreen'; }
else { panel.style.backgroundColor = 'lightyellow'; }

// Color de TEXTO según la edad
panel.style.color = edad < 18 ? 'navy' : 'darkgreen';

// Según el NOMBRE: longitud o primera letra
panel.style.backgroundColor = nombre.length > 5 ? 'pink' : 'lightgray';
panel.style.color = nombre.charAt(0).toLowerCase() === 'a' ? 'red' : 'black';

// Según la HORA (modo noche)
if (new Date().getHours() >= 20) { panel.style.backgroundColor = 'black'; panel.style.color = 'white'; }

// Otras propiedades (con unidades!)
panel.style.border = '3px solid black';
panel.style.fontSize = '20px';
panel.style.borderRadius = '20px';
```

Con clases CSS (alternativa limpia): en `estilos.css` escribir `.menor { background-color: lightblue; }` y `.adulto { background-color: lightgreen; }`, y en JS:

```javascript
panel.classList.add(edad < 18 ? 'menor' : 'adulto');
```

---

## 3. Interacción y sistema de puntuación

**Dónde está:** `lanzar()` y `guardarRecord()`; array `tiradas`; variables `puntos` y `mejorTirada`.

**Lo que cumple:** número aleatorio (`Math.random`), redondeo (`Math.floor`), otra función (`Math.max`), y un array (`tiradas`).

**Fórmula del dado:** `Math.floor(Math.random() * 6) + 1` → `random` da de 0 a 0,999…; por 6 de 0 a 5,999…; `floor` quita decimales (0 a 5); `+ 1` lo lleva a 1–6.

### Cambios típicos

```javascript
// Dado de N caras
Math.floor(Math.random() * 10) + 1;                    // 1 a 10

// Entero entre min y max (ambos incluidos)
Math.floor(Math.random() * (max - min + 1)) + min;

// Otros redondeos
Math.round(x); Math.ceil(x); Math.trunc(x);
x.toFixed(2);                                          // 2 decimales (devuelve STRING)

// Otras funciones
Math.min(a, b); Math.abs(-4); Math.pow(2, 3); Math.sqrt(16);
Number.isInteger(x); Number('7'); parseInt('7px'); parseFloat('3.5');
```

Cambiar reglas de puntuación (dentro de `lanzar()`):

```javascript
// El 6 da bonus: suma el doble
if (tirada === 6) { puntos = puntos + 12; resultado.textContent = '¡Un 6! Doble de puntos'; }

// El 1 solo resta 3 puntos (sin bajar de 0)
if (tirada === 1) { puntos = Math.max(0, puntos - 3); }

// Cambiar los puntos para ganar
const PUNTOS_PARA_GANAR = 30;      // y cambiar también el '/ 20' del HTML

// No seguir tirando una vez ganado (primera línea de lanzar)
if (puntos >= PUNTOS_PARA_GANAR) { return; }
```

Operaciones con el array `tiradas`:

```javascript
tiradas[tiradas.length - 1];                  // última tirada
tiradas.pop();                                // quita la última (deshacer)
tiradas.slice(-3);                            // las 3 últimas
tiradas.slice().sort((a, b) => a - b);        // ordenadas de menor a mayor
tiradas.filter(t => t === 6).length;          // cuántos seises
tiradas.includes(1);                          // ¿ha salido algún 1?
Math.min(...tiradas);                         // tirada más baja
const suma = tiradas.reduce((acum, t) => acum + t, 0);
const media = (suma / tiradas.length).toFixed(2);   // media con 2 decimales
```

Añadir una acción nueva (ej. botón «Bonus») – son siempre 4 pasos:

```html
<!-- 1) HTML: botón dentro de #panel -->
<button id='btnBonus'>Bonus</button>
```

```javascript
// 2) En DOMContentLoaded: asociar el clic
document.getElementById('btnBonus').addEventListener('click', bonus);

// 3) La función (suma un número aleatorio redondeado entre 1 y 10)
function bonus() {
    const extra = Math.round(Math.random() * 9) + 1;
    puntos = puntos + extra;
    document.getElementById('puntos').textContent = puntos;
    document.getElementById('resultado').textContent = 'Bonus: +' + extra;
    sessionStorage.setItem('puntos', puntos);     // 4) mantener el almacenamiento al día
}
```

Un segundo array (por ejemplo misiones completadas): `let misiones = [];` arriba del todo, `misiones.push('Sacar un 6');` cuando se cumpla, y `misiones.join(', ')` para mostrarlo.

---

## 4. Ventana adicional

**Dónde está:** `abrirVentana()` (botón Ver tiradas).

```javascript
const ventana = window.open('', 'tiradas', 'width=300,height=250');
ventana.document.body.innerHTML = '<h2>Jugador: ' + nombreJugador + '</h2>' + ...;
```

`window.open(url, nombre, parámetros)`: URL vacía = ventana en blanco; nombre identifica la ventana (si existe se reutiliza); los parámetros van separados por comas sin espacios.

### Cambios típicos

```javascript
// Más datos en la ventana (edad, récord, hora)
'<p>Récord: ' + localStorage.getItem('record') + '</p>' +
'<p>Abierta a las ' + new Date().toLocaleTimeString('es-ES') + '</p>'

// Otro tamaño y posición
window.open('', 'tiradas', 'width=500,height=400,left=100,top=50');

// Avisar si el navegador la bloquea
if (!ventana) { alert('Ventana bloqueada'); return; }

// Una pista aleatoria
const pistas = ['Un 1 lo pierde todo', 'Necesitas 20 puntos', 'Suerte'];
'<p>Pista: ' + pistas[Math.floor(Math.random() * pistas.length)] + '</p>'

// Cerrar la ventana a los 5 segundos
setTimeout(() => ventana.close(), 5000);

// Poner el contenido con textContent en vez de innerHTML (solo texto)
ventana.document.body.textContent = 'Hola ' + nombreJugador;

// Mostrar la ventana otra vez al frente
ventana.focus();
```

---

## 5. Almacenamiento del navegador

El enunciado exige usar cookies, sessionStorage y localStorage al menos una vez cada uno.

| Herramienta | Qué guardo | Dónde se guarda | Dónde se lee |
|---|---|---|---|
| Cookie `jugador` (7 días) | Nombre del último jugador | `mostrarPanel()` | `DOMContentLoaded` con `leerCookie('jugador')` |
| localStorage `record` | Menos tiradas para ganar | `guardarRecord()` | `mostrarPanel()` |
| sessionStorage `puntos` | Puntos de la partida actual | `lanzar()` | (no se lee todavía) |

### Cambios típicos

#### Cookies

```javascript
// Duración en SEGUNDOS: 1 hora = 3600, 1 día = 86400, 7 días = 604800
document.cookie = 'jugador=' + nombreJugador + '; max-age=3600';

// Visible en toda la web
document.cookie = 'jugador=' + nombreJugador + '; max-age=3600; path=/';

// Con fecha de caducidad
const caduca = new Date();
caduca.setDate(caduca.getDate() + 7);
document.cookie = 'jugador=' + nombreJugador + '; expires=' + caduca.toUTCString();

// Otra cookie (por ejemplo la edad)
document.cookie = 'edad=' + edad + '; max-age=604800';

// Borrar una cookie (mismo path con el que se creó)
document.cookie = 'jugador=; max-age=0';
```

#### localStorage

```javascript
localStorage.setItem('clave', valor);
localStorage.getItem('clave');        // string, o null si no existe
localStorage.removeItem('clave');     // borra solo esa clave

// Récord de MAYOR puntuación (en vez de menos tiradas)
const maximo = localStorage.getItem('maximo');
if (maximo === null || puntos > Number(maximo)) {
    localStorage.setItem('maximo', puntos);
}

// Guardar un array: hay que convertirlo a texto
localStorage.setItem('tiradas', JSON.stringify(tiradas));
const guardadas = JSON.parse(localStorage.getItem('tiradas'));
```

#### sessionStorage: reanudar la partida

Leer los puntos guardados al entrar (en `mostrarPanel()`):

```javascript
const guardados = sessionStorage.getItem('puntos');
if (guardados !== null) {
    puntos = Number(guardados);       // getItem devuelve string: convertir
    document.getElementById('puntos').textContent = puntos;
}
```

Y para que Nueva partida empiece de cero, antes del `reload`:

```javascript
sessionStorage.removeItem('puntos');
window.location.reload();
```

Botón para borrar el récord: `<button id='btnBorrar'>Borrar récord</button>` +

```javascript
localStorage.removeItem('record');
document.getElementById('record').textContent = '-';
```
---

## 6. Carga del script

**Requisito:** el script va en el `<head>` y hay que emplear los eventos o propiedades necesarios para que funcione.

**Mi solución:** `<script src='js/juego.js'></script>` en el head y todo el código que toca el DOM dentro de `window.addEventListener('DOMContentLoaded', function () { ... })`.

Tres formas válidas (por si piden cambiar):

```javascript
// A) DOMContentLoaded (la que uso): el DOM está listo, las imágenes pueden no estarlo
window.addEventListener('DOMContentLoaded', function () { ... });

// B) onload: espera a que cargue TODO (imágenes, estilos...). Solo admite un manejador
window.onload = function () { ... };

// C) defer en el HTML (sin DOMContentLoaded en el JS): solo con scripts externos
// <script defer src='js/juego.js'></script>
```

Para cambiar de pantalla: `window.location.href = 'otra.html';` redirige; `window.location.reload();` recarga la misma.

---

## 7. Cosas que suelen fallar (y cómo comprobarlo)

Abre la consola con **F12 → Console**; los errores aparecen en rojo con el número de línea.

| Síntoma | Causa probable |
|---|---|
| `Cannot read properties of null` | `id` mal escrito en JS o en HTML, o script ejecutándose antes de cargar el DOM |
| `X is not defined` | Función o variable mal escrita, o declarada dentro de otra función |
| El botón no hace nada | Falta el `addEventListener`, o se escribió `lanzar()` con paréntesis |
| El texto no aparece | Se escribió en un `id` que no existe, o se usa `.value` en vez de `.textContent` |
| Nada carga | Ruta mal en `<script src>` o `<link href>` (carpetas `js/` y `css/`) |
| La cookie no se ve en otra página | Falta `path=/` |
| Estilo que no cambia | Propiedad en formato CSS (`background-color`) en vez de camelCase, o falta la unidad (`'10px'`) |

---
