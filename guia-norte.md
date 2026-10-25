# Norte con Astro y TypeScript — Guía SENATI (versión Markdown para IA)

> Fuente: `guia-senati-norte.pdf` · Versión del material: 25-oct-2026 · Proyecto de referencia: Norte 0.0.1
> Stack: Astro 7.4.2 · TypeScript 7.0.2 · Tailwind CSS 4.3.3 · pnpm 12.3.4 · Node.js 24 LTS
> Todos los bloques de código están completos y son el contenido literal de cada archivo. Las rutas son relativas a la raíz del proyecto `norte-senati/`.

---

## 1. Qué se construye

App web **Norte**. Pantalla principal **Hoy**: prioridades, agenda de ejemplo, hábitos, formulario de captura. Más una página `/design` que documenta colores, tipografía y componentes.

| Parte | Comportamiento |
|---|---|
| Pantalla Hoy | Prioridades, agenda, hábitos y áreas personales |
| Añadir pendiente | Modal con título y selector de área |
| Captura rápida | Convierte el texto en pendiente del área **Trabajo** |
| Casillas | Marcan tareas/hábitos y actualizan contadores |
| Guardado | `localStorage` en el mismo navegador |
| Ritmo del día | Cambia texto orientativo y conserva la selección del día |
| Navegación móvil | Barra lateral con controles propios |
| Guía visual | Ruta `/design` |
| IA | Pendiente de integrar |
| Voz | Solo muestra información; no graba ni envía audio |
| Agenda | Ejemplos fijos; no programa eventos |
| Usuarios / sincronización | Pendientes |

No se necesitan cuentas de IA, claves API, base de datos ni tarjeta. Se necesita Internet para descargar dependencias. La fuente Inter se carga desde `rsms.me`; si falla, se usa fuente del sistema.

Dos recorridos: **construcción desde cero** (secciones 2–16) o **ejecución de referencia** (secciones 3–4 + 17 con el ZIP del docente).

Convenciones: bloques "Archivo completo" reemplazan todo el archivo. Bloques "Ejemplo de explicación" son solo para estudiar. El catálogo privado `application-ui-v4` del docente NO es dependencia ni se necesita.

## 2. Herramientas

| Herramienta | Uso |
|---|---|
| Visual Studio Code | Editor + terminal |
| Navegador | Ver y probar |
| Node.js | Ejecutar herramientas |
| npm | Instalar pnpm |
| pnpm | Dependencias y comandos |
| Astro | Páginas, componentes, sitio estático |
| TypeScript | JS con tipos |
| Tailwind CSS | Utilidades y variables de diseño |
| Heroicons vía Iconify | Iconos SVG |

Frontend = lo que corre en el navegador. Backend = lógica en servidor (no se construye aquí). Aquí Astro genera un sitio **estático** y TypeScript da interacción en el navegador.

Plan sugerido: (1) herramientas 60–90 min, (2) configuración y primera página 90 min, (3) estilos/marca/componentes 2–3 h, (4) layouts y pantallas 2–3 h, (5) interacción y almacenamiento 3–4 h, (6) pruebas y sustentación 90 min.

## 3. Instalar el entorno

- **VS Code**: instalar; en Windows habilitar agregar al PATH. Extensiones: `astro-build.astro-vscode` y `bradlc.vscode-tailwindcss`.
- **Node.js 24 LTS** (probado con 24.21.0). Astro 7.4.2 declara Node `>=22.23.4`. Verificar:

```sh
node --version
npm --version
```

- **pnpm**:

```sh
npm install --global pnpm@12.3.4
pnpm --version
```

Debe mostrar `12.3.4`. No hace falta Corepack.
- Windows: si PowerShell bloquea `npm.ps1`/`pnpm.ps1`, usar Command Prompt o `npm.cmd`/`pnpm.cmd`. No cambiar políticas de ejecución ni desactivar antivirus.
- macOS/Linux: terminal habitual; los comandos son iguales.

## 4. Crear la carpeta

```sh
mkdir proyectos-senati
cd proyectos-senati
mkdir norte-senati
cd norte-senati
code .
```

Crear carpetas manualmente: `public/brand/`, `src/components/ui/`, `src/layouts/`, `src/lib/`, `src/pages/`, `src/styles/`. **No** ejecutar `create astro` en esta carpeta.

## 5. Paquetes y configuración

### `package.json`

```json
{
  "name": "asistente-personal",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@12.3.4",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^7.4.2"
  },
  "devDependencies": {
    "@iconify-json/heroicons": "^1.2.3",
    "@tailwindcss/vite": "^4.3.3",
    "tailwindcss": "^4.3.3",
    "typescript": "^7.0.2"
  }
}
```

JSON: comillas dobles, sin comentarios, cuidar comas. Instalar también devDependencies (Tailwind e iconos participan en la compilación). `^` permite actualizaciones compatibles; por eso importa `pnpm-lock.yaml`.

```sh
pnpm install
```

Crea `node_modules` y `pnpm-lock.yaml` (no crear a mano).

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Tailwind **4**: NO usar `tailwindcss init -p` ni directivas de Tailwind 3. El CSS empieza con `@import "tailwindcss"` y los tokens van en `@theme`.

### `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Alias `@/*` → `./src/*` (no es una carpeta llamada `@`).

### `.gitignore`

```text
node_modules/
dist/
.astro/
.wrangler/
.env
.env.*
!.env.example
.dev.vars
.dev.vars.*
*.log
.DS_Store
```

Git es opcional; se puede entregar ZIP con esas exclusiones.

## 6. Primera página (temporal)

`src/pages/index.astro`:

```astro
---
const nombre = 'Estudiante de SENATI';
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mi primera página con Astro</title>
  </head>
  <body>
    <h1>Hola, {nombre}</h1>
    <p>Mi entorno de trabajo ya funciona.</p>
  </body>
</html>
```

```sh
pnpm dev
```

Normalmente `http://localhost:4321` (usar el puerto que indique la terminal). Detener con `Ctrl + C`.

Archivo Astro: la zona entre `---` (frontmatter) se ejecuta al **generar** la página, no en cada clic. Abajo va la plantilla; `{nombre}` inserta variables. Para clics o `localStorage` hace falta un `<script>` que Astro envíe al navegador.

## 7. Sistema de estilos

Marfil de fondo, verde pino para acciones, Inter (UI) + Georgia (títulos). Los valores compartidos son *tokens de diseño*.

### `src/styles/global.css`

