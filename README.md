# Creditos Mobile

Aplicación móvil de la prueba técnica para iniciar sesión, registrar créditos y consultarlos mediante filtros, ordenamiento, tabla y paginación.

## Stack

- Ionic React
- TypeScript
- Vite
- Capacitor
- Capacitor Preferences
- Vitest

## Requisitos

- Node.js 20+ (recomendado 22)
- npm
- Para Android: Java 21, Android Studio / Android SDK

## Instalación

```bash
npm install
```

Copie `.env.example` a `.env` y defina:

```text
VITE_API_URL=http://localhost:8080
```

## Ejecutar en navegador

```bash
npm run dev
```

La app abre en `http://localhost:8100`.

## Usuarios demo

Cuando el backend está en Development con demo users habilitados:

- `comercial1@demo.local` / `Demo1234!`
- `comercial2@demo.local` / `Demo1234!`

## Funcionalidad

- Login real contra `POST /api/auth/login`.
- JWT persistido con Capacitor Preferences.
- Logout automático ante HTTP 401.
- Registro de crédito con validación y comercial read-only desde sesión.
- Consulta con nombre, documento y comercial.
- Orden por fecha o valor, ascendente o descendente.
- Tabla real con scroll horizontal en pantallas pequeñas.
- Paginación conectada al backend.

## Build web

```bash
npm run build
```

Resultado: `dist/`.

## Tests

```bash
npm run test:run
```

Incluyen validación del formulario, persistencia de sesión y construcción de filtros/paginación.

## Capacitor Android

Primera vez:

```bash
npm run build
npx cap add android
./scripts/configure-android-debug-http.sh
npx cap sync android
```

El script habilita HTTP **solo en la variante debug**. No modifica la seguridad del release.

Para cambios posteriores:

```bash
npm run build
npx cap sync android
npx cap open android
```

### Android Emulator

Use en `.env`:

```text
VITE_API_URL=http://10.0.2.2:8080
```

Luego vuelva a ejecutar `npm run build` y `npx cap sync android`.

### Release

Use una API pública HTTPS en `VITE_API_URL`. No habilite cleartext HTTP en release.

## APK / AAB

Desde `android/`:

```bash
./gradlew assembleDebug
./gradlew assembleRelease
./gradlew bundleRelease
```

Ubicaciones habituales:

- APK debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- APK release: `android/app/build/outputs/apk/release/app-release.apk`
- AAB release: `android/app/build/outputs/bundle/release/app-release.aab`

Un release firmado requiere configurar un keystore local/CI. Nunca se versiona el keystore ni sus contraseñas.

## GitHub Actions

`.github/workflows/android-build.yml` prepara Android desde cero, ejecuta tests/build y genera un APK debug y un AAB release como artefactos del workflow.

## Problemas comunes

- `401`: la sesión expiró; la app vuelve a login.
- La API no responde en emulador: use `10.0.2.2`, no `localhost`.
- CORS: agregue `http://localhost:8100` al backend.
- Cambió código web pero Android no: ejecute `npm run build` y `npx cap sync android`.
- HTTP bloqueado en emulador: ejecute el script debug después de crear `android/`.
