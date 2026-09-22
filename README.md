# Juegos de Mesa

App web (PWA) con el resumen de reglas de **Scopa**, **Solitario Pirámide**, **Crisps!** y **Tien Len**.
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

**Antes de subir, sube la versión de la caché en `sw.js`** (`const CACHE = "juegos-v3"`).
Si no lo haces, los móviles que ya tengan la app instalada seguirán viendo la
versión vieja para siempre: el service worker sirve desde caché y nunca vuelve
a pedir los ficheros.

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
Después de cambiar, sube la versión de caché en `sw.js` si ya la tenías instalada
en el móvil.

## Editar el contenido

Las reglas están en `index.html`, un bloque `<div class="wrap gv" id="g-...">` por
juego, cada uno con su panel `.resumen` arriba y las secciones de detalle debajo.
Las cartas se escriben con el componente `<b class="k">`, que dibuja el palo desde
el sprite SVG del principio del fichero (`#sp #he #di #cl` y `#oro #copa #esp #bas`). Para añadir un quinto juego:

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

Modificadores: `class="k big"` la hace más grande, `class="k face"` dibuja los
pips repartidos como en una carta de verdad (se usa en el abanico de portada).

## Sobre las reglas

Son resúmenes de consulta rápida, no reglamentos oficiales. Donde hay variantes
conocidas (pasadas del Pirámide, cortes del Tien Len, versiones de Crisps!) aparece
señalado en la propia app.

Crisps! es un juego reciente con *living rulebook*: conviene confirmar la versión
antes de jugar con gente de fuera.