```css
@import "tailwindcss";

@theme {
  --font-sans: 'InterVariable', 'Inter', system-ui, sans-serif;
  --font-display: Georgia, 'Times New Roman', serif;
  --color-canvas: #faf9f6;
  --color-paper: #ffffff;
  --color-ink: #26352f;
  --color-muted: #68716b;
  --color-pine: #244d40;
  --color-pine-light: #e9eee7;
  --color-sand: #f0eee7;
  --color-bronze: #aa7548;
  --color-danger: #a04438;
}

@layer base {
  html { scroll-behavior: smooth; scroll-padding-top: 6rem; }
  body { font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; font-size: 0.875rem; }
  h1, h2, h3 { text-wrap: balance; font-weight: 500; }
  p { text-wrap: pretty; }
  button, a, input, textarea { -webkit-tap-highlight-color: transparent; }
  button { cursor: pointer; }
  button:disabled { cursor: not-allowed; opacity: .5; }
  a, button, input, textarea, [tabindex] { outline-color: var(--color-pine); }
  :focus-visible { outline: 2px solid var(--color-pine); outline-offset: 3px; }
  input:focus-visible, textarea:focus-visible { outline-offset: -1px; }
  [hidden] { display: none !important; }
  ::selection { background: #d9e4d6; }
}

@utility btn {
  position: relative; display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
  height: 2.375rem; padding: 0 .875rem; border-radius: .5rem; font-size: .8125rem; font-weight: 500; white-space: nowrap;
  &:has(svg) { padding-left: .65rem; }
  &:has(svg):not(:has(:not(svg))) { min-width: 2.375rem; }
  @media (pointer: coarse) { &::after { content: ''; position: absolute; inset: -.3125rem; } }
}
@utility btn-primary { background: var(--color-pine); color: white; &:hover { background: #193d31; } }
@utility btn-secondary { border: 1px solid #26352f26; background: transparent; &:hover { background: var(--color-sand); } }
@utility btn-ghost { color: var(--color-muted); &:hover { background: #26352f08; color: var(--color-pine); } }

/* App shell - adapted from the external catalogue's sidebar/header pattern. */
.app-shell { min-height: 100dvh; }
.sidebar { position: fixed; inset: 0 auto 0 0; z-index: 30; width: 15.5rem; padding: 2rem 1.25rem 1rem; background: #f2f1eb; border-right: 1px solid #26352f0d; display: flex; flex-direction: column; }
.sidebar-brand { display: flex; align-items: center; justify-content: space-between; padding: 0 .625rem; }
.brand { display: inline-flex; align-items: center; gap: .5rem; color: var(--color-pine); }
.brand img { flex-shrink: 0; }
.brand span { font-family: var(--font-display); font-size: 2.5rem; line-height: 1; letter-spacing: -.12rem; padding-bottom: .25rem; }
.sidebar-caption { margin: 1.75rem .75rem 1rem; color: var(--color-muted); font-size: .75rem; }
.nav-list { display: flex; flex-direction: column; gap: .375rem; }
.nav-link { display: flex; align-items: center; gap: .75rem; padding: .75rem; color: #606c63; border-radius: .5rem; font-weight: 500; }
.nav-link svg:last-child:not(:first-child) { margin-left: auto; }
.nav-link:hover { background: #244d4008; color: var(--color-pine); }
.nav-link.active { background: #e3e7dc; color: var(--color-pine); }
.area-heading { margin: 2.5rem .75rem .75rem; font-size: .75rem; color: var(--color-muted); }
.area-list { display: grid; gap: .125rem; }
.area-list a { display: flex; align-items: center; gap: .875rem; padding: .625rem .875rem; color: #626b65; border-radius: .5rem; }
.area-list a:hover { background: #244d4008; color: var(--color-pine); }
.area-dot { width: .375rem; height: .375rem; display: inline-block; border-radius: 100%; flex-shrink: 0; background: #6d8877; }
.area-1 { background: #b18d63; }
.area-2 { background: #9caa72; }
.area-3 { background: #9894b0; }
.area-4 { background: #78969e; }
.area-5 { background: #bd927f; }
.sidebar-bottom { margin-top: auto; padding-top: 2rem; }
.sidebar-note { padding: 1.25rem .75rem 2rem; display: flex; align-items: flex-start; gap: .625rem; color: #687a64; font-size: .8125rem; line-height: 1.6; }
.profile { display: flex; align-items: center; gap: .75rem; border-top: 1px solid #26352f12; margin-top: .75rem; padding: 1.25rem .5rem 0; font-size: .8125rem; }
.profile .muted { font-size: .75rem; padding-top: .2rem; }
.avatar { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; background: #e3e5da; border-radius: 50%; font-size: .625rem; letter-spacing: .06em; color: var(--color-pine); }
.workspace { margin-left: 15.5rem; min-width: 0; }
.topbar { height: 4.625rem; border-bottom: 1px solid #26352f12; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0 2.75rem; }
.topbar-left, .topbar-right { display: flex; align-items: center; gap: 1rem; }
.topbar-left { color: #7a8078; font-size: .8125rem; }
.breadcrumb-slash { padding: 0 .75rem; color: #b1b5ac; }
.demo-label { font-size: .6875rem; border: 1px solid #26352f1a; border-radius: .25rem; padding: .2rem .45rem; color: var(--color-muted); }
.topbar-date { font-size: .75rem; color: var(--color-muted); }
.page-content { max-width: 94rem; margin: 0 auto; padding: 2.75rem 2.75rem 3rem; }
.page-heading { display: flex; align-items: center; justify-content: space-between; gap: 1.25rem; margin-bottom: 2.25rem; }
.eyebrow { color: var(--color-muted); font-size: .75rem; font-weight: 500; }
.page-heading h1 { font-family: var(--font-display); font-size: clamp(2rem, 2.65vw, 2.75rem); letter-spacing: -.065rem; margin-top: .625rem; }
.muted { color: var(--color-muted); line-height: 1.7; }
.heading-description { margin-top: .625rem; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.85fr) minmax(17rem, 1fr); gap: 2.25rem; }
.main-column, .right-column { min-width: 0; display: flex; flex-direction: column; gap: 2.25rem; }
.intention-panel { position: relative; overflow: hidden; border-radius: .75rem; background: #e9eee5; padding: 1.75rem 2rem; min-height: 17rem; display: flex; align-items: center; }
.intention-copy { position: relative; z-index: 1; }
.intention-copy .eyebrow { color: #516a53; }
.intention-panel h2 { font-family: var(--font-display); font-size: 2.625rem; letter-spacing: -.06rem; line-height: 1.12; margin: .75rem 0 1rem; color: #2c4e3c; }
.intention-panel h2 em { font-weight: 400; }
.intention-panel p:not(.eyebrow) { color: #5f705e; font-size: .8125rem; line-height: 1.75; max-width: 34ch; }
.mode-selector { display: inline-flex; gap: .25rem; margin-top: 1.5rem; padding: .25rem; border-radius: .5rem; background: #dce3d6; max-width: 100%; }
.mode-selector button { position: relative; min-height: 1.75rem; padding: .25rem .625rem; border-radius: .35rem; font-size: .6875rem; color: #56664f; white-space: nowrap; }
.mode-selector button:hover { background: #ffffff60; }
.mode-selector button[aria-pressed=true] { background: #fafbf6; color: #294935; box-shadow: 0 1px 3px #243c2410; }
.compass-art { position: absolute; width: 14.5rem; height: 14.5rem; right: -1rem; top: 1.25rem; color: #49694d; opacity: .65; }
.orbit { position: absolute; inset: .75rem; border-radius: 100%; border: 1px solid #66836045; }
.orbit-inner { inset: 2.1rem; border-style: dashed; border-color: #66836035; }
.compass-n,.compass-s,.compass-e,.compass-w { position: absolute; font-family: var(--font-display); font-size: .75rem; }
.compass-n { top: 0; left: 48%; }
.compass-s { bottom: 0; left: 48%; }
.compass-w { left: 0; top: 47%; }
.compass-e { right: 0; top: 47%; }
.compass-needle { position: absolute; inset: 2.9rem 5.9rem; transform: rotate(30deg); clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); background: linear-gradient(90deg,#486b48 50%,#b5c5a7 50%); }
.compass-center { position: absolute; width: .4rem; height: .4rem; top: calc(50% - .2rem); left: calc(50% - .2rem); background: #f3f4eb; border-radius: 50%; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-bottom: 1rem; }
.section-heading h2 { font-weight: 500; font-size: .9375rem; letter-spacing: -.02em; }
.section-title { display: flex; align-items: center; gap: .75rem; }
.section-aside { font-size: .6875rem; color: var(--color-muted); white-space: nowrap; }
.count-badge { border: 1px solid #26352f1a; padding: .125rem .5rem; border-radius: 1rem; font-size: .625rem; color: #68716b; }
.task-list { display: flex; flex-direction: column; border-top: 1px solid #26352f14; }
.task-row { display: flex; align-items: flex-start; gap: .875rem; padding: 1.25rem .25rem; border-bottom: 1px solid #26352f14; }
.task-copy { flex: 1; min-width: 0; }
.task-copy label { display: block; cursor: pointer; font-size: .8125rem; font-weight: 500; line-height: 1.6; }
.task-row:has(input:checked) .task-copy label { text-decoration: line-through; color: var(--color-muted); }
.task-meta { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem; margin-top: .375rem; color: var(--color-muted); font-size: .6875rem; }
.task-meta .area-dot { width: .3rem; height: .3rem; }
.meta-dot { color: #a0a69a; }
.task-tag { flex-shrink: 0; font-size: .625rem; padding: .25rem .5rem; border-radius: .25rem; background: #efeee8; color: #6f7268; white-space: nowrap; }
.tag-important { background: #e8eddf; color: #5a704b; }
.task-check-wrap { padding-top: .15rem; }
.check-control { display: inline-grid; width: 1.125rem; height: 1.125rem; position: relative; flex-shrink: 0; }
.check-control input { appearance: none; grid-area: 1/1; width: 100%; height: 100%; background: transparent; border: 1px solid #26352f4d; border-radius: .25rem; cursor: pointer; }
.check-control input:checked { border-color: var(--color-pine); background: var(--color-pine); }
.check-control input:disabled { cursor: not-allowed; opacity: .5; }
.check-control svg { grid-area: 1/1; align-self: center; justify-self: center; color: white; width: .875rem; height: .875rem; pointer-events: none; }
.check-control:not(:has(input:checked)) svg { opacity: 0; }
.add-inline { position: relative; display: flex; align-items: center; gap: .625rem; min-height: 2rem; margin-top: .75rem; color: #6c776b; font-size: .75rem; }
.add-inline:hover { color: var(--color-pine); }
.agenda-list { display: grid; gap: .875rem; }
.agenda-row { display: flex; align-items: flex-start; gap: 1rem; }
.agenda-time { padding-top: .5rem; width: 2.625rem; flex-shrink: 0; color: #56645a; font-size: .6875rem; }
.agenda-time p + p { margin-top: .25rem; color: #8b9288; }
.agenda-event { display: flex; align-items: flex-start; justify-content: space-between; gap: .75rem; border-left: 2px solid #71886f; border-radius: 0 .375rem .375rem 0; padding: .875rem 1rem; background: #edf0e9; flex: 1; min-width: 0; }
.agenda-event h3 { font-size: .75rem; font-weight: 500; }
.agenda-event p { font-size: .6875rem; color: #73816e; margin-top: .375rem; }
.agenda-event .task-tag { background: #ffffff70; }
.agenda-event.food { background: #f0f0e7; border-color: #a5a37b; }
.agenda-event.gym { background: #f4eee6; border-color: #b69671; }
.agenda-event.gym p { color: #8d7b64; }
.free-time { display: flex; align-items: flex-start; gap: .625rem; color: #7b8477; padding: 1.125rem 0 0 3.625rem; font-size: .6875rem; }
.assistant-panel { padding: 1.5rem; background: #f2f0e9; border-radius: .75rem; border: 1px solid #26352f0a; }
.assistant-heading { display: flex; align-items: center; justify-content: space-between; }
.quiet-badge { display: flex; align-items: center; gap: .375rem; font-size: .625rem; color: #65765d; }
.quiet-badge::before { content: ''; width: .3rem; height: .3rem; border-radius: 50%; background: #8f9f7e; }
.assistant-panel h2 { font-family: var(--font-display); font-size: 1.625rem; letter-spacing: -.035rem; line-height: 1.25; margin: 1.25rem 0 .75rem; }
.assistant-panel .muted { font-size: .8125rem; }
.capture-form { background: #fcfbf8; border: 1px solid #26352f1f; border-radius: .625rem; margin-top: 1.25rem; overflow: hidden; }
.capture-form:focus-within { outline: 2px solid var(--color-pine); outline-offset: -1px; }
.capture-form textarea { padding: .875rem; width: 100%; resize: vertical; min-height: 5rem; max-height: 12rem; font-size: .75rem; background: transparent; outline: none; }
.capture-form textarea::placeholder { color: #93978b; }
.capture-actions { display: flex; align-items: center; justify-content: space-between; padding: 0 .5rem .5rem; }
.capture-actions .btn { height: 1.75rem; min-width: 1.75rem; }
.send-button { position: relative; width: 1.75rem; height: 1.75rem; display: grid; place-items: center; background: #e3e8da; color: #40573b; border-radius: .375rem; }
.send-button:hover { background: #d3ddc6; }
.suggestion-row { margin-top: .875rem; }
.suggestion-row button { position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%; gap: .5rem; font-size: .6875rem; color: #747b6e; padding: .5rem 0; text-align: left; }
.suggestion-row button:hover { color: var(--color-pine); }
.prototype-note { margin-top: .75rem; font-size: .625rem; line-height: 1.6; color: #727a6c; }
.habit-list { border-top: 1px solid #26352f14; }
.habit-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #26352f14; }
.habit-copy { min-width: 0; }
.habit-copy label { display: block; font-size: .75rem; font-weight: 500; cursor: pointer; }
.habit-copy p { font-size: .6875rem; color: #7f867c; margin-top: .35rem; }
.habit-note { color: #7b8477; font-size: .6875rem; line-height: 1.7; margin-top: .875rem; }
.balance-section .muted { font-size: .75rem; }
.balance-section .section-heading { margin-bottom: .5rem; }
.area-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-top: 1rem; }
.area-chip { display: flex; align-items: center; gap: .5rem; padding: .625rem .75rem; border: 1px solid #26352f12; border-radius: .375rem; font-size: .6875rem; color: #62705f; }
.app-footer { max-width: 94rem; margin: 0 auto; padding: 1.25rem 2.75rem 1.75rem; display: flex; justify-content: space-between; gap: 1rem; border-top: 1px solid #26352f0d; font-size: .625rem; color: #838a7e; }
.mobile-only { display: none; }
.skip-link { position: fixed; top: -5rem; left: 1rem; z-index: 100; padding: .75rem; background: white; border-radius: .5rem; }
.skip-link:focus { top: 1rem; }

/* Fully styled modal and listbox, with focus behavior supplied by interactions.ts. */
.modal-layer { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 1.5rem; }
.modal-backdrop { position: absolute; inset: 0; background: #14271f66; backdrop-filter: blur(4px); }
.modal-panel { position: relative; width: min(100%, 30rem); max-height: calc(100dvh - 3rem); overflow-y: auto; background: var(--color-canvas); padding: 1.75rem; border-radius: .875rem; box-shadow: 0 20px 80px #12281c26; outline: none; }
.modal-panel .section-heading h2 { font-family: var(--font-display); font-size: 1.75rem; letter-spacing: -.04rem; }
.modal-panel .section-heading { align-items: flex-start; }
.modal-description { margin-bottom: 1.5rem; }
.task-form { display: grid; gap: 1.25rem; }
.field { display: grid; gap: .5rem; }
.field > label { font-weight: 500; font-size: .8125rem; }
.field input:not([type=hidden]), .select-trigger { width: 100%; border: 1px solid #26352f33; border-radius: .5rem; padding: .75rem; background: white; font-size: .8125rem; }
.select-trigger { display: flex; align-items: center; justify-content: space-between; gap: .75rem; text-align: left; }
.custom-select { position: relative; }
.select-options { position: absolute; top: calc(100% + .375rem); inset-inline: 0; z-index: 2; padding: .375rem; background: white; border-radius: .5rem; box-shadow: 0 6px 24px #172e1e1a; outline: 1px solid #26352f14; max-height: 13rem; overflow: auto; }
.select-options li { display: flex; align-items: center; justify-content: space-between; padding: .625rem; cursor: pointer; border-radius: .25rem; }
.select-options li:hover,.select-options li:focus,.select-options li[aria-selected=true] { background: var(--color-pine-light); outline: none; }
.form-note { font-size: .75rem; }
.form-actions { display: flex; justify-content: flex-end; gap: .75rem; padding-top: .75rem; }
.toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 90; background: var(--color-pine); color: white; padding: .875rem 1.25rem; border-radius: .625rem; box-shadow: 0 8px 25px #17322526; max-width: calc(100% - 2rem); font-size: .8125rem; }

/* Brand and component documentation. */
.guide-content { max-width: 82rem; }
.guide-hero { padding: 3rem 0; border-bottom: 1px solid #26352f1a; }
.guide-hero h1 { font-family: var(--font-display); font-size: clamp(3rem,5vw,5rem); letter-spacing: -.15rem; margin: 1rem 0; }
.guide-hero p { max-width: 60ch; }
.guide-section { padding: 2.5rem 0; border-bottom: 1px solid #26352f1a; }
.guide-section > h2 { font-size: 1.25rem; margin-bottom: 1.5rem; }
.guide-split { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.logo-board { min-height: 12rem; display: grid; place-items: center; border-radius: .75rem; border: 1px solid #26352f1a; }
.logo-board img { width: 14rem; max-width: 80%; }
.logo-board.dark { background: var(--color-pine); border-color: transparent; }
.logo-board.dark img { filter: brightness(0) invert(1); }
.guide-caption { color: var(--color-muted); font-size: .75rem; margin-top: .75rem; }
.palette { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: .75rem; }
.swatch { height: 6rem; border-radius: .5rem; border: 1px solid #26352f14; }
.palette h3 { margin-top: .75rem; font-size: .8125rem; }
.palette p { font-family: monospace; font-size: .75rem; color: var(--color-muted); margin-top: .25rem; }
.type-specimen { padding: 1.5rem 0; }
.type-display { font-family: var(--font-display); font-size: 3rem; letter-spacing: -.08rem; }
.guide-controls { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
.token-list { display: grid; gap: 1rem; }
.token-list dt { font-weight: 500; }
.token-list dd { color: var(--color-muted); line-height: 1.7; margin-top: .375rem; }
.guide-link { color: var(--color-pine); text-decoration: underline; text-underline-offset: .25rem; }
.guide-logo-links { display: flex; flex-wrap: wrap; gap: 1rem; padding-top: 1rem; }

@media (min-width: 1450px) {
  .compass-art { right: 1rem; }
  .dashboard-grid { gap: 3rem; }
  .page-content { padding-top: 3rem; }
}
@media (max-width: 1200px) {
  .sidebar { width: 13.5rem; }
  .workspace { margin-left: 13.5rem; }
  .page-content { padding: 2rem; }
  .topbar { padding-inline: 2rem; }
  .dashboard-grid { gap: 1.5rem; grid-template-columns: minmax(0, 1.55fr) minmax(16rem, 1fr); }
  .intention-panel { padding: 1.5rem; }
  .compass-art { right: -4rem; opacity: .3; }
  .task-tag { display: none; }
  .assistant-panel { padding: 1.25rem; }
  .page-heading h1 { font-size: 2.125rem; }
}
@media (max-width: 1023px) {
  .sidebar { transform: translateX(-100%); width: 16rem; transition: transform .2s ease; }
  .sidebar.is-open { transform: translateX(0); }
  .workspace { margin-left: 0; }
  .mobile-only { display: inline-flex; }
  .sidebar .mobile-only { padding-inline: .5rem; }
  .nav-backdrop { position: fixed; inset: 0; background: #14271f66; z-index: 25; }
  .topbar-left { gap: .5rem; }
  .compass-art { right: -1rem; opacity: .5; }
  .sidebar-caption { margin-top: 1.5rem; }
}
@media (max-width: 767px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .right-column { display: grid; grid-template-columns: 1fr 1fr; align-items: start; }
  .assistant-panel { grid-row: span 2; }
  .balance-section { grid-column: 2; }
  .page-heading { align-items: flex-start; }
  .page-heading .btn { margin-top: 1.5rem; }
  .guide-split { grid-template-columns: 1fr; }
  .palette { grid-template-columns: repeat(3,minmax(0,1fr)); }
  .compass-art { right: 1.5rem; }
  .page-heading h1 { font-size: 2.25rem; }
  .topbar-date { display: none; }
}
@media (max-width: 639px) {
  body { font-size: 1rem; }
  .page-content { padding: 1.75rem 1.25rem 2rem; }
  .topbar { padding-inline: 1rem; height: 4rem; }
  .page-heading { flex-direction: column; gap: 1.25rem; margin-bottom: 1.75rem; }
  .page-heading .btn { margin-top: 0; }
  .page-heading h1 { font-size: 2.375rem; }
  .page-heading h1 br { display: none; }
  .heading-description { font-size: 1rem; line-height: 1.7; }
  .eyebrow { font-size: .875rem; }
  .right-column { display: flex; }
  .dashboard-grid,.main-column,.right-column { gap: 2rem; }
  .intention-panel { min-height: 19rem; padding: 1.5rem; }
  .intention-panel h2 { font-size: 2.5rem; }
  .intention-panel p:not(.eyebrow) { font-size: 1rem; max-width: 26ch; }
  .compass-art { width: 12rem; height: 12rem; right: -5rem; top: 3rem; opacity: .25; }
  .mode-selector { display: flex; }
  .mode-selector button { font-size: .75rem; min-height: 2.375rem; padding-inline: .5rem; }
  .section-heading h2 { font-size: 1.0625rem; }
  .section-aside { font-size: .75rem; }
  .priorities-section .section-aside { display: none; }
  .task-row { gap: .75rem; }
  .task-copy label { font-size: 1rem; }
  .task-meta { font-size: .875rem; gap: .375rem; }
  .task-meta .meta-dot { display: none; }
  .task-meta > span:last-child { flex-basis: 100%; }
  .check-control { width: 1.25rem; height: 1.25rem; }
  .check-control::after { content: ''; position: absolute; inset: -.5rem; pointer-events: none; }
  .check-control input::after { content: ''; position: absolute; inset: -.5rem; }
  .add-inline { font-size: .875rem; min-height: 3rem; }
  .count-badge { font-size: .75rem; }
  .agenda-time { font-size: .875rem; width: 3rem; }
  .agenda-row { gap: .75rem; }
  .agenda-event { padding: .875rem; }
  .agenda-event h3 { font-size: 1rem; line-height: 1.5; }
  .agenda-event p { font-size: .875rem; }
  .free-time { padding-left: 0; font-size: .875rem; }
  .assistant-panel { padding: 1.5rem; }
  .assistant-panel h2 { font-size: 1.875rem; }
  .assistant-panel .muted { font-size: 1rem; }
  .capture-form textarea { font-size: 1rem; }
  .capture-actions { padding: .25rem .75rem .75rem; }
  .quiet-badge,.suggestion-row button,.prototype-note { font-size: .875rem; }
  .suggestion-row button { min-height: 3rem; }
  .habit-copy label { font-size: 1rem; }
  .habit-copy p,.habit-note { font-size: .875rem; }
  .balance-section .muted { font-size: 1rem; }
  .area-chip { font-size: .875rem; }
  .app-footer { padding: 1rem 1.25rem; font-size: .75rem; flex-direction: column; gap: .5rem; }
  .modal-layer { padding: 1rem; }
  .modal-panel { padding: 1.5rem; }
  .field > label,.field input:not([type=hidden]),.select-trigger { font-size: 1rem; }
  .form-note { font-size: .875rem; }
  .toast { font-size: .875rem; }
  .palette { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .palette h3,.palette p,.guide-caption { font-size: .875rem; }
  .guide-hero { padding: 1.5rem 0 2rem; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .sidebar { transition: none; }
}
```

