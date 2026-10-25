# SDD — Norte (Spec-Driven Development)

> Spec viva del proyecto. Flujo: **Spec → Plan → Tareas → Implementación → Verificación**. El agente solo implementa tareas de la sección 5 y marca `[x]` con evidencia. Contexto técnico: `guia-norte.md`. Reglas: `reglas.md`.

## 1. Contexto y objetivo

**Norte** es un asistente personal web (pantalla *Hoy* + guía de diseño `/design`) para practicar Astro, componentes, CSS con tokens, TypeScript e interacción local. Resultado: prototipo estático que el estudiante puede explicar y modificar.

**Fuera de alcance (v0.0.1)**: IA, voz real, agenda editable, usuarios, sincronización, backend.

## 2. Requisitos funcionales (EARS)

| ID | Requisito |
|---|---|
| RF-01 | El sistema DEBE mostrar en `/` prioridades, agenda de ejemplo, hábitos, áreas y captura rápida. |
| RF-02 | El sistema DEBE servir `/design` con identidad, paleta, tipografía, componentes y reglas. |
| RF-03 | CUANDO el usuario pulse "Añadir pendiente" o "Capturar algo…", el sistema DEBE abrir el modal `new-task` con foco en el campo título. |
| RF-04 | CUANDO se envíe el formulario con título no vacío, el sistema DEBE crear una fila, guardarla en `localStorage` y avisar por toast. |
| RF-05 | SI el título está vacío o solo espacios, ENTONCES el sistema DEBE mostrar aviso, marcar `aria-invalid` y devolver el foco al campo. |
| RF-06 | CUANDO se envíe la captura rápida, el sistema DEBE crear un pendiente del área **Trabajo**. |
| RF-07 | CUANDO se marque/desmarque una casilla de tarea u hábito, el sistema DEBE guardar el estado del día y actualizar sus contadores por separado. |
| RF-08 | CUANDO se elija un ritmo (normal/busy/minimum), el sistema DEBE cambiar el texto, `aria-pressed` y persistir la elección del día. |
| RF-09 | CUANDO se recargue la página en el mismo origen, el sistema DEBE restaurar tareas añadidas, marcas del día y ritmo. |
| RF-10 | CUANDO se pulse el micrófono, el sistema DEBE abrir información sin solicitar permisos de audio. |
| RF-11 | EN viewport < 1024 px el sistema DEBE ofrecer barra lateral con apertura/cierre por botón, fondo, Escape y selección de enlace. |
| RF-12 | El sistema DEBE mostrar la fecha en zona `America/Lima`. |

## 3. Requisitos no funcionales

| ID | Requisito |
|---|---|
| RNF-01 | `pnpm build` termina sin errores; `pnpm preview` reproduce el comportamiento. |
| RNF-02 | Accesibilidad por teclado completa (Tab, Shift+Tab, Escape, flechas, Home/End); foco visible; foco atrapado en modal. |
| RNF-03 | Sin scroll horizontal a ~390 px. |
| RNF-04 | Límite de 50 pendientes añadidos; título ≤ 180 caracteres; datos de storage validados al leer. |
| RNF-05 | Sin `innerHTML` con texto de usuario; sin `alert/confirm/prompt`. |
| RNF-06 | Falla de `localStorage` no rompe la app (avisa y sigue en memoria). |
| RNF-07 | Reproducible: versiones y lockfile fijos (ver `reglas.md` §1). |

## 4. Diseño (resumen técnico)

- **Arquitectura**: Astro estático; componentes `ui/` (Icon, Button, Brand, Checkbox, Modal); `BaseLayout` → `AppLayout` → páginas; comportamiento en un único `interactions.ts` cargado como script procesado por Astro.
- **Datos**: tareas/agenda/hábitos de ejemplo hardcodeados en `index.astro`; tareas del usuario `{ id, title, area }` en `norte:tasks:v1`; estado diario `{ checked, mode }` en `norte:day:FECHA`.
- **Contrato HTML↔JS**: atributos `data-*` (lista en `reglas.md` §6).
- **Decisiones**: Tailwind 4 con `@theme`; casillas HTML reales; modales con `inert` sobre `#app-root`; toast con `aria-live`; clonado de fila como plantilla (limitación conocida).
- **Riesgos conocidos**: depende de que exista una fila `data-task-row`; selector atado a `#area-value`; no hay reinicio al cruzar medianoche; límite de 180 solo en controles y al leer.

## 5. Tareas

Formato: `- [ ] T-XX (RF/RNF) descripción — Criterio de aceptación`. El agente marca `[x]` solo con evidencia pegada (salida de build/tsc + prueba manual).

