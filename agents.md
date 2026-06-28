# Agents

Instrucciones para agentes que trabajen en este proyecto.

## Objetivo

Colaborar sobre el codigo del proyecto manteniendo los cambios claros, pequenos y faciles de revisar.

## Antes de modificar

- Revisar los archivos relacionados con la tarea antes de editar.
- Respetar la estructura, nombres y estilo existentes.
- No reescribir partes grandes del proyecto si la tarea se puede resolver con un cambio puntual.
- No borrar ni revertir cambios existentes sin confirmacion explicita.
- Identificar si hay cambios previos del usuario y trabajar sobre ellos sin pisarlos.

## Desarrollo

- Preferir soluciones simples y legibles.
- Mantener las funciones con responsabilidades claras.
- Usar nombres descriptivos para variables, funciones y archivos.
- Evitar dependencias nuevas salvo que sean necesarias.
- Si se agrega una dependencia, explicar por que se necesita.
- Mantener los cambios enfocados en la tarea pedida.

## JavaScript

- Mantener el estilo actual del proyecto.
- Validar entradas antes de usarlas cuando puedan venir de usuarios, requests o archivos externos.
- Manejar errores de forma explicita, especialmente en codigo asincronico.
- Evitar duplicar logica si ya existe una utilidad equivalente en el proyecto.
- Preferir cambios pequenos en controladores, rutas y modelos antes que reorganizaciones grandes.

## Pruebas y verificacion

- Ejecutar los comandos disponibles del proyecto cuando sea posible, por ejemplo:

```bash
npm test
npm run lint
npm start
```

- Si un comando no existe o falla por configuracion local, dejar constancia del motivo.
- Verificar manualmente los flujos afectados cuando no haya tests automatizados.
- No dejar procesos de desarrollo corriendo sin avisar.

## Comunicacion

- Explicar brevemente que se cambio y por que.
- Mencionar archivos importantes modificados.
- Indicar cualquier riesgo, supuesto o paso pendiente.
- Responder en espanol cuando el usuario escriba en espanol.
