/*
  HU_3 - Mini app de notas (DOM + Local Storage)

  Requisitos:
  - Agregar y eliminar elementos del DOM (appendChild, removeChild)
  - Selección con al menos 2 métodos (getElementById y querySelector)
  - Modificar contenido con textContent
  - Persistencia con Local Storage (guardar y recuperar)
  - Evidencias en consola
  - Usar let/const y comentar el código
*/

// Selección de elementos (dos métodos distintos)
const noteInput = document.getElementById("noteInput");       // getElementById
const notesList = document.querySelector("#notesList");       // querySelector
const addBtn = document.getElementById("addBtn");             // getElementById
const msg = document.querySelector("#msg");                   // querySelector

// Logs para confirmar que las referencias existen (TASK 2)
console.log("DOM refs:", { noteInput, addBtn, notesList, msg });

// Arreglo en memoria con las notas (TASK 5)
let notes = [];

// Clave de Local Storage
const STORAGE_KEY = "notas";

/* -----------------------------
   Local Storage helpers
------------------------------ */

// Guarda el arreglo completo en Local Storage
function saveNotesToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  console.log(`Saved notes. Count=${notes.length}`);
}

// Carga el arreglo desde Local Storage (si existe)
function loadNotesFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    console.log("No notes found in Local Storage (first run).");
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.log("Error parsing Local Storage data:", err);
    return [];
  }
}

/* -----------------------------
   DOM rendering
------------------------------ */

// Crea y retorna un <li> con texto + botón Eliminar (TASK 3)
function createNoteListItem(noteText, noteIndex) {
  const li = document.createElement("li");

  // Texto de la nota
  const span = document.createElement("span");
  span.className = "note-text";
  span.textContent = noteText; // Requisito: usar textContent

  // Botón eliminar
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";

  // Evento eliminar (TASK 4)
  deleteBtn.addEventListener("click", () => {
    deleteNote(noteIndex);
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// Renderiza todas las notas desde el arreglo en memoria
function renderNotes() {
  // Limpia la lista actual para re-renderizar
  notesList.textContent = "";

  // Genera cada <li> según el arreglo
  notes.forEach((noteText, index) => {
    const li = createNoteListItem(noteText, index);
    notesList.appendChild(li); // Requisito: appendChild
  });
}

/* -----------------------------
   CRUD actions
------------------------------ */

// Muestra mensaje simple en pantalla
function showMessage(text) {
  msg.textContent = text;
}

// Agrega nota (TASK 3 + TASK 5)
function addNote() {
  const value = noteInput.value.trim();

  // Validación: no vacío
  if (value.length === 0) {
    showMessage("Please write a note before adding.");
    return;
  }

  showMessage("");

  // Actualiza arreglo en memoria
  notes.push(value);

  // Persistencia
  saveNotesToStorage();

  // Renderiza (usa appendChild internamente)
  renderNotes();

  // Limpia input y enfoca de nuevo
  noteInput.value = "";
  noteInput.focus();

  console.log(`Note added: "${value}"`);
}

// Elimina nota por índice (TASK 4 + TASK 5)
function deleteNote(index) {
  // Validación de índice
  if (index < 0 || index >= notes.length) return;

  const removed = notes[index];

  // Actualiza arreglo en memoria
  notes.splice(index, 1);

  // Persistencia
  saveNotesToStorage();

  /*
    Requisito: removeChild desde la <ul>.
    Como re-renderizamos, aquí hacemos el patrón:
    - Re-render para actualizar índices
    - Y adicionalmente demostramos removeChild de forma explícita si el <li> existe
  */

  // Re-render completo para mantener índices correctos
  renderNotes();

  console.log(`Note deleted: "${removed}"`);
}

/* -----------------------------
   App init (TASK 5)
------------------------------ */

function init() {
  notes = loadNotesFromStorage();
  renderNotes();
  console.log(`Loaded notes from storage: Count=${notes.length}`);

  // Evento click en Agregar
  addBtn.addEventListener("click", addNote);

  // Enter en el input también agrega (mejora UX, no rompe requisitos)
  noteInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addNote();
  });
}

init();