Cómo leerlo: `@import "tailwindcss"` carga Tailwind; `@theme` declara tokens (`--color-pine` → clases `bg-pine`, `text-pine` y `var(--color-pine)`); `@layer base` = reglas base; clases `.btn`, `.sidebar`, `.task-row`… son partes concretas de la app; `@media` ajusta por ancho. Breakpoints: sidebar cambia < 1024 px, grid se apila < 768 px, ajustes extra < 640 px. `[hidden]` mantiene ocultos los elementos con ese atributo. `:focus-visible` dibuja foco de teclado. `prefers-reduced-motion` respeta movimiento reducido. Se mezclan utilidades Tailwind (`size-4`) con clases propias (`task-row`).

## 8. Marca (SVG)

Archivos de `public/` se sirven desde la raíz: `public/brand/norte-symbol.svg` → `/brand/norte-symbol.svg`.

`public/brand/norte-symbol.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><path d="M9 38V10l30 28V10" stroke="#244D40" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m24 5 3 6h-6l3-6Z" fill="#AA7548"/></svg>
```

`public/brand/norte-logo.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 64" fill="none"><path d="M12 49V21l30 28V21" stroke="#244D40" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m27 10 3 6h-6l3-6Z" fill="#AA7548"/><text x="65" y="48" fill="#244D40" font-family="Georgia,serif" font-size="49" letter-spacing="-2">norte</text></svg>
```

