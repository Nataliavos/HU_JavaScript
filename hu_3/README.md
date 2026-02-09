# HU_3 - Mini app de notas (DOM + Local Storage)

## Objetivo
Crear una mini-app que permita agregar y eliminar notas en el DOM y persistir los datos con Local Storage.

## Estructura
- `manipulacion_dom.html`: interfaz mínima (título, input, botón, lista).
- `app.js`: lógica DOM + Local Storage.
- `README.md`: guía y evidencias.

## Cómo ejecutar
1. Abre `manipulacion_dom.html` en el navegador.
2. Abre DevTools -> Console para ver evidencias.
3. Agrega y elimina notas.
4. Recarga la página y verifica persistencia.

> Si el navegador bloquea Local Storage cuando abres el archivo como `file://`,
> usa un servidor local (por ejemplo Live Server o cualquier servidor simple).

## Evidencias solicitadas (capturas)
1. DOM antes y después de:
   - Agregar una nota (la lista `<ul>` con un `<li>` nuevo).
   - Eliminar una nota (el `<li>` desaparece).
2. Consola mostrando:
   - Referencias a elementos (DOM refs)
   - "Note added"
   - "Note deleted"
   - "Saved notes"
   - "Loaded notes from storage"
3. Local Storage en Application:
   - Key `notas` con el arreglo en JSON.

## Criterios de aceptación (checklist)
- [x] Se agregan elementos con `appendChild`.
- [x] Se eliminan notas y se re-renderiza la lista.
- [x] Se usan al menos dos métodos de selección: `getElementById` y `querySelector`.
- [x] Se usa `textContent`.
- [x] Persistencia con `localStorage.setItem/getItem` y `JSON.stringify/parse`.
- [x] Logs en consola para evidenciar acciones.
- [x] Uso de `let/const` y código comentado.
