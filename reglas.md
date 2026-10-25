# Reglas del proyecto Norte (para el agente de IA)

> Colócalo como `AGENTS.md` / `.cursor/rules/norte.mdc` o dentro del contexto del agente. La referencia completa está en `guia-norte.md`.

## 1. Stack y versiones (no cambiar sin pedirlo)

- Astro 7.4.2 · TypeScript 7.0.2 · Tailwind CSS 4.3.3 (`@tailwindcss/vite`) · `@iconify-json/heroicons` 1.2.3
- Node.js 24 LTS · pnpm **12.3.4** (campo `packageManager`)
- Sitio **estático**. Sin backend, sin base de datos, sin claves API, sin React/Vue, sin runtime de Tailwind Plus.
- Gestor: solo `pnpm`. Nunca `npm install` / `yarn` dentro del proyecto. No tocar `pnpm-lock.yaml` a mano.

## 2. Comandos

```sh
pnpm install --frozen-lockfile   # instalar fiel al lockfile
pnpm dev                         # desarrollo (normalmente localhost:4321)
pnpm build                       # debe terminar sin errores
pnpm preview                     # revisar la compilación
pnpm astro sync && pnpm exec tsc --noEmit   # tipos (no revisa .astro)
```

## 3. Estructura y responsabilidades

```text
public/brand/              SVG de marca (se sirven desde /brand/...)
src/components/ui/         Icon, Button, Brand, Checkbox, Modal (reutilizables)
src/layouts/               BaseLayout (documento HTML) · AppLayout (shell de app)
src/lib/interactions.ts    TODO el comportamiento del navegador
src/pages/                 index.astro (/) · design.astro (/design)
src/styles/global.css      Tokens (@theme), utilidades, estilos de app
```

- Imports con alias `@/` → `src/`. Respetar mayúsculas/minúsculas.
- Un cambio en un componente de `ui/` debe beneficiar a todas las pantallas que lo usan: no duplicar markup.

## 4. Reglas de Tailwind CSS 4

- El CSS empieza con `@import "tailwindcss"`; tokens en `@theme`.
- **Prohibido** `tailwindcss init`, `tailwind.config.js` y directivas de Tailwind 3 (`@tailwind base`, etc.).
- Colores/fuentes solo vía tokens (`--color-pine`, `--color-canvas`, `--color-ink`, `--font-display`…). No inventar verdes ni hex nuevos sueltos.
- Utilidades Tailwind para ajustes puntuales; clases propias (`.task-row`, `.sidebar`…) para estilo compartido.
- Breakpoints actuales: 1450, 1200, 1023 (sidebar móvil), 767, 639. **El breakpoint 1023 de CSS y `matchMedia('(max-width: 1023px)')` de TS deben coincidir.**

## 5. Reglas de Astro

- Frontmatter (`---`) corre al generar; **no** reacciona a clics. Interactividad → `interactions.ts`.
- `<script src="@/lib/interactions.ts">` **sin `is:inline`**.
- Dos slots en `AppLayout`: `<slot />` y `<slot name="dialogs" />`. Los modales van en `dialogs` (fuera de `#app-root`, porque `#app-root` recibe `inert`).
- `Icon` usa solo variante `-16-solid`; nombre inexistente lanza error. `set:html` **solo** para el SVG del paquete, jamás con texto del usuario.
- `Button`: `type="button"` por defecto; solo Guardar/Enviar usan `type="submit"`. Pasar atributos con `...rest`.

## 6. Reglas de TypeScript e interacciones

- **XSS**: títulos de usuario se escriben con `textContent`. Prohibido `innerHTML` con contenido del usuario.
- Datos de `localStorage` se **validan al leer** (tipos, regex de id `^task-[a-z0-9-]+$`, título ≤ 180, área en lista, máx. 50). `as T` no es validación.
- Claves de almacenamiento: `norte:tasks:v1` (tareas) y `norte:day:YYYY-MM-DD` (marcas y ritmo, día en zona `America/Lima`). Cambiar el formato exige versionar la clave (`v2`) y migrar.
- Todo `read/write` de storage en `try/catch`; si falla, avisar y seguir en memoria.
- Delegación de eventos para casillas (`change` en `document` filtrando `[data-check]`).
- `appendTask` clona una fila `[data-task-row]`: no eliminar todas las filas iniciales sin crear otra plantilla.
- `id` de tareas/hábitos de ejemplo (`proposal`, `training`, `budget`, `water`, `walk`, `sleep`) **no se renombran**: el estado guardado depende de ellos.
- Los atributos `data-*` son el contrato HTML↔JS (`data-open-modal`, `data-close-modal`, `data-check`, `data-mode`, `data-quick`, `data-select`, `data-nav-toggle`, `data-nav-close`, `data-task-row`, `data-full-date`, `data-short-date`). Si se renombra uno, renombrar ambos lados.
- Prohibido `alert`, `confirm`, `prompt`. Usar `Modal` y `notify` propios.
- `crypto.randomUUID()` requiere `localhost` o HTTPS.
- El selector de área está atado a `#area-value`: para más de uno, generalizar con ids únicos antes de duplicar.

## 7. Accesibilidad (no negociable)

- Casillas son `input type="checkbox"` reales (teclado nativo); solo cambia la apariencia.
- Iconos decorativos `aria-hidden="true"`; botones solo-icono llevan `aria-label`.
- Modal: `role="dialog"`, `aria-modal`, `aria-labelledby`; foco al abrir, atrapado con Tab/Shift+Tab, Escape cierra, foco vuelve al disparador.
- Selector: soporte de flechas, Home, End, letra, Enter/espacio, Escape (cierra lista antes que modal), Tab.
- Foco visible siempre (`:focus-visible`), respetar `prefers-reduced-motion`, sin horizontal scroll a ~390 px.
- Los estados no dependen solo del color.

## 8. Alcance (qué NO existe todavía — no fingir que existe)

IA, voz (solo muestra modal informativo, no graba), agenda programable (datos de ejemplo), usuarios, sincronización, edición/eliminación de tareas. La UI ya lo comunica con notas de prototipo; no quitarlas hasta implementar la función real.

## 9. Tono de producto (textos de UI en español)

Humano, concreto, sin culpa ni urgencia artificial ("Elige una prioridad", no "sé más productivo"). Un botón primario por vista.

## 10. Cómo trabajar (reglas para el agente)

1. **Spec primero**: leer `sdd.md` y la tarea activa antes de editar. No implementar fuera de la tarea.
2. Cambios mínimos y localizados; no reformatear archivos ajenos a la tarea.
3. No añadir dependencias sin pedirlo explícitamente.
4. Un cambio a la vez; tras cada uno: `pnpm build` y prueba manual de lo tocado.
5. **Nunca declarar "hecho" sin evidencia**: pegar salida real de `pnpm build` / `tsc` y, para UI, describir lo verificado (ruta, acción, resultado). Si no se pudo verificar algo, decirlo.
6. Si falta información o hay contradicción con la spec, **preguntar**; no inventar.
7. Reportar así, corto:
   - **Problema** → **Causa** → **Fix (archivo:línea)** → **Verificación (salida real)** → **Estado**.
8. Si un fix falla o no se puede confirmar, decirlo tal cual; sin relleno ni complacencia.

## 11. Entrega (si es trabajo para SENATI)

Incluir `package.json`, `pnpm-lock.yaml`, configs, `src`, `public`. Excluir `node_modules`, `.astro`, `dist`, `.env`, datos personales.