## 9. Componentes reutilizables (`src/components/ui/`)

### `Icon.astro`

```astro
---
import collection from '@iconify-json/heroicons/icons.json';
interface Props { name: string; class?: string }
const { name, class: className = '' } = Astro.props;
const icons = collection.icons as Record<string, { body: string; width?: number; height?: number }>;
const icon = icons[`${name}-16-solid`];
if (!icon) throw new Error(`Unknown icon: ${name}`);
---
<svg viewBox={`0 0 ${icon.width ?? 16} ${icon.height ?? 16}`} class:list={['size-4 shrink-0 fill-current', className]} aria-hidden="true" set:html={icon.body} />
```

Usa la variante `-16-solid`. Si el nombre no existe lanza error al generar. `set:html` SOLO para el SVG del paquete, nunca con texto del usuario. Iconos decorativos (`aria-hidden`); el botón debe tener nombre accesible.

### `Button.astro`

```astro
---
import Icon from './Icon.astro';
import type { HTMLAttributes } from 'astro/types';
interface Props extends HTMLAttributes<'button'> { variant?: 'primary' | 'secondary' | 'ghost'; icon?: string }
const { variant = 'secondary', icon, class: className, type = 'button', ...rest } = Astro.props;
const variants = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost' };
---
<button type={type} class:list={['btn', variants[variant], className]} {...rest}>
  {icon && <Icon name={icon} />}<slot />
</button>
```

Uso: `<Button variant="primary" icon="plus">Añadir pendiente</Button>`. `type="button"` por defecto para que Cancelar no envíe formularios; Guardar usa `type="submit"`. `...rest` conserva `aria-label`, `disabled`, `data-open-modal`, etc.

### `Brand.astro`

```astro
---
interface Props { compact?: boolean }
const { compact = false } = Astro.props;
---
<a href="/" aria-label="Norte, inicio" class="brand">
  <img src="/brand/norte-symbol.svg" alt="" width="38" height="38" />
  {!compact && <span>norte</span>}
</a>
```

### `Checkbox.astro`

```astro
---
import Icon from './Icon.astro';
interface Props { id: string; checked?: boolean; label: string; kind?: string }
const { id, checked = false, label, kind = 'task' } = Astro.props;
---
<span class="check-control">
  <input type="checkbox" id={id} name={id} checked={checked} aria-label={label} data-check={kind} />
  <Icon name="check" />
</span>
```

Se mantiene `input type="checkbox"` real (teclado nativo). `id` único en la página. `data-check` clasifica (`task`, `habit`, `example`) para contar.

### `Modal.astro`

```astro
---
import Button from './Button.astro';
interface Props { id: string; title: string; description?: string }
const { id, title, description } = Astro.props;
---
<div id={id} class="modal-layer" hidden>
  <div class="modal-backdrop" data-close-modal></div>
  <section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} tabindex="-1">
    <div class="section-heading"><h2 id={`${id}-title`}>{title}</h2><Button variant="ghost" icon="x-mark" aria-label="Cerrar" data-close-modal /></div>
    {description && <p class="muted modal-description">{description}</p>}
    <slot />
  </section>
</div>
```

Empieza oculto (`hidden`). Foco/Escape/apertura los da TypeScript (sección 14).

## 10. Layout base

### `src/layouts/BaseLayout.astro`

```astro
---
import '@/styles/global.css';

interface Props {
  title?: string;
}
const { title = 'Norte - Tu día, con intención' } = Astro.props;
---
<!doctype html>
<html lang="es" class="antialiased">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content="Un espacio tranquilo para organizar tu día, cuidar tus hábitos y avanzar con intención." />
    <meta name="theme-color" content="#244D40" />
    <link rel="icon" type="image/svg+xml" href="/brand/norte-symbol.svg" />
    <link rel="preconnect" href="https://rsms.me" />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  </head>
  <body class="min-h-dvh bg-canvas text-ink font-sans">
    <a href="#main" class="skip-link">Saltar al contenido</a>
    <slot />
  </body>
</html>
```

Prueba temporal de estilos (reemplaza `src/pages/index.astro` temporalmente):

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Button from '@/components/ui/Button.astro';
---
<BaseLayout title="Prueba de componentes de Norte">
  <main id="main" class="p-8">
    <h1 class="font-display text-4xl">Mi primer componente</h1>
    <p class="my-4">Astro y Tailwind ya trabajan juntos.</p>
    <Button variant="primary" icon="plus">Botón de prueba</Button>
  </main>
</BaseLayout>
```

Debe verse fondo marfil, título y botón verde con icono. Si no hay estilos: revisar import del CSS y plugin.

## 11. Estructura de la aplicación

Primero crear `src/lib/interactions.ts` temporal:

```ts
// Aquí implementaremos las interacciones del navegador en la sección 14.
export {};
```

### `src/layouts/AppLayout.astro`

```astro
---
import BaseLayout from './BaseLayout.astro';
import Brand from '@/components/ui/Brand.astro';
import Icon from '@/components/ui/Icon.astro';
import Button from '@/components/ui/Button.astro';
interface Props { title?: string; guide?: boolean }
const { title, guide = false } = Astro.props;
const nav = [ ['sun', 'Hoy', '/'], ['queue-list', 'Prioridades', '/#priorities'], ['calendar-days', 'Agenda', '/#agenda'], ['arrow-path', 'Mis hábitos', '/#habits'] ];
const areas = ['Trabajo', 'Gimnasio', 'Alimentación', 'Sueño', 'Finanzas', 'Tiempo libre'];
---
<BaseLayout title={title}>
  <div class="app-shell isolate" id="app-root">
    <aside class="sidebar" id="sidebar" aria-label="Navegación principal">
      <div class="sidebar-brand"><Brand /><Button class="mobile-only" variant="ghost" icon="x-mark" aria-label="Cerrar navegación" data-nav-close /></div>
      <p class="sidebar-caption">Tu espacio personal</p>
      <nav><ul role="list" class="nav-list">{nav.map(([icon, label, href], i) => <li><a href={href} class:list={['nav-link', { active: i === 0 && !guide }]} aria-current={i === 0 && !guide ? 'page' : undefined}><Icon name={icon} />{label}</a></li>)}</ul></nav>
      <div class="area-heading">Las áreas de tu vida</div>
      <ul role="list" class="area-list">{areas.map((area, i) => <li><a href={`/#area-${i}`}><span class={`area-dot area-${i}`}></span>{area}</a></li>)}</ul>
      <div class="sidebar-bottom">
        <div class="sidebar-note"><Icon name="sparkles" /><p>Un poco de orden.<br />Más espacio para ti.</p></div>
        <a href="/design" class:list={['nav-link', { active: guide }]} aria-current={guide ? 'page' : undefined}><Icon name="swatch" />Guía de diseño<Icon name="arrow-up-right" /></a>
        <div class="profile"><div class="avatar">TÚ</div><div><p>Tu espacio</p><p class="muted">Prototipo personal</p></div></div>
      </div>
    </aside>
    <button class="nav-backdrop" type="button" aria-label="Cerrar navegación" data-nav-close hidden></button>
    <div class="workspace">
      <header class="topbar">
        <div class="topbar-left"><Button class="mobile-only" variant="ghost" icon="bars-3" aria-label="Abrir navegación" aria-expanded="false" aria-controls="sidebar" data-nav-toggle /><p>Mi espacio <span class="breadcrumb-slash">/</span> <span class="text-ink">{guide ? 'Guía de diseño' : 'Hoy'}</span></p></div>
        <div class="topbar-right"><span class="demo-label">Vista de ejemplo</span><div class="topbar-date tabular-nums" data-short-date>25 oct, 2026</div></div>
      </header>
      <main id="main" class:list={['page-content', { 'guide-content': guide }]}><slot /></main>
      <footer class="app-footer"><p>Norte · Tu día, con intención.</p><p>Un paso a la vez también es avanzar.</p></footer>
    </div>
  </div>
  <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
  <slot name="dialogs" />
  <script src="@/lib/interactions.ts"></script>
</BaseLayout>
```

Notas: dos slots (`<slot />` y `<slot name="dialogs" />`). Los modales quedan **fuera** de `#app-root` porque al abrir uno el script pone `inert` al resto de la app sin desactivar el modal. `<script src="@/lib/interactions.ts">`: NO añadir `is:inline` (Astro debe resolver alias y procesar TS). `guide` cambia cabecera y enlace activo; `aria-current="page"` marca ruta activa.

## 12. Pantalla Hoy

### `src/pages/index.astro` (reemplaza todo)

