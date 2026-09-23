# Juegos de Mesa

App web (PWA) con el resumen de reglas de **Scopa**, **Solitario Pirámide**, **Crisps!**,
**Tien Len**, **Golf**, **Hearts**, **Hearts a 2 jugadores**, y cuatro juegos originales de
David Parlett: **Duck Soup**, **Bugami**, **Bravado** y **Dracula**.
Se instala en la pantalla de inicio del iPhone y funciona **sin conexión**.

**En línea: https://carlos-carmona-777.github.io/juegos-de-mesa/**

## Qué hay aquí

```
index.html              toda la app: contenido, estilos y lógica en un solo fichero
manifest.webmanifest    nombre, iconos y modo pantalla completa
sw.js                   service worker: guarda todo en caché para el modo offline
fonts/                  Bodoni Moda + IBM Plex Sans autoalojadas (nada de CDN)
icons/                  iconos PNG, incluido el apple-touch-icon de 180 px
.claude/launch.json     config para levantar el servidor local de pruebas
```

No hay dependencias, ni build, ni node_modules. Son ficheros estáticos.

## Probarlo en el Mac

```bash
cd "/Users/carloscarmona/1_APPS/REGLAS JUEGOS" && python3 -m http.server 8777
```

Y abre <http://localhost:8777>.

> El service worker **no se registra con `file://`**. Para probar el modo offline hace
> falta servirlo por HTTP, aunque sea en local.

## Instalarlo en el iPhone

Ya está publicado en GitHub Pages, así que solo queda:

1. Abre <https://carlos-carmona-777.github.io/juegos-de-mesa/> en **Safari**
   (tiene que ser Safari; Chrome en iOS no instala PWAs).
2. Botón **Compartir** → **Añadir a pantalla de inicio**.
3. Ábrela una vez con datos o wifi para que se descargue entera.
4. A partir de ahí funciona en avión, en el metro y sin cobertura.

## Publicar cambios

```bash
cd "/Users/carloscarmona/1_APPS/REGLAS JUEGOS" && git add -A && git commit -m "..." && git push
```

GitHub Pages reconstruye solo, en un minuto más o menos.

Y ya está: **los cambios de `index.html` llegan solos** a los móviles que tengan la
app instalada. El service worker pide la página a la red cada vez que se abre la
app y solo tira de la copia guardada si no hay cobertura (o si la red tarda más de
3 segundos), así que basta con abrirla una vez con datos para tener la última
versión. Ya no hay que tocar nada a mano para eso.

**Solo hay que subir `const CACHE` en `sw.js`** si cambias **fuentes, iconos o el
manifest**, porque esos sí se sirven siempre desde caché. Cambiar el número obliga
a volver a descargar la lista entera de `ASSETS`.

> Al abrir la app sin cobertura se sirve lo último que se descargó, no la versión
> del día de la instalación: cada vez que se abre con red, la copia guardada se
> actualiza.

## Volver a la versión anterior

El proyecto es un repositorio git con dos versiones etiquetadas:

| Etiqueta | Cómo es |
|---|---|
| `sobria` | Cartas simples (número + palo), sin guirnalda, títulos planos |
| `festiva` | Cartas realistas con índices en las dos esquinas, guirnalda, toldo en el RESUMEN |

Para volver a la sobria:

```bash
cd "/Users/carloscarmona/1_APPS/REGLAS JUEGOS" && git checkout sobria -- index.html
```

Y para recuperar la festiva:

```bash
cd "/Users/carloscarmona/1_APPS/REGLAS JUEGOS" && git checkout festiva -- index.html
```

Solo cambia `index.html`; fuentes, iconos y service worker valen para las dos.
Después de cambiar solo hay que hacer commit y push: al abrir la app con red, el
móvil se trae la versión que haya publicada.

## Editar el contenido

Las reglas están en `index.html`, un bloque `<div class="wrap gv" id="g-...">` por
juego, cada uno con su panel `.resumen` arriba y las secciones de detalle debajo.
Las cartas se escriben con el componente `<b class="k">`, que dibuja el palo desde
el sprite SVG del principio del fichero (`#sp #he #di #cl` y `#oro #copa #esp #bas`). Para añadir un juego nuevo:

1. Duplica uno de esos bloques y cámbiale el `id` (`g-loquesea`).
2. Añade un `<li>` en la lista `#list` con `data-go="loquesea"` y sus `data-k`
   (palabras clave para el buscador).
3. Añade `"loquesea"` al array `GAMES` y su nombre a `TITLES`, en el `<script>`.
4. Define un color de acento en `:root` y en los dos bloques de tema oscuro.

### Cómo se escriben las cartas

Cada carta es un `<b class="k" data-c="...">` vacío; el script del final del
fichero le dibuja la cara. El código son rango + palo:

```
data-c="Kh"    rey de corazones        data-c="7o"   siete de oros
data-c="10s"   diez de picas           data-c="Rb"   rey de bastos
data-c="9"     nueve sin palo (Crisps)
```

Palos: `s` picas · `h` corazones · `d` diamantes · `c` tréboles ·
`o` oros · `p` copas · `e` espadas · `b` bastos.
Rangos: `A 2…10 J Q K` y `S` sota, `C` caballo, `R` rey.
Comodín: `data-c="X"`, sin palo (dibuja una estrella; en Dracula hace de vampiro).

Modificadores: `class="k big"` la hace más grande, `class="k face"` dibuja los
pips repartidos como en una carta de verdad (se usa en el abanico de portada).

## Sobre las reglas

Son resúmenes de consulta rápida, no reglamentos oficiales. Donde hay variantes
conocidas (pasadas del Pirámide, cortes del Tien Len, versiones de Crisps!) aparece
señalado en la propia app.

Crisps! es un juego reciente con *living rulebook*: conviene confirmar la versión
antes de jugar con gente de fuera.

**Hearts a 2 jugadores** sigue la versión de *2 Player Hearts* de gamerules.com (la del
vídeo de *Riffle Shuffle & Roll*): baraja recortada a 28 cartas quitando 3, 5, 7, 9, J y K,
**los corazones son triunfo**, dos cartas muertas que nadie ve, 13 bazas y 20 puntos por
mano (7 corazones + 13 de la dama de picas). No es el Hearts de cuatro con dos personas:
si alguien propone la otra versión que circula —baraja entera, 13 cartas cada uno y un mazo
de 26 del que se roba tras cada baza— hay que pactar cuál se juega antes de repartir.

Los cuatro juegos de **David Parlett** (Duck Soup, Bugami, Bravado y Dracula) están
resumidos de sus reglamentos originales en <https://www.parlettgames.uk/oricards/>. Donde
el reglamento deja algo abierto y la ficha lo concreta, lo dice: por ejemplo, que en Dracula
los multiplicadores no se acumulan, que se deduce de sus propios ejemplos.

El **Golf** de la ficha es el de rejilla de 6 cartas; no confundir con el solitario
del mismo nombre. Las variantes de 4 y de 9 cartas están en su última sección.
