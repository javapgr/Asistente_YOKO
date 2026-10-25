type SavedTask = { id: string; title: string; area: string };
type DailyState = { checked: Record<string, boolean>; mode: 'normal' | 'busy' | 'minimum' };

const areas = ['Trabajo', 'Gimnasio', 'Alimentación', 'Sueño', 'Finanzas', 'Tiempo libre'];
const modes: DailyState['mode'][] = ['normal', 'busy', 'minimum'];
const day = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Lima',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
const storageKey = `norte:day:${day}`;
const customKey = 'norte:tasks:v1';
let storageAvailable = true;
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function notify(message: string) {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 5000);
}

function readStorage(key: string): unknown {
  try {
    const value = localStorage.getItem(key);
    return value === null ? null : JSON.parse(value);
  } catch {
    storageAvailable = false;
    notify('No se pudieron leer los datos guardados. Continuaremos en memoria.');
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    storageAvailable = false;
    notify('No se pudo guardar en este navegador. Los cambios durarán hasta cerrar esta página.');
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSavedTask(value: unknown): value is SavedTask {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && /^task-[a-z0-9-]+$/.test(value.id)
    && typeof value.title === 'string'
    && value.title.trim().length > 0
    && value.title.length <= 180
    && typeof value.area === 'string'
    && areas.includes(value.area);
}

function readDailyState(): DailyState {
  const daily: DailyState = { checked: {}, mode: 'normal' };
  const raw = readStorage(storageKey);
  if (!isRecord(raw)) return daily;
  if (isRecord(raw.checked)) {
    for (const [id, checked] of Object.entries(raw.checked)) {
      if (/^[a-z0-9-]+$/.test(id) && typeof checked === 'boolean') daily.checked[id] = checked;
    }
  }
  if (typeof raw.mode === 'string' && modes.includes(raw.mode as DailyState['mode'])) {
    daily.mode = raw.mode as DailyState['mode'];
  }
  return daily;
}

function readSavedTasks(): SavedTask[] {
  const raw = readStorage(customKey);
  if (!Array.isArray(raw)) return [];
  return raw.filter(isSavedTask).slice(0, 50);
}

const daily = readDailyState();
const tasks = readSavedTasks();

function updateCounts() {
  for (const [kind, id] of [['task', 'task-count'], ['habit', 'habit-count']] as const) {
    const checks = [...document.querySelectorAll<HTMLInputElement>(`input[data-check="${kind}"]`)];
    const element = document.getElementById(id);
    if (element) element.textContent = `${checks.filter((check) => check.checked).length} ${kind === 'task' ? 'de' : '/'} ${checks.length}`;
  }
}

function appendTask(task: SavedTask) {
  const list = document.getElementById('task-list');
  const template = list?.querySelector<HTMLElement>('[data-task-row]');
  if (!list || !template) return;
  const row = template.cloneNode(true) as HTMLElement;
  row.classList.remove('task-featured');
  const check = row.querySelector<HTMLInputElement>('input[data-check]');
  const label = row.querySelector<HTMLLabelElement>('label');
  const meta = row.querySelector<HTMLElement>('.task-meta');
  const tag = row.querySelector<HTMLElement>('.task-tag');
  if (!check || !label || !meta || !tag) return;
  check.id = task.id;
  check.name = task.id;
  check.checked = daily.checked[task.id] ?? false;
  check.setAttribute('aria-label', `Completar: ${task.title}`);
  label.htmlFor = task.id;
  label.textContent = task.title;
  meta.replaceChildren();
  const dot = document.createElement('span');
  dot.className = `area-dot area-${areas.indexOf(task.area)}`;
  const area = document.createElement('span');
  area.textContent = task.area;
  const detail = document.createElement('span');
  detail.textContent = 'Pendiente capturado';
  meta.append(dot, area, detail);
  tag.className = 'task-tag';
  tag.textContent = 'Personal';
  list.append(row);
}

tasks.forEach(appendTask);
document.querySelectorAll<HTMLInputElement>('[data-check]').forEach((check) => {
  check.checked = daily.checked[check.id] ?? false;
});
updateCounts();

document.addEventListener('change', (event) => {
  if (!(event.target instanceof HTMLInputElement) || !event.target.matches('[data-check]')) return;
  daily.checked[event.target.id] = event.target.checked;
  writeStorage(storageKey, daily);
  updateCounts();
});

const descriptions: Record<DailyState['mode'], string> = {
  normal: 'Tres prioridades y espacio para respirar. Un plan que se adapta a la vida real.',
  busy: 'Elige dos prioridades. Deja margen para los imprevistos y reserva tiempo para descansar.',
  minimum: 'Elige una sola prioridad y su versión más pequeña. Lo demás puede esperar.',
};

function setMode(mode: string, announce = false) {
  if (!modes.includes(mode as DailyState['mode'])) return;
  daily.mode = mode as DailyState['mode'];
  document.querySelectorAll<HTMLElement>('[data-mode]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  });
  const description = document.getElementById('mode-description');
  if (description) description.textContent = descriptions[daily.mode];
  if (announce) {
    writeStorage(storageKey, daily);
    if (storageAvailable) notify('Ritmo actualizado. Tus pendientes siguen guardados.');
  }
}

setMode(daily.mode);
document.querySelectorAll<HTMLElement>('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode ?? '', true));
});
document.querySelector('[data-quick]')?.addEventListener('click', () => {
  setMode('minimum', true);
  document.getElementById('intention-title')?.scrollIntoView({ block: 'center' });
});

let activeModal: HTMLElement | null = null;
let previousFocus: HTMLElement | null = null;
const app = document.getElementById('app-root');
const focusables = (root: HTMLElement) => [...root.querySelectorAll<HTMLElement>('button, a[href], input:not([type=hidden]), textarea, [tabindex="0"]')]
  .filter((element) => !element.closest('[hidden]') && !(element as HTMLButtonElement).disabled && element.getClientRects().length > 0);

function closeSelect(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>('[role="listbox"]');
  const trigger = root.querySelector<HTMLButtonElement>('button');
  if (list) list.hidden = true;
  trigger?.setAttribute('aria-expanded', 'false');
}

function closeModal() {
  if (!activeModal) return;
  activeModal.querySelectorAll<HTMLElement>('[data-select]').forEach(closeSelect);
  activeModal.hidden = true;
  activeModal = null;
  if (app) app.inert = false;
  document.body.style.overflow = '';
  previousFocus?.focus();
}

function openModal(id: string) {
  const modal = document.getElementById(id);
  if (!modal) return;
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  activeModal = modal;
  modal.hidden = false;
  if (app) app.inert = true;
  document.body.style.overflow = 'hidden';
  const target = modal.querySelector<HTMLElement>('input:not([type=hidden]), textarea')
    ?? focusables(modal)[0]
    ?? modal.querySelector<HTMLElement>('[role="dialog"]');
  target?.focus();
}

document.querySelectorAll<HTMLElement>('[data-open-modal]').forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.openModal ?? ''));
});
document.querySelectorAll<HTMLElement>('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', closeModal);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeModal) {
    event.preventDefault();
    closeModal();
  }
  if (event.key !== 'Tab' || !activeModal) return;
  const elements = focusables(activeModal);
  const first = elements[0];
  const last = elements.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