```astro
---
import AppLayout from '@/layouts/AppLayout.astro';
import Icon from '@/components/ui/Icon.astro';
import Button from '@/components/ui/Button.astro';
import Checkbox from '@/components/ui/Checkbox.astro';
import Modal from '@/components/ui/Modal.astro';
const tasks = [
  { id: 'proposal', title: 'Dar forma a la propuesta del proyecto', area: 'Trabajo', meta: '45 min de concentración', tag: 'Lo importante', primary: true },
  { id: 'training', title: 'Preparar la rutina de la semana', area: 'Gimnasio', meta: '20 min · a tu ritmo', tag: 'Personal', primary: false },
  { id: 'budget', title: 'Revisar los gastos de esta semana', area: 'Finanzas', meta: '15 min · sin pendientes', tag: 'Personal', primary: false },
];
const agenda = [
  { time: '09:00', end: '09:45', title: 'Un espacio para concentrarte', note: 'Propuesta del proyecto', area: 'Trabajo', class: 'work' },
  { time: '11:00', end: '11:20', title: 'Poner la semana en orden', note: 'Compras y comidas de la semana', area: 'Alimentación', class: 'food' },
  { time: '17:00', end: '17:45', title: 'Mover el cuerpo, despejar la mente', note: 'Sesión de gimnasio', area: 'Gimnasio', class: 'gym' },
];
const habits = [ ['water', 'Un vaso de agua al empezar', 'Alimentación', 'Al despertar'], ['walk', 'Salir a caminar', 'Tiempo libre', '15 minutos para ti'], ['sleep', 'Desconectar antes de dormir', 'Sueño', 'Una noche más tranquila'] ];
---
<AppLayout>
  <section class="page-heading">
    <div><p class="eyebrow" data-full-date>Domingo, 25 de octubre</p><h1>Haz espacio para<br class="mobile-only" /> un buen día.</h1><p class="muted heading-description">No hace falta hacerlo todo. Empieza por lo que importa.</p></div>
    <Button variant="primary" icon="plus" data-open-modal="new-task">Añadir pendiente</Button>
  </section>
  <div class="dashboard-grid">
    <div class="main-column">
      <section class="intention-panel" aria-labelledby="intention-title">
        <div class="intention-copy"><p class="eyebrow">Tu intención de hoy</p><h2 id="intention-title">Menos prisa.<br /><em>Más dirección.</em></h2><p id="mode-description">Tres prioridades y espacio para respirar.<br />Un plan que se adapta a la vida real.</p>
          <div class="mode-selector" role="group" aria-label="Ritmo del día"><button type="button" data-mode="normal" aria-pressed="true">Día normal</button><button type="button" data-mode="busy" aria-pressed="false">Día ocupado</button><button type="button" data-mode="minimum" aria-pressed="false">Lo esencial</button></div>
        </div>
        <div class="compass-art" aria-hidden="true"><div class="orbit orbit-outer"></div><div class="orbit orbit-inner"></div><span class="compass-n">N</span><div class="compass-needle"></div><span class="compass-center"></span><span class="compass-s">S</span><span class="compass-w">O</span><span class="compass-e">E</span></div>
      </section>
      <section id="priorities" class="priorities-section" aria-labelledby="priorities-title">
        <div class="section-heading"><div class="section-title"><h2 id="priorities-title">Lo que importa hoy</h2><span class="count-badge tabular-nums" id="task-count">0 de 3</span></div><p class="section-aside">Un paso a la vez</p></div>
        <ul role="list" class="task-list" id="task-list">{tasks.map((task, index) => <li class:list={['task-row', { 'task-featured': task.primary }]} data-task-row>
          <div class="task-check-wrap"><Checkbox id={task.id} label={`Completar: ${task.title}`} /></div>
          <div class="task-copy"><label for={task.id}>{task.title}</label><div class="task-meta"><span class={`area-dot area-${index === 0 ? 0 : index === 1 ? 1 : 4}`}></span><span>{task.area}</span><span class="meta-dot">·</span><span>{task.meta}</span></div></div>
          <span class:list={['task-tag', { 'tag-important': task.primary }]}>{task.tag}</span>
        </li>)}</ul>
        <button type="button" class="add-inline" data-open-modal="new-task"><Icon name="plus" />Capturar algo que tienes en mente</button>
      </section>
      <section id="agenda" class="agenda-section" aria-labelledby="agenda-title">
        <div class="section-heading"><h2 id="agenda-title">Un día con espacio</h2><span class="section-aside">Agenda de ejemplo</span></div>
        <ol role="list" class="agenda-list">{agenda.map(item => <li class="agenda-row"><div class="agenda-time tabular-nums"><p>{item.time}</p><p>{item.end}</p></div><div class={`agenda-event ${item.class}`}><div><h3>{item.title}</h3><p>{item.note}</p></div><span class="task-tag">{item.area}</span></div></li>)}</ol>
        <div class="free-time"><Icon name="sun" /><p>El resto también cuenta. Deja sitio para lo inesperado.</p></div>
      </section>
    </div>
    <div class="right-column">
      <section id="assistant" class="assistant-panel" aria-labelledby="assistant-title">
        <div class="assistant-heading"><img src="/brand/norte-symbol.svg" alt="" width="32" height="32" /><span class="quiet-badge">A tu ritmo</span></div>
        <h2 id="assistant-title">Un poco de claridad,<br />cuando la necesites.</h2><p class="muted">Saca los pendientes de tu cabeza. Empieza por uno y dale un lugar.</p>
        <form id="capture-form" class="capture-form"><label class="sr-only" for="capture-input">¿Qué tienes en mente?</label><textarea id="capture-input" name="thought" rows="3" maxlength="180" placeholder="¿Qué tienes en mente?" required></textarea><div class="capture-actions"><Button variant="ghost" icon="microphone" aria-label="Información sobre la función de voz" data-open-modal="voice-info" /><button type="submit" class="send-button" aria-label="Guardar como pendiente"><Icon name="arrow-up" /></button></div></form>
        <div class="suggestion-row"><button type="button" data-quick="minimum">Hoy necesito ir más despacio<Icon name="arrow-up-right" /></button></div>
        <p class="prototype-note">Captura local · IA y voz aún sin conectar.</p>
      </section>
      <section id="habits" class="habits-section" aria-labelledby="habits-title">
        <div class="section-heading"><h2 id="habits-title">Pequeños rituales</h2><span id="habit-count" class="section-aside tabular-nums">0 / 3</span></div>
        <ul role="list" class="habit-list">{habits.map(([id, title, area, subtitle]) => <li class="habit-row"><div class="habit-copy"><label for={id}>{title}</label><p>{subtitle}</p><span class="sr-only">{area}</span></div><Checkbox id={id} label={`Completar hábito: ${title}`} kind="habit" /></li>)}</ul>
        <p class="habit-note">La constancia también incluye volver a empezar.</p>
      </section>
      <section class="balance-section" aria-labelledby="balance-title"><div class="section-heading"><h2 id="balance-title">Tu vida, en equilibrio</h2></div><p class="muted">Todas tus áreas tienen un lugar.</p><div class="area-grid">{['Trabajo', 'Gimnasio', 'Alimentación', 'Sueño', 'Finanzas', 'Tiempo libre'].map((area, i) => <div id={`area-${i}`} class="area-chip"><span class={`area-dot area-${i}`}></span>{area}</div>)}</div><p class="prototype-note">El seguimiento semanal llegará más adelante.</p></section>
    </div>
  </div>
  <Fragment slot="dialogs">
    <Modal id="new-task" title="Un pendiente menos en tu cabeza" description="Dale un nombre claro. El siguiente paso puede ser pequeño.">
      <form id="task-form" class="task-form"><div class="field"><label for="task-title">¿Qué quieres hacer?</label><input id="task-title" name="title" type="text" maxlength="180" required placeholder="Por ejemplo, preparar la lista de compras" /></div>
        <div class="field"><label id="area-label">Área de tu vida</label><div class="custom-select" data-select><button type="button" class="select-trigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="area-label area-value"><span id="area-value">Trabajo</span><Icon name="chevron-up-down" /></button><input type="hidden" name="area" value="Trabajo" /><ul role="listbox" aria-labelledby="area-label" class="select-options" hidden>{['Trabajo', 'Gimnasio', 'Alimentación', 'Sueño', 'Finanzas', 'Tiempo libre'].map((area, i) => <li role="option" tabindex="-1" aria-selected={i === 0 ? 'true' : 'false'} data-value={area}>{area}<span aria-hidden="true" class={`area-dot area-${i}`}></span></li>)}</ul></div></div>
        <p class="muted form-note">Se guardará en este navegador. Puedes marcarlo cuando lo completes.</p><div class="form-actions"><Button data-close-modal>Cancelar</Button><Button type="submit" variant="primary" icon="plus">Guardar pendiente</Button></div>
      </form>
    </Modal>
    <Modal id="voice-info" title="Tu voz tendrá su espacio" description="La conversación por voz se conectará a Cloudflare y Claude en la siguiente etapa. Este prototipo no graba ni envía audio."><p class="muted">Por ahora puedes escribir tus pendientes y guardarlos desde aquí.</p><div class="form-actions"><Button variant="primary" data-close-modal>Entendido</Button></div></Modal>
  </Fragment>
</AppLayout>
```

Datos iniciales: `tasks` (prioridades), `agenda` (bloques), `habits` (hábitos), todos hardcodeados. Campos de tarea: `id` (estable; el estado de completado se guarda asociado a él, no cambiarlo arbitrariamente), `title`, `area`, `meta`, `tag`, `primary`.

Secciones: `data-task-row` marca la fila que el script clona como modelo; la agenda usa `<ol>`; hábitos usan `Checkbox` con `kind="habit"`; `#capture-form` con `maxlength="180"`, captura rápida siempre asigna **Trabajo** (sin interpretar lenguaje natural). `<Fragment slot="dialogs">` manda los modales al slot con nombre. Selector de área = botón + `ul role="listbox"` + `li role="option"` + `input type="hidden"` (guarda el valor que lee el script). Los `data-*` conectan HTML con JS: `data-open-modal="new-task"` apunta al modal con `id="new-task"`.

## 13. Página de diseño

### `src/pages/design.astro`

