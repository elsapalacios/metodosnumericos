# Métodos Numéricos — Introducción y Teoría de errores

Sitio web estático (HTML + CSS + JavaScript, sin framework y sin backend)
con los seis temas de la unidad, construido a partir del documento de
Word y la estructura acordados previamente.

## Estructura de carpetas

```
/
├── index.html                      → Inicio
├── introduccion/index.html         → 1. ¿Qué es un método numérico?
├── representacion-numeros/index.html
├── aritmetica-punto-flotante/index.html
├── errores-redondeo/index.html
├── algoritmos-convergencia/index.html
├── python-metodos-numericos/index.html   → incluye una calculadora de error en vivo
├── recursos/index.html
├── acerca-de/index.html
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── fonts/  (Bricolage Grotesque, Instrument Sans, JetBrains Mono; alojadas localmente)
    └── img/
```

Cada tema vive en su propia carpeta con un `index.html`, tal como se pidió,
así que las rutas quedan limpias: `/introduccion/`, `/python-metodos-numericos/`, etc.

## ¿Hace falta una base de datos?

No. Todo el contenido es fijo (el mismo para cualquier visitante) y la
única pieza interactiva —la calculadora de error absoluto/relativo en la
página de Python— calcula en el navegador con JavaScript, sin guardar
nada. Por eso el sitio es 100% estático: no necesita servidor backend ni
base de datos, lo que además lo hace más simple, rápido y barato de alojar.

Si en el futuro se agrega algo que sí necesite persistencia (por ejemplo,
un quiz que guarde calificaciones, o comentarios), lo más adecuado sería
una base de datos ligera como **SQLite** (si se agrega un backend pequeño
en Node/Express) o un servicio gestionado tipo **Supabase/PostgreSQL**
(si se prefiere no mantener servidor propio). Para el sitio actual, no es
necesario.

## Ver el sitio en tu computador

No requiere instalación. Dos opciones:

1. Abrir `index.html` directamente con doble clic (todo funciona: enlaces,
   estilos, tipografías y la calculadora).
2. O, para navegar exactamente como en producción, levantar un servidor
   local simple desde esta carpeta:
   ```
   python3 -m http.server 8000
   ```
   y abrir `http://localhost:8000`.

## Publicarlo en Render

Sí, se puede con Render. Al ser un sitio 100% estático, se publica como
**Static Site** (no como Web Service):

1. Sube esta carpeta a un repositorio de GitHub (o GitLab).
2. En Render → **New +** → **Static Site**.
3. Conecta el repositorio.
4. Configuración de build:
   - **Build Command**: dejar vacío (no hay nada que compilar).
   - **Publish directory**: `.` (la raíz del repositorio).
5. Crear el servicio. Render te da una URL pública (`https://tu-sitio.onrender.com`)
   y vuelve a publicar automáticamente cada vez que hagas push.

Alternativas igual de válidas para un sitio estático como este: **GitHub
Pages**, **Netlify** o **Vercel** — el mismo contenido de esta carpeta
sirve para cualquiera de ellas, sin cambios.

## Autores

Elsa Mery Palacios Salinas · Álvaro Chaverra Palacios · Brayan Steban Salas · Bryhan Valoyes Palacios
Facultad de Ingeniería de Sistemas — 7.º semestre · Fundación Universitaria Claretiana (Uniclaretiana)
Docente: Nancy González Ramírez