document.querySelectorAll<HTMLElement>('[data-select]').forEach((root) => {
  const trigger = root.querySelector<HTMLButtonElement>('.select-trigger');
  const list = root.querySelector<HTMLElement>('[role="listbox"]');
  const options = [...root.querySelectorAll<HTMLElement>('[role="option"]')];
  if (!trigger || !list || options.length === 0) return;
  const open = () => {
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    (options.find((option) => option.getAttribute('aria-selected') === 'true') ?? options[0]).focus();
  };
  const choose = (option: HTMLElement) => {
    const value = option.dataset.value;
    if (!value || !areas.includes(value)) return;
    const hidden = root.querySelector<HTMLInputElement>('input[type="hidden"]');
    const label = root.querySelector<HTMLElement>('#area-value');
    if (hidden) hidden.value = value;
    if (label) label.textContent = value;
    options.forEach((item) => item.setAttribute('aria-selected', String(item === option)));
    closeSelect(root);
    trigger.focus();
  };
  trigger.addEventListener('click', () => (list.hidden ? open() : closeSelect(root)));
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  });
  options.forEach((option) => option.addEventListener('click', () => choose(option)));
  root.addEventListener('keydown', (event) => {
    if (list.hidden) return;
    const index = options.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeSelect(root);
      trigger.focus();
    } else if (event.key === 'Tab') {
      closeSelect(root);
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options[next].focus();
    } else if (['Enter', ' '].includes(event.key) && index >= 0) {
      event.preventDefault();
      choose(options[index]);
    } else if (event.key.length === 1 && /\p{L}/u.test(event.key)) {
      options.find((option) => option.dataset.value?.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()))?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node)) closeSelect(root);
  });
});