```astro
---
import AppLayout from '@/layouts/AppLayout.astro';
import Button from '@/components/ui/Button.astro';
import Checkbox from '@/components/ui/Checkbox.astro';
import Modal from '@/components/ui/Modal.astro';
const colors = [
  { name:'Pino', hex:'#244D40', role:'Marca y acción principal', color:'bg-pine' },
  { name:'Marfil', hex:'#FAF9F6', role:'Lienzo de la aplicación', color:'bg-canvas' },
  { name:'Tinta', hex:'#26352F', role:'Texto principal', color:'bg-ink' },
  { name:'Salvia', hex:'#E9EEE7', role:'Superficies de apoyo', color:'bg-pine-light' },
  { name:'Bronce', hex:'#AA7548', role:'Detalle del símbolo', color:'bg-bronze' },
];
---
<AppLayout title="Norte - Guía de diseño" guide>
  <section class="guide-hero"><p class="eyebrow">Identidad y sistema visual · v0.1</p><h1>Claridad que<br /><em>se siente.</em></h1><p class="muted">Norte es un espacio personal para avanzar con intención. Su diseño transmite calma, dirección y confianza, con el equilibrio de una libreta bien pensada.</p><p class="guide-caption">Nombre y dirección visual provisionales para este prototipo.</p></section>
  <section class="guide-section" aria-labelledby="identity-title"><h2 id="identity-title">01 · Una dirección propia</h2><div class="guide-split"><div><div class="logo-board"><img src="/brand/norte-logo.svg" alt="Logo de Norte, monograma N y nombre en tipografía serif" width="230" height="64" /></div><p class="guide-caption">Versión principal · Pino sobre marfil.</p></div><div><div class="logo-board dark"><img src="/brand/norte-logo.svg" alt="Versión monocromática clara del logo de Norte" width="230" height="64" /></div><p class="guide-caption">Versión invertida · Blanco sobre pino.</p></div></div><p class="muted mt-6">El monograma une dos trazos verticales con una diagonal: una N que también sugiere un recorrido. La pequeña marca superior señala el norte. Se utiliza sin sombras, deformaciones ni efectos.</p><div class="guide-logo-links"><a href="/brand/norte-logo.svg" download class="guide-link">Descargar logo SVG</a><a href="/brand/norte-symbol.svg" download class="guide-link">Descargar símbolo SVG</a></div></section>
  <section class="guide-section" aria-labelledby="palette-title"><h2 id="palette-title">02 · Una paleta que deja respirar</h2><div class="palette">{colors.map(color => <div><div class:list={['swatch', color.color]}></div><h3>{color.name}</h3><p>{color.hex}</p><p class="guide-caption">{color.role}</p></div>)}</div><p class="muted mt-6">El marfil domina. La tinta sostiene la lectura. El verde pino guía las acciones; la salvia agrupa contenido. El bronce se reserva para pequeños detalles de identidad.</p></section>
  <section class="guide-section" aria-labelledby="type-title"><h2 id="type-title">03 · Editorial por fuera. Preciso por dentro.</h2><div class="guide-split"><div class="type-specimen"><p class="eyebrow">Georgia · Títulos expresivos</p><p class="type-display">Menos prisa.<br /><em>Más dirección.</em></p><p class="guide-caption">Serif de sistema. Peso regular, con cursiva para énfasis.</p></div><div class="type-specimen"><p class="eyebrow">Inter Variable · Interfaz</p><p class="text-2xl tracking-tight mt-4">Un paso pequeño.<br />Un día más claro.</p><p class="muted mt-4">Etiquetas legibles, instrucciones breves y números estables. La interfaz acompaña sin competir con tu atención.</p><p class="guide-caption tabular-nums">Aa Bb Cc · 0123456789</p></div></div></section>
  <section class="guide-section" aria-labelledby="components-title"><h2 id="components-title">04 · Componentes con la misma intención</h2><div class="guide-controls"><Button variant="primary" icon="plus" data-open-modal="guide-dialog">Acción principal</Button><Button data-open-modal="guide-dialog">Acción secundaria</Button><Button variant="ghost" data-open-modal="guide-dialog">Acción discreta</Button></div><div class="guide-controls mt-6"><Checkbox id="guide-check" label="Ejemplo de casilla personalizada" kind="example" /><label for="guide-check">Una tarea, un pequeño avance</label><span class="task-tag tag-important">Lo importante</span></div><p class="muted mt-6">Los componentes parten del catálogo application-ui-v4. Cada control tiene presentación propia, foco visible y estados de interacción. Los elementos semánticos conservan el comportamiento accesible del navegador.</p></section>
  <section class="guide-section" aria-labelledby="rules-title"><h2 id="rules-title">05 · Reglas para mantener el rumbo</h2><div class="guide-split"><dl class="token-list"><div><dt>Espacio antes que decoración</dt><dd>Escala de 4 px. Separación entre secciones de 32 a 48 px. Líneas suaves para dividir contenido relacionado.</dd></div><div><dt>Geometría contenida</dt><dd>Controles de 8 px de radio y paneles de 12 px. Las sombras se reservan para elementos flotantes.</dd></div><div><dt>Una acción protagonista</dt><dd>Un botón principal por vista. El resto acompaña con estilos secundarios o discretos.</dd></div></dl><dl class="token-list"><div><dt>Un tono humano y concreto</dt><dd>“Elige una prioridad” en lugar de exigir productividad perfecta. Sin culpa, urgencia artificial ni promesas infalibles.</dd></div><div><dt>Accesibilidad como base</dt><dd>Teclado, etiquetas, foco visible y adaptación móvil. Los estados no dependen solo del color.</dd></div><div><dt>Movimiento con propósito</dt><dd>Transiciones breves para navegación y respeto a la preferencia de movimiento reducido. Sin animación ornamental.</dd></div></dl></div></section>
  <section class="guide-section"><h2>06 · Alcance del prototipo</h2><p class="muted">Los pendientes, los hábitos y el ritmo se guardan en este navegador. La agenda contiene datos de ejemplo. La conversación con Claude, la voz, la autenticación y la sincronización se implementarán en una etapa posterior.</p><a href="/" class="guide-link inline-flex mt-5">Volver a mi día</a></section>
  <Fragment slot="dialogs"><Modal id="guide-dialog" title="Cada detalle tiene su lugar" description="Este modal utiliza la misma superficie, tipografía y sistema de botones que el resto de Norte."><p class="muted">Puedes cerrarlo con Escape, con el botón de cierre o pulsando fuera. Al cerrar, el foco vuelve al botón que lo abrió.</p><div class="form-actions"><Button variant="primary" data-close-modal>Entendido</Button></div></Modal></Fragment>
</AppLayout>
```

Astro mapea `src/pages/*` a rutas: `index.astro` → `/`, `design.astro` → `/design`. Sin router extra. La versión clara del logo sale de un filtro CSS sobre el mismo SVG.

## 14. Interacciones con TypeScript

### `src/lib/interactions.ts` (reemplaza el temporal)

