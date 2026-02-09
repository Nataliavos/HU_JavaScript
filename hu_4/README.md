# HU_4 - Mini Web App (DOM + Local Storage + Fetch API)

## Objetivo
Aplicación web que integra:
- Captura de datos del usuario (form + prompt)
- Validación y mensajes dinámicos
- Manipulación del DOM (appendChild / removeChild mediante re-render)
- Persistencia con Local Storage
- Consumo de API con Fetch (GET/POST/PUT/DELETE)
- Manejo de errores con try/catch y async/await

## Estructura
hu_4/
├─ index.html
├─ app.js
└─ README.md


## Requisitos
- Navegador
- JSON Server (para API local)

## Configurar JSON Server
1. Crear carpeta `api/` (en cualquier lugar) y dentro un archivo `db.json`:
```json
{
  "items": []
}

Instalar JSON Server (global o por proyecto):

Global:
npm i -g json-server

Ejecutar JSON Server:
json-server --watch db.json --port 3000

La API quedará en:

GET http://localhost:3000/items
POST http://localhost:3000/items
PUT http://localhost:3000/items/:id
DELETE http://localhost:3000/items/:id