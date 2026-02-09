/*
  Historia de usuario (Semana 2)
  Gestión de datos con Objects, Set y Map

  Requisitos:
  - Catálogo de productos (Object)
  - Categorías únicas (Set)
  - Stock por id (Map)
  - CRUD (crear, leer, actualizar, eliminar)
  - Bucles y métodos: for...in, for...of, forEach, Object.keys/values/entries
  - Validaciones básicas
*/

/* -----------------------------
   1) Data structures
------------------------------ */

// Catálogo: id -> product
const productCatalog = {
  p001: { id: "p001", name: "Coffee", price: 12000, category: "beverages", active: true },
  p002: { id: "p002", name: "Bread", price: 4000, category: "food", active: true }
};

// Categorías únicas
const categorySet = new Set();

// Stock por id: id -> number
const stockById = new Map();

/* -----------------------------
   2) Utilities and validations
------------------------------ */

// Normaliza texto para comparaciones consistentes
function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

// Valida id tipo p001
function isValidId(id) {
  return /^p\d{3}$/.test(id);
}

// Valida producto y retorna versión "limpia"
function validateProduct(product) {
  if (typeof product !== "object" || product === null) {
    return { ok: false, error: "Invalid product object" };
  }

  const id = String(product.id ?? "").trim();
  const name = String(product.name ?? "").trim();
  const category = String(product.category ?? "").trim();
  const price = Number(product.price);

  if (!isValidId(id)) return { ok: false, error: "Id must follow p001 format" };
  if (name.length < 2) return { ok: false, error: "Name must have at least 2 characters" };
  if (category.length < 2) return { ok: false, error: "Category must have at least 2 characters" };
  if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "Price must be a number > 0" };

  // active es opcional; si no viene, se asume true
  const active = product.active === undefined ? true : Boolean(product.active);

  return { ok: true, data: { id, name, category, price, active } };
}

// Reconstruye categorías desde el catálogo
function refreshCategories() {
  categorySet.clear();
  for (const id in productCatalog) {
    categorySet.add(normalizeText(productCatalog[id].category));
  }
}

// Inicializa stock=0 si falta en el Map
function initStockIfMissing() {
  for (const id in productCatalog) {
    if (!stockById.has(id)) stockById.set(id, 0);
  }
}

/* -----------------------------
   3) Product CRUD
------------------------------ */

function createProduct(product, initialStock = 0) {
  const validation = validateProduct(product);
  if (!validation.ok) return { ok: false, error: validation.error };

  const { id } = validation.data;
  if (productCatalog[id]) return { ok: false, error: `Product with id ${id} already exists` };

  productCatalog[id] = validation.data;

  // Mantiene Set y Map sincronizados
  categorySet.add(normalizeText(validation.data.category));

  const stock = Number(initialStock);
  stockById.set(id, Number.isFinite(stock) && stock >= 0 ? stock : 0);

  return { ok: true, data: productCatalog[id] };
}

function getProductById(id) {
  const key = String(id ?? "").trim();
  if (!productCatalog[key]) return { ok: false, error: `Product ${key} not found` };

  return { ok: true, data: { ...productCatalog[key], stock: stockById.get(key) ?? 0 } };
}

function listProducts({ onlyActive = false, category = "" } = {}) {
  const categoryFilter = normalizeText(category);

  const list = Object.values(productCatalog)
    .filter(p => (onlyActive ? p.active === true : true))
    .filter(p => (categoryFilter ? normalizeText(p.category) === categoryFilter : true))
    .map(p => ({ ...p, stock: stockById.get(p.id) ?? 0 }));

  return { ok: true, data: list };
}

function updateProduct(id, changes) {
  const key = String(id ?? "").trim();
  if (!productCatalog[key]) return { ok: false, error: `Product ${key} not found` };

  // Mezcla producto + cambios, preservando id
  const candidate = { ...productCatalog[key], ...(changes ?? {}), id: key };

  const validation = validateProduct(candidate);
  if (!validation.ok) return { ok: false, error: validation.error };

  const oldCategory = normalizeText(productCatalog[key].category);

  productCatalog[key] = validation.data;

  const newCategory = normalizeText(productCatalog[key].category);
  if (oldCategory !== newCategory) refreshCategories();

  return { ok: true, data: productCatalog[key] };
}

function deleteProduct(id) {
  const key = String(id ?? "").trim();
  if (!productCatalog[key]) return { ok: false, error: `Product ${key} not found` };

  delete productCatalog[key];
  stockById.delete(key);

  // Recalcula categorías para evitar categorías huérfanas
  refreshCategories();

  return { ok: true };
}

/* -----------------------------
   4) Stock operations (Map)
------------------------------ */

function adjustStock(id, delta) {
  const key = String(id ?? "").trim();
  if (!productCatalog[key]) return { ok: false, error: `Product ${key} not found` };

  const d = Number(delta);
  if (!Number.isFinite(d)) return { ok: false, error: "Invalid stock delta" };

  const current = stockById.get(key) ?? 0;
  const next = current + d;

  if (next < 0) return { ok: false, error: "Negative stock is not allowed" };

  stockById.set(key, next);
  return { ok: true, data: { id: key, stock: next } };
}

function setStock(id, amount) {
  const key = String(id ?? "").trim();
  if (!productCatalog[key]) return { ok: false, error: `Product ${key} not found` };

  const a = Number(amount);
  if (!Number.isFinite(a) || a < 0) return { ok: false, error: "Invalid stock amount" };

  stockById.set(key, a);
  return { ok: true, data: { id: key, stock: a } };
}

/* -----------------------------
   5) Reports (loops and methods)
------------------------------ */

function printIds() {
  console.log("IDs:", Object.keys(productCatalog));
}

function printProductsForIn() {
  console.log("Products (for...in):");
  for (const id in productCatalog) {
    const p = productCatalog[id];
    const stock = stockById.get(id) ?? 0;
    console.log(`- ${id}: ${p.name} ($${p.price}) [${p.category}] active=${p.active} stock=${stock}`);
  }
}

function printProductsEntries() {
  console.log("Products (Object.entries + for...of):");
  for (const [id, p] of Object.entries(productCatalog)) {
    const stock = stockById.get(id) ?? 0;
    console.log(`- ${id}: ${p.name} stock=${stock}`);
  }
}

function printCategories() {
  console.log("Categories (Set):");
  categorySet.forEach(cat => console.log(`- ${cat}`));
}

function printStock() {
  console.log("Stock (Map):");
  for (const [id, qty] of stockById) {
    console.log(`- ${id}: ${qty}`);
  }
}

/* -----------------------------
   6) Demo usage
------------------------------ */

refreshCategories();
initStockIfMissing();

console.log("\nCreate new products:");
console.log(createProduct({ id: "p003", name: "Milk", price: 5500, category: "food" }, 10));
console.log(createProduct({ id: "p004", name: "Water", price: 3000, category: "beverages" }, 25));

console.log("\nStock updates:");
console.log(adjustStock("p003", 5));
console.log(adjustStock("p004", -10));

console.log("\nUpdate product:");
console.log(updateProduct("p002", { price: 4500, category: "bakery" }));

console.log("\nGet product p004:");
console.log(getProductById("p004"));

console.log("\nList only beverages:");
console.log(listProducts({ category: "beverages" }));

console.log("\nDelete p001:");
console.log(deleteProduct("p001"));

console.log("\nReports:");
printIds();
printProductsForIn();
printProductsEntries();
printCategories();
printStock();
