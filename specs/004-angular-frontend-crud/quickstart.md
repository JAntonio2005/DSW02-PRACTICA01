# Quickstart - Frontend Angular CRUD

## Prerrequisitos

- Node.js LTS y npm instalados.
- Docker y Docker Compose disponibles para levantar backend + PostgreSQL localmente.
- Backend del proyecto accesible en `http://localhost:8080` (levantado preferentemente vía Docker para validación de cierre).
- Endpoints disponibles:
  - `POST /api/auth/login`
  - `/api/v2/empleados`
  - `/api/v2/departamentos`

## 1) Crear frontend Angular

Desde la raíz del repositorio:

```bash
cd frontend
npm install
```

> Si el proyecto Angular aún no está scaffolded, generarlo en `frontend/` con Angular CLI usando la versión requerida por asignatura.

## 2) Configurar URL base API

En `frontend/src/environments/environment.ts`:

- `apiBaseUrl = 'http://localhost:8080'`

## 3) Ejecutar frontend en desarrollo

```bash
cd frontend
npm start
```

Abrir en navegador: `http://localhost:4200`.

## 4) Levantar backend + PostgreSQL en Docker (obligatorio antes de merge)

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

Verificar disponibilidad del backend (health o endpoint equivalente):

```bash
curl http://localhost:8080/actuator/health
```

> Si el proyecto no expone `actuator`, validar disponibilidad con `POST /api/auth/login`.

## 5) Flujo mínimo de validación manual (smoke E2E)

1. Ir a `/login`.
2. Iniciar sesión con credenciales válidas del backend (`/api/auth/login`).
3. Verificar acceso a rutas protegidas `/empleados` y `/departamentos`.
4. Verificar paginación en listados de empleados y departamentos.
5. Ejecutar CRUD de departamentos (crear, editar, eliminar cuando no tenga asociados).
6. Ejecutar CRUD de empleados (crear, editar, eliminar) usando `departamentoClave` obligatorio.
7. Intentar eliminar departamento con empleados asociados y validar respuesta/mensaje `409`.
8. Forzar token inválido/expirado y validar limpieza de sesión + redirección a `/login` por `401`.

## 6) Pruebas recomendadas

```bash
cd frontend
npm run lint
npm test -- --watch=false --browsers=ChromeHeadless
npm run test:e2e-critical
```

`test:e2e-critical` ejecuta flujos críticos de auth + navegación protegida + CRUD de departamentos + CRUD de empleados desde `src/app/e2e-critical-flows.spec.ts`.

Para validación puntual de redirección/limpieza por `401`:

```bash
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless --include=tests/e2e/auth-guard.e2e.ts --include=src/app/core/http/jwt.interceptor.spec.ts
```

## 7) Validación métrica de rendimiento (<3s)

- Levantar frontend:

```bash
cd frontend
npm start
```

- Medir en PowerShell:

```powershell
1..3 | % { Measure-Command { Invoke-WebRequest -Uri 'http://localhost:4200' -UseBasicParsing | Out-Null } }
```

- Criterio: tiempo de primera carga funcional menor a 3 segundos en entorno local.

## 8) Evidencia mínima a documentar

- Evidencia de Docker arriba (comando `up` + backend disponible).
- Evidencia de login y acceso a rutas protegidas.
- Evidencia de CRUD de empleados y departamentos.
- Evidencia de manejo de `400`, `401`, `409`.
- Evidencia de validación de paginación en ambos módulos.
- Evidencia de métrica de primera carga (<3s).

---

## 9) Evidencia ejecutada (2026-03-19)

### Checklist guiado en navegador (T058)

Estado: **ejecución guiada iniciada, validación manual visual pendiente de confirmación**.

- Rutas abiertas en navegador durante sesión de validación:
  - `http://localhost:4200/login`
  - `http://localhost:4200/empleados`
  - `http://localhost:4200/departamentos`
- Limitación de herramienta en esta sesión: el agente puede abrir páginas, pero no inspeccionar/interactuar el DOM del navegador porque `workbench.browser.enableChatTools` no está habilitado.
- Por trazabilidad, se ejecutó evidencia runtime de soporte contra backend local (`8080`) en paralelo al checklist:
  - Login con `admin@empresa.com` / `admin123` → **OK**.
  - CRUD mínimo departamentos (crear/listar/eliminar) → **OK**.
  - CRUD mínimo empleados (crear/listar/eliminar) → **OK**.
- Conclusión de T058: **no se marca como completada** hasta confirmar visualmente en navegador la redirección por expiración/token inválido (criterio manual explícito de la tarea).

### Frontend (validaciones completadas)

- `npm run lint` → **SUCCESS** (sin errores).
- `npm test -- --watch=false --browsers=ChromeHeadless` → **TOTAL: 35 SUCCESS**.
- `npm run test:e2e-critical` → **TOTAL: 10 SUCCESS** (auth/login/guard + CRUD departamentos + CRUD empleados).
- `npm test -- --watch=false --browsers=ChromeHeadless --include=tests/e2e/auth-guard.e2e.ts --include=src/app/core/http/jwt.interceptor.spec.ts` → **TOTAL: 3 SUCCESS** (redirección por ruta protegida y limpieza/redirect por `401`).
- Verificación de consumo exclusivo de API frontend (`src/app`) → solo `'/api/auth/login'`, `'/api/v2/empleados'`, `'/api/v2/departamentos'` en `src/app/core/config/api.config.ts`; sin referencias `v1/v3`.

### Smoke Docker backend + DB (bloqueo encontrado)

Comandos ejecutados:

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

Resultado:

- Se detectó y resolvió bloqueo de build Docker por contexto (`.dockerignore` excluía `target/*.jar`).
- Backend y PostgreSQL levantan en Docker tras compilar jar con `./mvnw -DskipTests package`.
- **Bloqueo funcional de login en entorno Docker limpio**: `POST /api/auth/login` devuelve error porque no se aplica la migración de seed admin (`V3_seed_admin_log.sql` no sigue convención Flyway `V<version>__<description>.sql`, por lo que no se ejecuta en el arranque).
- Estado smoke Docker E2E: **parcial / bloqueado** (infra arriba, flujo login/CRUD no verificable sin seed válido).
- Alcance: este bloqueo proviene de bootstrap seed del backend/Flyway en Docker limpio y **queda fuera del alcance frontend** de la feature 004.
- Consecuencia en tracking: **T060 y T063 permanecen pendientes/bloqueadas** hasta resolver el seed backend en un alcance distinto.

### Métrica de primera carga (<3s)

Medición local con `npm start` + `Invoke-WebRequest http://localhost:4200`:

- Run 1: **64.51 ms**
- Run 2: **15.78 ms**
- Run 3: **18.14 ms**

Resultado: **cumple** criterio `<3s` en entorno local.
