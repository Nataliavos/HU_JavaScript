# Historia de usuario - Semana 2 (JavaScript)
Gestión de datos con **Object**, **Set** y **Map**.

## Objetivo
Implementar un sistema simple para gestionar productos:
- Catálogo con Object (id -> producto)
- Categorías únicas con Set
- Stock por id con Map
- CRUD de productos (Create, Read, Update, Delete)
- Uso de bucles y métodos: for...in, for...of, forEach, Object.keys/values/entries
- Validaciones básicas

## Estructura del proyecto

gestion-datos/
├─ gestion_datos.js
└─ README.md



## Archivos
- `index.html`: carga el script del proyecto.
- `src/gestion_datos.js`: lógica completa (catálogo, categorías, stock, CRUD, reportes).
- `README.md`: documentación de la entrega.

## Estructuras de datos
- `productCatalog` (Object): almacena productos por id.
- `categorySet` (Set): guarda categorías únicas (sin duplicados).
- `stockById` (Map): asocia cada id con su stock.

## Funciones principales
### Utilidades y validación
- `normalizeText(value)`
- `isValidId(id)`
- `validateProduct(product)`
- `refreshCategories()`
- `initStockIfMissing()`

### CRUD de productos
- `createProduct(product, initialStock)`
- `getProductById(id)`
- `listProducts({ onlyActive, category })`
- `updateProduct(id, changes)`
- `deleteProduct(id)`

### Stock
- `adjustStock(id, delta)`
- `setStock(id, amount)`

### Reportes
- `printIds()` usa `Object.keys()`
- `printProductsForIn()` usa `for...in`
- `printProductsEntries()` usa `Object.entries()` + `for...of`
- `printCategories()` usa `Set.forEach()`
- `printStock()` usa `for...of` en `Map`

## Cómo ejecutar
### En navegador
1. Abre `index.html` (doble clic).
2. Abre la consola del navegador (F12 -> Console).
3. Verás la salida del demo con los resultados de CRUD y reportes.

## Notas
- Los ids deben cumplir formato `p001`.
- `price` debe ser número mayor a 0.
- `name` y `category` deben tener mínimo 2 caracteres.
- El stock no puede ser negativo.