function addTask(title: string, area: string) {
  if (tasks.length >= 50) {
    notify('Has llegado a 50 pendientes en este prototipo.');
    return false;
  }
  if (!areas.includes(area) || title.trim().length === 0 || title.trim().length > 180) return false;
  const id = `task-${crypto.randomUUID()}`;
  const task: SavedTask = { id, title: title.trim(), area };
  tasks.push(task);
  appendTask(task);
  writeStorage(customKey, tasks);
  updateCounts();
  if (storageAvailable) notify('Pendiente guardado. Ya tiene su lugar.');
  return true;
}

const taskForm = document.querySelector<HTMLFormElement>('#task-form');
taskForm?.setAttribute('novalidate', '');
taskForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = taskForm.querySelector<HTMLInputElement>('[name="title"]');
  const area = taskForm.querySelector<HTMLInputElement>('[name="area"]');
  if (!input || !area) return;
  const title = input.value.trim();
  if (!title) {
    input.setAttribute('aria-invalid', 'true');
    notify('Escribe un nombre para tu pendiente.');
    input.focus();
    return;
  }
  input.removeAttribute('aria-invalid');
  if (addTask(title, area.value)) {
    input.value = '';
    closeModal();
  }
});

const captureForm = document.querySelector<HTMLFormElement>('#capture-form');
captureForm?.setAttribute('novalidate', '');
captureForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = captureForm.querySelector<HTMLTextAreaElement>('textarea');
  if (!input) return;
  if (!input.value.trim()) {
    input.setAttribute('aria-invalid', 'true');
    notify('Escribe lo que tienes en mente.');
    input.focus();
    return;
  }
  input.removeAttribute('aria-invalid');
  if (addTask(input.value, 'Trabajo')) {
    input.value = '';
    input.focus();
  }
});

const sidebar = document.getElementById('sidebar');
const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const backdrop = document.querySelector<HTMLElement>('.nav-backdrop');
const workspace = document.querySelector<HTMLElement>('.workspace');
const mobile = matchMedia('(max-width: 1023px)');
let navOpen = false;

function setNav(open: boolean, restore = true) {
  navOpen = open;
  sidebar?.classList.toggle('is-open', open);
  if (sidebar) sidebar.inert = mobile.matches && !open;
  if (workspace) workspace.inert = open;
  navToggle?.setAttribute('aria-expanded', String(open));
  if (backdrop) backdrop.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open && sidebar) focusables(sidebar)[0]?.focus();
  else if (restore) navToggle?.focus();
}

if (sidebar) sidebar.inert = mobile.matches;
navToggle?.addEventListener('click', () => setNav(!navOpen));
document.querySelectorAll<HTMLElement>('[data-nav-close]').forEach((button) => button.addEventListener('click', () => setNav(false)));
sidebar?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { if (mobile.matches) setNav(false); }));
mobile.addEventListener('change', () => setNav(false, false));