### Fase A — Base (reproducir la guía)
- [ ] T-01 (RNF-07) Entorno y `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore` — `pnpm install` OK; `pnpm dev` levanta.
- [ ] T-02 (RF-02) Marca SVG en `public/brand/` — `/brand/norte-logo.svg` y `/brand/norte-symbol.svg` cargan.
- [ ] T-03 (RNF-07) `global.css` con tokens y estilos — página de prueba con fondo marfil y botón pino.
- [ ] T-04 Componentes `ui/` (Icon, Button, Brand, Checkbox, Modal) — los 5 archivos existen y compilan; un icono inexistente lanza error claro.
- [ ] T-05 `BaseLayout` y `AppLayout` con `interactions.ts` temporal — shell visible, sin errores de import.
- [ ] T-06 (RF-01) `index.astro` completa — se ven prioridades, agenda, captura, hábitos y áreas.
- [ ] T-07 (RF-02) `design.astro` — `/design` muestra 6 secciones.

### Fase B — Interacción
- [ ] T-08 (RF-04, RF-09, RNF-04, RNF-06) Lectura/escritura validada de `localStorage` — recargar conserva tareas; datos corruptos no rompen.
- [ ] T-09 (RF-07) Casillas con delegación y contadores — tarea y hábito cuentan separado; sobrevive recarga el mismo día.
- [ ] T-10 (RF-08) Ritmo del día — 3 modos cambian texto y `aria-pressed`; persiste.
- [ ] T-11 (RF-03, RNF-02) Modales con foco/inert/Escape/Tab — foco vuelve al disparador.
- [ ] T-12 Selector de área accesible — flechas, Home/End, letra, Enter, Escape (cierra lista antes que modal).
- [ ] T-13 (RF-04, RF-05, RF-06) Formularios — válido crea; vacío avisa y enfoca; captura rápida = Trabajo; límite 50.
- [ ] T-14 (RF-11, RNF-03) Navegación móvil — abre/cierra por 4 vías; ampliar ventana no deja la página inerte.
- [ ] T-15 (RF-12, RF-10) Fechas Lima y modal de voz informativo.

### Fase C — Verificación y entrega
- [ ] T-16 (RNF-01) `pnpm build`, `pnpm preview`, `pnpm astro sync && pnpm exec tsc --noEmit` — salidas pegadas sin errores.
- [ ] T-17 (RNF-02, RNF-03) Pruebas de teclado y 390 px según la guía §16 — checklist completo.
- [ ] T-18 Entrega: ZIP sin `node_modules/.astro/dist/.env` + capturas (Hoy desktop/móvil, tarea creada, `/design`) + texto breve.

### Fase D — Ampliaciones (post-base, requieren nueva spec)
- [ ] T-19 Eliminar pendiente con confirmación propia (definir efecto en fila, arreglo y marcas diarias).
- [ ] T-20 Plantilla de fila independiente de `data-task-row`.
- [ ] T-21 Reforzar límite de 180 dentro de `addTask`.
- [ ] T-22 Generalizar el selector (ids únicos, varios por página).
- [ ] T-23 Backend, auth, sincronización, IA/voz (claves solo en servidor).

## 6. Matriz de verificación

| Requisito | Cómo se verifica |
|---|---|
| RF-01/02 | Abrir `/` y `/design`; ver secciones |
| RF-03..06 | Crear tarea, vacío, captura rápida, 51ª tarea |
| RF-07..09 | Marcar, cambiar ritmo, recargar mismo origen; revisar Local Storage |
| RF-10 | Pulsar micrófono; confirmar que no hay prompt de permisos |
| RF-11 | Ventana < 1024 px; abrir/cerrar por botón, fondo, Escape, enlace |
| RF-12 | Revisar fecha mostrada vs zona Lima |
| RNF-01 | Salida real de `pnpm build` |
| RNF-02/03 | Pruebas de teclado y 390 px |
| RNF-04..06 | Editar a mano `norte:tasks:v1` en DevTools con datos inválidos; bloquear storage |

## 7. Definición de "hecho" (por tarea)

1. Criterio de aceptación cumplido.
2. `pnpm build` sin errores (salida pegada).
3. Prueba manual descrita (ruta, acción, resultado).
4. Sin romper tareas anteriores.
5. Reporte en formato: Problema → Causa → Fix (archivo) → Verificación → Estado.

## 8. Registro de cambios de la spec

| Fecha | Cambio |
|---|---|
| 2026-10-25 | Spec inicial derivada de la guía Norte 0.0.1 |
