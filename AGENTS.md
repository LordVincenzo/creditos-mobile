# AGENTS.md - Creditos Mobile

## Objetivo
Mantener una app Ionic pequeña, clara y demostrable para autenticación, registro y consulta de créditos.

## Reglas que no se deben romper
- Ionic React + TypeScript + Capacitor.
- La API se configura con `VITE_API_URL`.
- Nunca imprimir el JWT en logs.
- El comercial mostrado en registro proviene de la sesión y es read-only.
- El backend sigue siendo la autoridad de validación y de identidad comercial.
- Mantener una tabla HTML real para la consulta de créditos.
- Usar paginación del backend, no descargar todos los créditos.
- HTTP local solo se permite en Android debug; release debe usar HTTPS.
- Nunca versionar keystores o secretos.

## Estructura
- `src/pages`: login, registro y consulta.
- `src/components`: tabs, tabla y paginación.
- `src/context`: sesión/autenticación.
- `src/services`: API, storage y créditos.
- `src/models`: contratos TypeScript.
- `src/validation`: reglas del formulario.
- `src/utils`: formatos de fecha/dinero.
- `scripts`: configuración Android debug.

## Comandos
```bash
npm install
npm run dev
npm run build
npm run test:run
npm run lint
npx cap add android
npx cap sync android
npx cap open android
```

## Seguridad
- No guardar token en consola.
- Limpiar sesión ante 401 o expiración.
- No confiar en el nombre del comercial enviado por UI.
- Release Android apunta a HTTPS.

## Testing
Antes de una entrega: validación, auth storage, query params, build TypeScript/Vite y sync Android.

## Criterio de aceptación
Login, formulario, tabla, filtros, orden, paginación, logout, Capacitor config, Android sync/build y README deben mantenerse funcionando.
