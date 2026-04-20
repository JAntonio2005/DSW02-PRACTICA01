# Quickstart - Feature 006 Nginx Reverse Proxy Compose

## Objetivo

Integrar Nginx como reverse proxy en Docker Compose, dejando a Nginx como unico punto de entrada al host y manteniendo `frontend`, `app` y `postgres` en red interna.

## Prerequisitos

- Docker Desktop activo.
- Imagen backend construible desde `Dockerfile` raiz.
- Imagen frontend construible desde `frontend/Dockerfile`.
- PowerShell 5+ para scripts de validacion en `scripts/qa`.

## Ejecucion estandar

Desde la raiz del repo:

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

## Verificacion de servicios

```bash
docker compose -f docker/docker-compose.yml ps
```

Resultado esperado:

- `nginx` expuesto al host.
- `app`, `frontend`, `postgres` sin publicacion directa al host.

Validacion rapida de puertos publicados (solo `80`):

```bash
docker compose -f docker/docker-compose.yml ps --format json
```

## Validacion funcional minima

1. Abrir URL publica del proxy (ej. `http://localhost`).
2. Confirmar carga del frontend desde el proxy.
3. Confirmar llamadas API a traves de `/api` desde el mismo dominio.
4. Confirmar que no se requiere acceso directo a `:4200` o `:8080` en host.

Checks manuales sugeridos:

```bash
curl -i http://localhost/
curl -i -X POST http://localhost/api/auth/login -H "Content-Type: application/json" -d '{"correo":"admin@empresa.com","password":"admin123"}'
```

Resultado esperado:

- `/` responde con frontend.
- `/api/*` responde desde backend (codigo acorde a credenciales/estado, pero sin 502/504).
- `app` y `frontend` no aparecen con puertos publicados al host en `docker compose ps --format json`.

## Validacion de enrutamiento (US2)

1. Precedencia `/api` sobre `/`:
	- Ejecutar `curl -i -X POST http://localhost/api/auth/login -H "Content-Type: application/json" -d '{"correo":"admin@empresa.com","password":"admin123"}'`.
	- Resultado esperado: respuesta backend (ej. `401` con credenciales invalidas o estado auth equivalente), nunca respuesta de frontend.
2. Ruta invalida:
	- Ejecutar `curl -i http://localhost/api/no-existe`.
	- Resultado esperado: error coherente del backend (4xx) sin fallback a frontend.

## Validacion de red (host vs interna)

- Host -> Solo `nginx`.
- Nginx (interna) -> `frontend:4200`.
- Nginx (interna) -> `app:8080`.
- App (interna) -> `postgres:5432`.

## Validacion de seguridad frontend (guards + errores 400/401/409)

1. Intentar navegar a ruta privada sin token y validar redireccion/guard esperado.
2. Ejecutar login invalido y validar manejo UI de `401`.
3. Ejecutar caso de validacion de negocio que produzca `400` y verificar mensaje UI.
4. Ejecutar caso de conflicto que produzca `409` y verificar mensaje UI consistente.

Resultado esperado:

- Guards siguen activos bajo acceso via `http://localhost`.
- El frontend mantiene mapeo UI para `400`, `401` y `409` sin regresion visible.

## SC-002 - Validacion automatizada repetible

Script:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/qa/nginx-proxy-sc002.ps1 -Iterations 20
```

Salida esperada:

- Archivo `specs/006-nginx-proxy-compose/evidence/sc-002-results.json` generado.
- Tasa de exito >= 95% sobre 20 iteraciones.

## SC-003 - Medicion reproducible de arranque

Script:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/qa/nginx-proxy-sc003.ps1 -Runs 3
```

Salida esperada:

- Archivo `specs/006-nginx-proxy-compose/evidence/sc-003-timing.json` generado.
- Todas las corridas <= 300 segundos.

## Troubleshooting operativo

- Si `/` o `/api` devuelve `502`, revisar estado de upstreams con `docker compose -f docker/docker-compose.yml ps`.
- Si el proxy no aplica rutas, validar montaje de `docker/nginx/default.conf` en el servicio `nginx`.
- Si `app` o `frontend` aparecen publicados al host, revisar `ports` en compose y mantener solo `nginx` con `80:80`.
- Si SC-002 falla, ejecutar nuevamente con stack limpio: `docker compose -f docker/docker-compose.yml down` y luego `up -d --build`.
- Si SC-003 excede umbral, revisar tiempos de build local (cache de imagenes y rendimiento de disco).

## Evidencia registrada (ultima ejecucion)

- `docker compose -f docker/docker-compose.yml ps`: `nginx` publicado como `0.0.0.0:80->80/tcp`; `app`, `frontend`, `postgres` solo puertos internos.
- Validacion de rutas:
	- `GET /` -> `200`
	- `POST /api/auth/login` -> `401` (backend alcanzado via proxy)
- SC-002 automatizado:
	- Archivo: `specs/006-nginx-proxy-compose/evidence/sc-002-results.json`
	- Resultado: `successRate=100`, `passed=true`.
- SC-003 automatizado:
	- Archivo: `specs/006-nginx-proxy-compose/evidence/sc-003-timing.json`
	- Resultado: `runs=3`, max `elapsedSeconds=30.22`, `passed=true`.

## Resumen de cumplimiento SC-001..SC-005

- SC-001: **PASS** (entrypoint unico validado y disponibilidad estable en corridas automatizadas).
- SC-002: **PASS** (20/20 exitos, 100% >= 95%).
- SC-003: **PASS** (3 corridas, todas <= 300s).
- SC-004: **PASS** (regresion backend ejecutada con pruebas de auth/flujo principal sin fallos).
- SC-005: **PASS** (flujo quickstart reproducible con evidencia y checklist de troubleshooting).

## Evidencia sugerida para cierre

```text
timestamp: <ISO-8601>
composeUp: success
entrypointHost: <url publica>
frontendViaProxy: pass
apiViaProxy: pass
directAppHostAccess: blocked/not-published
directFrontendHostAccess: blocked/not-published
guardsValidation: pass
ui400Mapping: pass
ui401Mapping: pass
ui409Mapping: pass
sc002Evidence: specs/006-nginx-proxy-compose/evidence/sc-002-results.json
sc003Evidence: specs/006-nginx-proxy-compose/evidence/sc-003-timing.json
```

## Impacto esperado

- Logica de negocio: sin cambios.
- OpenAPI/Swagger: sin cambios de contrato.
- PostgreSQL/Flyway: sin cambios.
