/*
  HU_4 - Semana 4
  Mini aplicación web integral: DOM + Local Storage + Fetch API (CRUD)

  Reglas solicitadas:
  - Código y variables en inglés (camelCase)
  - Comentarios en español
  - let/const, ES6+, async/await, try/catch
  - Validaciones y mensajes dinámicos
  - DOM: crear/modificar/eliminar elementos (appendChild/removeChild)
  - Persistencia: Local Storage (setItem/getItem)
  - API: GET, POST, PUT, DELETE (JSON Server recomendado)
*/

/* -----------------------------
   1) Configuración y estado global
------------------------------ */

// Cambia el puerto si tu JSON Server usa otro
const apiBaseUrl = "http://localhost:3000";
const apiResource = "items";
const apiUrl = `${apiBaseUrl}/${apiResource}`;

// Clave de Local Storage
const storageKey = "hu4_items";

// Arreglo global en memoria (fuente de verdad para UI + Local Storage)
let items = [];

/* -----------------------------
   2) Selección de DOM
------------------------------ */

const itemForm = document.getElementById("itemForm");
const nameInput = document.getElementById("nameInput");
const priceInput = document.getElementById("priceInput");

const itemsList = document.getElementById("itemsList");

const syncGetBtn = document.getElementById("syncGetBtn");
const syncPostBtn = document.getElementById("syncPostBtn");
const clearLocalBtn = document.getElementById("clearLocalBtn");

const statusMsg = document.getElementById("statusMsg");
const apiBaseLabel = document.getElementById("apiBaseLabel");

// Verificación de referencias (buena práctica de depuración)
console.log("DOM refs:", {
  itemForm, nameInput, priceInput, itemsList,
  syncGetBtn, syncPostBtn, clearLocalBtn, statusMsg
});

apiBaseLabel.textContent = apiUrl;

/* -----------------------------
   3) Utilidades (validación / UI / persistencia)
------------------------------ */

// Muestra mensajes en el DOM y en consola
function setStatus(message, type = "ok") {
  statusMsg.textContent = message;
  statusMsg.className = `status ${type === "err" ? "err" : "ok"}`;

  if (type === "err") console.error(message);
  else console.log(message);
}

// Convierte texto a número válido (o null)
function parsePrice(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// Valida el item capturado del usuario
function validateItemInput(name, price) {
  const trimmedName = String(name ?? "").trim();
  if (trimmedName.length === 0) {
    return { ok: false, error: "Name is required." };
  }

  if (price === null) {
    return { ok: false, error: "Price must be a valid number." };
  }

  if (price < 0) {
    return { ok: false, error: "Price must be >= 0." };
  }

  return { ok: true, data: { name: trimmedName, price } };
}

// Guarda items en Local Storage
function saveToLocalStorage() {
  localStorage.setItem(storageKey, JSON.stringify(items));
  console.log(`Local Storage saved. Count=${items.length}`);
}

// Carga items desde Local Storage
function loadFromLocalStorage() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Local Storage parse error:", err);
    return [];
  }
}

/* -----------------------------
   4) DOM rendering (appendChild / removeChild)
------------------------------ */

// Crea un <li> con botones Edit y Delete
function createListItem(item) {
  const li = document.createElement("li");
  li.dataset.id = String(item.id ?? ""); // id remoto si existe

  const text = document.createElement("span");
  text.className = "item-text";
  text.textContent = `${item.name} - $${item.price.toFixed(2)}`;

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.textContent = "Edit (PUT)";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";

  // Edit: pide datos por prompt (cumple "DOM o prompt()")
  editBtn.addEventListener("click", async () => {
    await handleEditItem(item.id);
  });

  // Delete: elimina del DOM/local y también intenta borrar en API
  deleteBtn.addEventListener("click", async () => {
    await handleDeleteItem(item.id);
  });

  li.appendChild(text);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}

// Renderiza la lista completa desde el arreglo items
function renderList() {
  // Limpia la lista actual
  itemsList.textContent = "";

  // Agrega cada elemento dinámicamente
  items.forEach((item) => {
    const li = createListItem(item);
    itemsList.appendChild(li); // Requisito: appendChild
  });

  console.log(`DOM rendered. Count=${items.length}`);
}

/* -----------------------------
   5) CRUD local (memoria + Local Storage + DOM)
------------------------------ */

// Genera un id local (cuando aún no hay id de API)
function generateLocalId() {
  // Id simple: timestamp + random
  return `local_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

// Agrega item localmente
function addLocalItem(name, price) {
  const newItem = {
    id: generateLocalId(), // id local (luego puede reemplazarse por id de API)
    name,
    price,
    synced: false // bandera para saber si ya se subió al servidor
  };

  items.push(newItem);
  saveToLocalStorage();
  renderList();

  setStatus(`Item added locally: ${newItem.name}`, "ok");
}

// Elimina item localmente por id
function removeLocalItemById(id) {
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return false;

  items.splice(index, 1);
  saveToLocalStorage();
  renderList();

  return true;
}

// Actualiza item localmente por id
function updateLocalItemById(id, patch) {
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return false;

  items[index] = { ...items[index], ...patch };
  saveToLocalStorage();
  renderList();

  return true;
}

/* -----------------------------
   6) Fetch API CRUD (async/await + try/catch)
------------------------------ */

// GET: trae lista desde API
async function apiGetItems() {
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`GET failed: ${res.status} ${res.statusText}`);
  return await res.json();
}

// POST: crea item en API
async function apiCreateItem(payload) {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`POST failed: ${res.status} ${res.statusText}`);
  return await res.json();
}

// PUT: actualiza item en API
async function apiUpdateItem(id, payload) {
  const res = await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`PUT failed: ${res.status} ${res.statusText}`);
  return await res.json();
}

// DELETE: elimina item en API
async function apiDeleteItem(id) {
  const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE failed: ${res.status} ${res.statusText}`);
  return true;
}