```ts
// Local prototype behavior; no audio or AI requests are made.
type SavedTask = { id: string; title: string; area: string };
const areas = ['Trabajo', 'Gimnasio', 'Alimentación', 'Sueño', 'Finanzas', 'Tiempo libre'];
const now = new Date();
const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
const storageKey = `norte:day:${day}`;
const customKey = 'norte:tasks:v1';
let storageAvailable = true;

function read<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { storageAvailable = false; notify('No se pudo guardar en este navegador. Los cambios durarán hasta cerrar esta página.'); }
}

const rawDaily = read<unknown>(storageKey, {});
const daily: { checked: Record<string, boolean>; mode: string } = { checked: {}, mode: 'normal' };
if (rawDaily && typeof rawDaily === 'object') {
  const data = rawDaily as Record<string, unknown>;
  if (data.checked && typeof data.checked === 'object') {
    for (const [id, value] of Object.entries(data.checked)) if (typeof value === 'boolean') daily.checked[id] = value;
  }
  if (['normal','busy','minimum'].includes(String(data.mode))) daily.mode = String(data.mode);
}
const rawTasks = read<unknown>(customKey, []);
const tasks: SavedTask[] = Array.isArray(rawTasks) ? rawTasks.filter((t): t is SavedTask => t && typeof t.id === 'string' && /^task-[a-z0-9-]+$/.test(t.id) && typeof t.title === 'string' && t.title.trim().length > 0 && t.title.length <= 180 && areas.includes(t.area)).slice(0,50) : [];

let toastTimer: ReturnType<typeof setTimeout>;
function notify(message: string) {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  toast.textContent = message; toast.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 5000);
}
function updateCounts() {
  for (const [kind, id] of [['task', 'task-count'], ['habit', 'habit-count']]) {
    const checks = [...document.querySelectorAll<HTMLInputElement>(`input[data-check="${kind}"]`)];
    const el = document.getElementById(id);
    if (el) el.textContent = `${checks.filter(c => c.checked).length} ${kind === 'task' ? 'de' : '/'} ${checks.length}`;
  }
}
function appendTask(task: SavedTask) {
  const list = document.getElementById('task-list');
  const template = list?.querySelector<HTMLElement>('[data-task-row]');
  if (!list || !template) return;
  const row = template.cloneNode(true) as HTMLElement;
  row.classList.remove('task-featured');
  const check = row.querySelector<HTMLInputElement>('input')!;
  check.id = task.id; check.name = task.id; check.checked = daily.checked[task.id] ?? false;
  check.setAttribute('aria-label', `Completar: ${task.title}`);
  const label = row.querySelector('label')!;
  label.htmlFor = task.id; label.textContent = task.title;
  const meta = row.querySelector('.task-meta')!;
  meta.replaceChildren();
  const dot = document.createElement('span'); dot.className = `area-dot area-${areas.indexOf(task.area)}`;
  const area = document.createElement('span'); area.textContent = task.area;
  const detail = document.createElement('span'); detail.textContent = 'Pendiente capturado';
  meta.append(dot, area, detail);
  const tag = row.querySelector('.task-tag')!; tag.className = 'task-tag'; tag.textContent = 'Personal';
  list.append(row);
}
tasks.forEach(appendTask);
document.querySelectorAll<HTMLInputElement>('[data-check]').forEach(check => { check.checked = daily.checked[check.id] ?? false; });
updateCounts();

document.addEventListener('change', event => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.matches('[data-check]')) return;
  daily.checked[target.id] = target.checked; write(storageKey, daily); updateCounts();
});

function setMode(mode: string, announce = false) {
  const descriptions: Record<string, string> = {
    normal: 'Tres prioridades y espacio para respirar. Un plan que se adapta a la vida real.',
    busy: 'Elige dos prioridades. Deja margen para los imprevistos y reserva tiempo para descansar.',
    minimum: 'Elige una sola prioridad y su versión más pequeña. Lo demás puede esperar.',
  };
  if (!descriptions[mode]) return;
  daily.mode = mode;
  document.querySelectorAll<HTMLElement>('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  const description = document.getElementById('mode-description');
  if (description) description.textContent = descriptions[mode];
  if (announce) { write(storageKey, daily); if (storageAvailable) notify('Ritmo actualizado. Tus pendientes siguen guardados; la agenda de ejemplo no cambia.'); }
}
setMode(daily.mode);
document.querySelectorAll<HTMLElement>('[data-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode!, true)));
document.querySelector('[data-quick]')?.addEventListener('click', () => { setMode('minimum',true); document.getElementById('intention-title')?.scrollIntoView({ block: 'center' }); });

// Modal focus management and a styled backdrop, without native alert/confirm UI.
let activeModal: HTMLElement | null = null;
let previousFocus: HTMLElement | null = null;
const app = document.getElementById('app-root');
const focusables = (root: HTMLElement) => [...root.querySelectorAll<HTMLElement>('button, a[href], input:not([type=hidden]), textarea, [tabindex="0"]')].filter(el => !el.closest('[hidden]') && !(el as HTMLButtonElement).disabled && el.getClientRects().length > 0);
function closeModal() {
  if (!activeModal) return;
  activeModal.querySelectorAll<HTMLElement>('[data-select]').forEach(closeSelect);
  activeModal.hidden = true; activeModal = null;
  if (app) app.inert = false;
  document.body.style.overflow = '';
  previousFocus?.focus();
}
function openModal(id: string) {
  const modal = document.getElementById(id); if (!modal) return;
  previousFocus = document.activeElement as HTMLElement;
  activeModal = modal; modal.hidden = false;
  if (app) app.inert = true;
  document.body.style.overflow = 'hidden';
  (modal.querySelector<HTMLElement>('input:not([type=hidden]), textarea') ?? focusables(modal)[0] ?? modal.querySelector<HTMLElement>('[role=dialog]'))?.focus();
}
document.querySelectorAll<HTMLElement>('[data-open-modal]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.openModal!)));
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activeModal) { event.preventDefault(); closeModal(); }
  if (event.key === 'Tab' && activeModal) {
    const elements = focusables(activeModal); const first = elements[0], last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
});

function closeSelect(root: HTMLElement) {
  root.querySelector<HTMLElement>('[role=listbox]')!.hidden = true;
  root.querySelector('button')!.setAttribute('aria-expanded','false');
}
document.querySelectorAll<HTMLElement>('[data-select]').forEach(root => {
  const trigger = root.querySelector<HTMLButtonElement>('button')!;
  const list = root.querySelector<HTMLElement>('[role=listbox]')!;
  const options = [...root.querySelectorAll<HTMLElement>('[role=option]')];
  const open = () => { list.hidden = false; trigger.setAttribute('aria-expanded','true'); (options.find(o => o.getAttribute('aria-selected') === 'true') ?? options[0]).focus(); };
  const choose = (option: HTMLElement) => {
    const value = option.dataset.value!;
    root.querySelector<HTMLInputElement>('input')!.value = value;
    root.querySelector('#area-value')!.textContent = value;
    options.forEach(o => o.setAttribute('aria-selected', String(o === option)));
    closeSelect(root); trigger.focus();
  };
  trigger.addEventListener('click', () => list.hidden ? open() : closeSelect(root));
  trigger.addEventListener('keydown', event => { if (['ArrowDown','ArrowUp'].includes(event.key)) { event.preventDefault(); open(); } });
  options.forEach(option => option.addEventListener('click', () => choose(option)));
  root.addEventListener('keydown', event => {
    if (list.hidden) return;
    const index = options.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeSelect(root); trigger.focus(); }
    if (event.key === 'Tab') closeSelect(root);
    if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length-1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[next].focus();
    }
    if (['Enter',' '].includes(event.key) && index >= 0) { event.preventDefault(); choose(options[index]); }
    if (event.key.length === 1 && /\p{L}/u.test(event.key)) { options.find(o => o.dataset.value!.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()))?.focus(); }
  });
  document.addEventListener('click', event => { if (!root.contains(event.target as Node)) closeSelect(root); });
});

function addTask(title: string, area: string) {
  if (tasks.length >= 50) { notify('Has llegado a 50 pendientes en este prototipo.'); return false; }
  const task = { id: `task-${crypto.randomUUID()}`, title: title.trim(), area };
  tasks.push(task); appendTask(task); write(customKey, tasks); updateCounts();
  if (storageAvailable) notify('Pendiente guardado. Ya tiene su lugar.');
  return true;
}
const taskForm = document.querySelector<HTMLFormElement>('#task-form');
taskForm?.setAttribute('novalidate','');
taskForm?.addEventListener('submit', event => {
  event.preventDefault();
  const input = taskForm.querySelector<HTMLInputElement>('[name=title]')!;
  const title = input.value.trim();
  if (!title) { input.setAttribute('aria-invalid','true'); notify('Escribe un nombre para tu pendiente.'); input.focus(); return; }
  input.removeAttribute('aria-invalid');
  if (addTask(title, taskForm.querySelector<HTMLInputElement>('[name=area]')!.value)) { input.value = ''; closeModal(); }
});
const captureForm = document.querySelector<HTMLFormElement>('#capture-form');
captureForm?.setAttribute('novalidate','');
captureForm?.addEventListener('submit', event => {
  event.preventDefault(); const input = captureForm.querySelector<HTMLTextAreaElement>('textarea')!;
  if (!input.value.trim()) { input.setAttribute('aria-invalid','true'); notify('Escribe lo que tienes en mente.'); input.focus(); return; }
  input.removeAttribute('aria-invalid');
  if (addTask(input.value, 'Trabajo')) { input.value = ''; input.focus(); }
});

// Mobile navigation remains a disclosure rather than a modal; hidden controls
// are removed from keyboard order using inert and trapped while it is open.
const sidebar = document.getElementById('sidebar');
const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const backdrop = document.querySelector<HTMLElement>('.nav-backdrop');
const workspace = document.querySelector<HTMLElement>('.workspace');
const mobile = matchMedia('(max-width: 1023px)');
let navOpen = false;
function setNav(open: boolean, restore = true) {
  navOpen = open; sidebar?.classList.toggle('is-open', open);
  if (sidebar) sidebar.inert = mobile.matches && !open;
  if (workspace) workspace.inert = open;
  navToggle?.setAttribute('aria-expanded', String(open));
  if (backdrop) backdrop.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open && sidebar) focusables(sidebar)[0]?.focus(); else if (restore) navToggle?.focus();
}
if (sidebar) sidebar.inert = mobile.matches;
navToggle?.addEventListener('click', () => setNav(!navOpen));
document.querySelectorAll('[data-nav-close]').forEach(button => button.addEventListener('click', () => setNav(false)));
sidebar?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { if (mobile.matches) setNav(false); }));
mobile.addEventListener('change', () => setNav(false, false));
document.addEventListener('keydown', event => {
  if (!navOpen || !sidebar) return;
  if (event.key === 'Escape') { event.preventDefault(); setNav(false); }
  if (event.key === 'Tab') {
    const items = focusables(sidebar); const first=items[0],last=items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
});

const fullDate = document.querySelector<HTMLElement>('[data-full-date]');
const shortDate = document.querySelector<HTMLElement>('[data-short-date]');
if (fullDate) { const date = new Intl.DateTimeFormat('es-PE', { timeZone:'America/Lima', weekday:'long',day:'numeric',month:'long' }).format(now); fullDate.textContent = date.charAt(0).toUpperCase()+date.slice(1); }
if (shortDate) shortDate.textContent = new Intl.DateTimeFormat('es-PE', { timeZone:'America/Lima',day:'numeric',month:'short',year:'numeric' }).format(now);
```

### Explicación por bloques

- **Organización del archivo**: estado/almacenamiento → tareas → ritmo → modales → selector de área → formularios → navegación móvil → fechas.
- **Tipos**: `SavedTask` describe la forma pero **no valida** datos de `localStorage`; por eso hay validación real al leer. `!` tras una búsqueda afirma existencia, no la garantiza; `?.` accede solo si existe.
- **Día/zona horaria**: `now` al cargar; `Intl.DateTimeFormat` con `America/Lima` genera la clave diaria y las fechas. Si la pestaña cruza medianoche, recargar (no hay reinicio automático).
- **localStorage**: claves:

| Clave | Contenido | Cambia cuando |
|---|---|---|
| `norte:tasks:v1` | Títulos, ids y áreas de pendientes añadidos | Se crea un pendiente |
| `norte:day:FECHA` | Casillas y ritmo de un día (Lima) | Se marca una casilla o cambia el ritmo |

Las tareas añadidas persisten entre días; sus marcas de completado son por día. `read<T>` devuelve respaldo si falla; `write` avisa y sigue en memoria si el navegador bloquea. Al recuperar: tipos válidos, id `^task-[a-z0-9-]+$`, título ≤ 180, área en lista, máximo 50. El almacenamiento es por **origen** (protocolo+host+puerto): `localhost:4321` ≠ `localhost:4322`; sin sincronización.
- **notify**: escribe en `#toast`, lo oculta a los 5 s; `role="status"` + `aria-live="polite"`.
- **updateCounts**: cuenta `input[data-check="task"|"habit"]` marcados; incluye tareas añadidas.
- **appendTask**: clona una fila `[data-task-row]` (`cloneNode(true)`), cambia id/name/checked/aria-label/label/meta/tag y la añade. Usa `textContent` (nunca `innerHTML` con texto del usuario → evita inyección HTML). **Requiere al menos una fila inicial con `data-task-row`**; mejora futura: plantilla independiente.
- **Delegación de eventos**: un `change` en `document` filtra `[data-check]`, actualiza `daily.checked`, guarda y recuenta; las filas nuevas funcionan sin listeners propios.
- **setMode**: `normal | busy | minimum`; cambia texto y `aria-pressed`; si viene del usuario guarda y avisa. «Hoy necesito ir más despacio» selecciona `minimum` y hace scroll; **no** modifica tareas ni agenda.
- **Modales**: `openModal` recuerda foco previo, quita `hidden`, `inert` en `#app-root`, bloquea scroll, enfoca primer campo. `closeModal` cierra selector abierto, oculta, restaura todo y devuelve foco. Escape cierra; Tab/Shift+Tab ciclan dentro.
- **Selector personalizado**: atajos —