/* -----------------------------
   7) Handlers (conexión entre UI, local y API)
------------------------------ */

// Submit del formulario: captura, valida y agrega (TASK 2 y 3 y 4)
function handleFormSubmit(e) {
  e.preventDefault();

  const name = nameInput.value;
  const price = parsePrice(priceInput.value);

  const validation = validateItemInput(name, price);
  if (!validation.ok) {
    setStatus(validation.error, "err");
    return;
  }

  addLocalItem(validation.data.name, validation.data.price);

  // Limpia y enfoca
  nameInput.value = "";
  priceInput.value = "";
  nameInput.focus();

  console.log("Form submit handled.");
}

// Sync GET: API -> App (reemplaza items por lo del servidor)
async function handleSyncGet() {
  try {
    const serverItems = await apiGetItems();

    // Normaliza estructura esperada
    items = serverItems.map(it => ({
      id: String(it.id),
      name: String(it.name ?? ""),
      price: Number(it.price ?? 0),
      synced: true
    }));

    saveToLocalStorage();
    renderList();

    setStatus(`Synced from API (GET). Loaded ${items.length} items.`, "ok");
  } catch (err) {
    setStatus(`Sync GET error: ${err.message}`, "err");
  }
}

// Sync POST: App -> API (sube solo los no sincronizados)
async function handleSyncPost() {
  try {
    const pending = items.filter(i => i.synced === false);

    if (pending.length === 0) {
      setStatus("No pending local items to POST.", "ok");
      return;
    }

    // Sube en serie para simplificar evidencia en consola
    for (const localItem of pending) {
      const created = await apiCreateItem({ name: localItem.name, price: localItem.price });

      // Reemplaza id local por id del servidor y marca synced
      updateLocalItemById(localItem.id, {
        id: String(created.id),
        synced: true
      });
    }

    setStatus(`Synced to API (POST). Posted ${pending.length} items.`, "ok");
  } catch (err) {
    setStatus(`Sync POST error: ${err.message}`, "err");
  }
}

// Edit (PUT): usa prompt() para cambiar nombre/precio
async function handleEditItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const newName = prompt("New name:", item.name);
  if (newName === null) return; // cancel

  const newPriceRaw = prompt("New price:", String(item.price));
  if (newPriceRaw === null) return; // cancel

  const newPrice = parsePrice(newPriceRaw);
  const validation = validateItemInput(newName, newPrice);

  if (!validation.ok) {
    setStatus(validation.error, "err");
    return;
  }

  // Actualiza local siempre
  updateLocalItemById(id, { name: validation.data.name, price: validation.data.price });

  // Si está sincronizado (id del servidor), intenta PUT
  const isRemoteId = !String(id).startsWith("local_");

  if (!isRemoteId) {
    setStatus("Edited locally (not synced yet).", "ok");
    return;
  }

  try {
    const updated = await apiUpdateItem(id, {
      id: Number(id), // JSON Server suele usar id numérico
      name: validation.data.name,
      price: validation.data.price
    });

    console.log("PUT response:", updated);
    setStatus(`Updated on API (PUT): ${validation.data.name}`, "ok");
  } catch (err) {
    setStatus(`PUT error: ${err.message}`, "err");
  }
}

// Delete: elimina local y también intenta DELETE en API si aplica
async function handleDeleteItem(id) {
  // Elimina localmente primero (DOM se actualiza por renderList)
  const removedLocal = removeLocalItemById(id);

  if (!removedLocal) {
    setStatus("Item not found locally.", "err");
    return;
  }

  console.log(`Item deleted locally: ${id}`);

  // Si es id remoto, intenta borrarlo del servidor
  const isRemoteId = !String(id).startsWith("local_");
  if (!isRemoteId) {
    setStatus("Deleted locally (not on API).", "ok");
    return;
  }

  try {
    await apiDeleteItem(id);
    setStatus(`Deleted on API (DELETE): id=${id}`, "ok");
  } catch (err) {
    setStatus(`DELETE error: ${err.message}`, "err");
  }
}

// Clear Local: limpia memoria + Local Storage + DOM
function handleClearLocal() {
  items = [];
  saveToLocalStorage();
  renderList();
  setStatus("Local data cleared.", "ok");
}

/* -----------------------------
   8) Init
------------------------------ */

function init() {
  // Carga desde Local Storage al iniciar
  items = loadFromLocalStorage();
  renderList();
  console.log(`Loaded from Local Storage: Count=${items.length}`);

  // Eventos UI
  itemForm.addEventListener("submit", handleFormSubmit);
  syncGetBtn.addEventListener("click", handleSyncGet);
  syncPostBtn.addEventListener("click", handleSyncPost);
  clearLocalBtn.addEventListener("click", handleClearLocal);

  setStatus("App ready. Add items locally or sync with API.", "ok");
}

init();