| Acción | Resultado |
|---|---|
| Clic en botón | Abre/cierra |
| ↑/↓ desde botón | Abre lista |
| ↑/↓ en lista | Recorre opciones |
| Home / End | Primera / última |
| Una letra | Primera opción que empiece por ella |
| Enter / espacio | Selecciona |
| Escape | Cierra lista y vuelve al botón |
| Tab | Cierra y continúa |
| Clic fuera | Cierra |

Está atado a `#area-value`; para varios selectores hay que generalizar con ids únicos.
- **Formularios**: `preventDefault`, `trim()`, `aria-invalid`, aviso y foco si vacío. `novalidate` obliga a validar en el script (se conservan `required` y `maxlength`). `addTask`: límite 50 personalizados (las 3 iniciales no cuentan), id `task-${crypto.randomUUID()}`, guarda. `crypto.randomUUID()` requiere contexto seguro (localhost o HTTPS). Modal usa el área elegida; captura rápida siempre `Trabajo`. Mejora: reforzar el límite de 180 dentro de `addTask`.
- **Navegación móvil**: `matchMedia('(max-width: 1023px)')` debe coincidir con el breakpoint CSS. Cierra con Escape, fondo, botón o al elegir enlace; se resetea al cambiar tamaño.

### Flujo completo (6 pasos)

1. Clic en botón con `data-open-modal="new-task"`.
2. `openModal` muestra y enfoca.
3. Envío de `#task-form`.
4. Listener valida y llama `addTask`.
5. `appendTask` añade fila y `write` guarda el arreglo.
6. Al recargar, `read` + `tasks.forEach(appendTask)` la reconstruyen.

## 15. Estructura final

```text
norte-senati/
  .gitignore
  astro.config.mjs
  package.json
  pnpm-lock.yaml
  tsconfig.json
  public/
    brand/
      norte-logo.svg
      norte-symbol.svg
  src/
    components/
      ui/
        Brand.astro
        Button.astro
        Checkbox.astro
        Icon.astro
        Modal.astro
    layouts/
      AppLayout.astro
      BaseLayout.astro
    lib/
      interactions.ts
    pages/
      design.astro
      index.astro
    styles/
      global.css
```

`node_modules`, `.astro`, `dist` son generados. No hace falta React, Vue, integración de servidor ni Tailwind Plus. Respetar mayúsculas/minúsculas en imports (`Button.astro`).

## 16. Pruebas y compilación

| Prueba | Acción | Esperado |
|---|---|---|
| Rutas | Abrir `/` y `/design` | Ambas cargan |
| Añadir tarea | «Repasar componentes de Astro» en Trabajo | Aparece fila, sube total |
| Cambiar área | «Preparar rutina» en Gimnasio | Fila muestra Gimnasio |
| Persistencia | Recargar (mismo navegador y puerto) | Tareas continúan |
| Completado | Marcar y recargar | Conserva marca en el mismo día |
| Hábitos | Marcar uno | Cambia su contador separado |
| Captura rápida | Enviar frase | Tarea de Trabajo |
| Campo vacío | Solo espacios | Aviso + foco |
| Ritmo | «Lo esencial» | Cambia texto y botón |
| Voz | Micrófono | Abre info, sin grabar |

Teclado/pantalla: Tab recorre con foco visible; en el modal el foco queda dentro; selector con flechas/Home/End/letra/Enter/Escape (Escape en lista cierra la lista antes que el modal); Escape devuelve foco al disparador; a ~390 px sin scroll horizontal y menú móvil abre/cierra; probar Tab/Shift+Tab/Escape en menú móvil y ampliar ventana; en `/design` el modal devuelve el foco. Errores JS → pestaña Console (F12); de compilación → terminal. Local Storage: Chrome/Edge Application → Local Storage; Firefox → Almacenamiento.

```sh
pnpm build
pnpm preview
```

`build` genera `dist/` sin errores (rutas inicio y diseño). `preview` sirve localmente (otro puerto = otro almacenamiento). No abrir `dist/index.html` con doble clic.

```sh
pnpm astro sync
pnpm exec tsc --noEmit
```

`tsc --noEmit` NO revisa plantillas `.astro`. Opcional (docente): `pnpm add -D @astrojs/check` y `pnpm astro check` (no forma parte de la base).

## 17. Ejecutar el proyecto completo del docente

1. Extraer `norte-senati-material.zip`.
2. Abrir la carpeta `norte-senati` en VS Code (no la superior).
3. Confirmar `package.json`, `pnpm-lock.yaml`, `src`, `public`.
4. En esa carpeta:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`--frozen-lockfile` conserva versiones resueltas. No copiar `node_modules` de otra máquina. Si el lockfile no coincide: no editaste `package.json`, carpeta correcta, pnpm 12.3.4; o recuperar archivos de la entrega original. Tras cambiar dependencias a propósito, usar `pnpm install`. No hay repositorio remoto ni `git clone`.

## 18. Errores frecuentes

| Síntoma | Causa | Acción |
|---|---|---|
| `node`/`npm` no se reconoce | Instalación o PATH | Cerrar/abrir VS Code; revisar Node.js |
| `pnpm` no se reconoce | No disponible en esa terminal | Verificar instalación, terminal nueva |
| PowerShell bloquea scripts | Ejecución de `.ps1` | Command Prompt o `.cmd` |
| No encuentra `package.json` | Terminal fuera de la raíz | Entrar a la carpeta correcta |
| Error al leer JSON | Coma/comillas/comentario | Revisar `package.json`, `tsconfig.json` |
| Versión de Node incompatible | Node antiguo | Usar línea 24 LTS |
| Error de red al instalar | Conexión/proxy/registro | Revisar con docente/soporte |
| `Cannot find module` | Falta instalar o ruta mal | `pnpm install`, revisar import |
| Alias `@/` no se resuelve | Falta `paths` | Revisar `tsconfig.json`, reiniciar servidor |
| Icono desconocido | Nombre no incluido | Usar nombre válido (ej. `plus`) |
| Sin estilos | Falta import o plugin | Revisar `BaseLayout`, `global.css`, `astro.config.mjs` |
| Botones no responden | Script temporal, error en Console, atributos distintos | Poner script completo; revisar selectores/ids |
| Se guarda pero no aparece fila | Falta modelo `data-task-row` | Conservar fila inicial o implementar plantilla |
| Datos desaparecen | Cambió navegador/puerto/origen | Volver al mismo origen; revisar Local Storage |
| Aviso de fallo al guardar | Almacenamiento bloqueado/sin espacio | Perfil normal con almacenamiento permitido |
| Navegador no conecta | Servidor detenido/URL errónea | `pnpm dev` y usar URL de la terminal |
| Modal sin foco | Ids/estructura alterados | Comparar `Modal`, `AppLayout`, `interactions.ts` |

Leer primero el primer error. Para reiniciar datos: borrar solo claves `norte:` del origen; no usar `localStorage.clear()`.

## 19. Práctica y sustentación

**Actividades**: (1) cambiar título de una tarea de ejemplo a «Preparar mi práctica de SENATI» conservando `id`; (2) en `/design` añadir otro `Button` secundario que abra el modal existente; (3) crear dos pendientes, marcar uno, recargar y decir qué clave guarda cada cosa; (4) modificar una separación en CSS y comparar escritorio/móvil sin cambiar colores de identidad; (5) localizar límite de 50 y de 180 y explicar dónde reforzar la validación. Ampliación: eliminar pendientes con confirmación propia (sin `confirm/alert/prompt`), definiendo qué pasa con fila, arreglo guardado y marcas diarias.

**Preguntas de sustentación**: diferencia `public` vs `src`; qué se procesa al compilar vs al hacer clic; qué reciben `Astro.props` y `<slot />`; por qué Cancelar no usa `type="submit"`; por qué casilla HTML real; recorrido formulario → `localStorage` → pantalla; por qué `textContent`; qué cambia con otro puerto; cómo saber que un modal funciona con teclado; qué falta para IA y sincronización.

**Orientación**: `public` = recursos directos, `src` = código procesado por Astro. Frontmatter prepara HTML; script del navegador escucha acciones. Props = entradas; slot = contenido. Casilla real = semántica y teclado. Flujo: valida → `addTask` → `appendTask` → `write`; luego `read`. `textContent` no interpreta HTML. Otro puerto = otro origen. Modal gestiona foco, Tab, Escape y retorno. Para IA: backend + integraciones, y auth + sincronización si hay usuarios.

**Entrega**: `package.json`, `pnpm-lock.yaml`, configuraciones, `src`, `public`. Sin `node_modules`, `.astro`, `dist`, datos personales ni `.env`. Texto breve (nombre, herramientas, cómo ejecutar, una dificultad resuelta), capturas de Hoy en escritorio y móvil, tarea creada y `/design`. Demo: crear tarea, recargar, explicar por qué permanece.

| Criterio | Puntaje |
|---|---|
| Entorno, configuración y ejecución reproducible | 4 |
| Organización, componentes y explicación de Astro | 4 |
| Interacción, validación y persistencia local | 5 |
| Diseño adaptable y uso con teclado | 4 |
| Sustentación y entrega ordenada | 3 |
| **Total** | **20** |

## 20. Después de esta etapa

Prototipo estático con interacción local. Evolución: edición/eliminación, backend, auth, sincronización, IA/voz. Las claves privadas viven solo en código de servidor, nunca en el prototipo ni en el script del navegador.

Fuentes oficiales: Node.js, VS Code (Windows), pnpm, Astro (instalación/config, TypeScript, scripts y eventos), Tailwind CSS con Vite. Conservar versiones y lockfile de la entrega para reproducir la práctica.
