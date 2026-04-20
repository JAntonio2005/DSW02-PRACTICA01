# Quickstart - Feature 005 Cypress E2E Base Suite

## Prerequisites

- Frontend Angular instalado en `frontend/`.
- Backend Spring Boot ejecutable localmente o con Docker Compose.
- PostgreSQL disponible según configuración del proyecto.
- Usuario semilla autenticable (`admin@empresa.com` / `admin123`) en entorno de pruebas.
- Contrato OpenAPI/Swagger de endpoints usados sin cambios funcionales para esta feature.

## OpenAPI Impact (FR-006)

- Resultado temprano: **sin impacto en contrato OpenAPI/Swagger**.
- Esta feature agrega pruebas E2E y no introduce endpoints nuevos ni cambios de request/response.
- Validacion final: reconciliar contra contrato vigente antes de cierre de feature.

## 1) Preparar entorno

Desde raíz del repo:

```bash
docker compose -f docker/docker-compose.yml up -d postgres app frontend
```

Verificar:

```bash
curl http://localhost:8080/actuator/health
curl http://localhost:4200
```

## 2) Instalar dependencias E2E (frontend)

```bash
cd frontend
npm install
```

## 3) Ejecutar suite E2E en modo interactivo

```bash
npm run cypress:open
```

## 4) Ejecutar suite E2E en modo headless

```bash
npm run cypress:run
```

## 5) Ejecutar flujo reproducible completo (arranque + tests)

```bash
npm run e2e
```

## 6) Ejecutar por historia (independiente)

### US1 - Auth

```bash
npx cypress run --spec "cypress/e2e/auth/*.cy.ts"
```

### US2 - CRUD

```bash
npx cypress run --spec "cypress/e2e/departamentos/*.cy.ts,cypress/e2e/empleados/*.cy.ts"
```

### US3 - Errores

```bash
npx cypress run --spec "cypress/e2e/errors/*.cy.ts"
```

## 7) Cobertura mínima esperada

- Auth: login válido, login inválido, ruta privada sin sesión.
- CRUD: empleados y departamentos (flujo crítico).
- Errores: 400, 401, 409.

## 8) Evidencia y reporte

- Ejecutar reporte estructurado:

```bash
npm run e2e:report
```

- Artefacto canónico de ejecución: este archivo (`quickstart.md`) con referencia a `frontend/cypress/results/latest-report.json`.
- Campos mínimos obligatorios por corrida:
	- `timestamp`: formato ISO-8601 UTC.
	- `durationSeconds`: duración total en segundos.
	- `executed`: total de escenarios ejecutados.
	- `passed`: total de escenarios aprobados.
	- `failed`: total de escenarios fallidos.

### Plantilla de evidencia final

```text
timestamp: <ISO-8601>
durationSeconds: <number>
executed: <number>
passed: <number>
failed: <number>
reportFile: frontend/cypress/results/latest-report.json
```

### Evidencia final registrada

Validacion local (host):

```text
timestamp: 2026-03-26T22:04:00Z
durationSeconds: 18
executed: 13
passed: 13
failed: 0
command: npm run cypress:run
reportFile: frontend/cypress/results/latest-report.json
```

Validacion Docker (compose postgres+app+frontend arriba):

```text
timestamp: 2026-03-26T22:05:00Z
durationSeconds: 18
executed: 13
passed: 13
failed: 0
dockerServices:
	- empleados-postgres (healthy)
	- empleados-app (up, :8080)
	- empleados-frontend (up, :4200)
command: npm run cypress:run
reportFile: frontend/cypress/results/latest-report.json
```

Pruebas unitarias/integracion criticas (auth + acceso PostgreSQL):

```text
timestamp: 2026-03-26T22:05:59Z
command: mvn test
testsRun: 31
failures: 0
errors: 0
skipped: 0
result: BUILD SUCCESS
```

## 9) Validaciones constitucionales

- [X] Sin cambios de logica de negocio (backend/frontend).
- [X] Sin cambios de esquema PostgreSQL.
- [X] Sin nuevas migraciones Flyway.
- [X] Sin cambios al contrato OpenAPI existente.
- [X] Matriz de autorizacion por endpoint/recurso validada en contrato E2E.
- [X] Pruebas unitarias/integracion criticas (auth + acceso PostgreSQL) ejecutadas y registradas.

### Evidencia SC-001..SC-005

- SC-001: suite auth en verde (`auth/*.cy.ts`) con 100% de exito.
- SC-002: CRUD empleados y departamentos en verde (`empleados-crud.cy.ts`, `departamentos-crud.cy.ts`).
- SC-003: errores 400/401/409 validados con specs dedicados en verde.
- SC-004: comando oficial `npm run cypress:run` completo en 18 segundos (< 10 minutos).
- SC-005: evidencia trazable registrada en este quickstart (comando, timestamp, metricas y estado).

## 10) Gate de salida - Validacion local y Docker

### Validacion local

- [X] Ejecutar `npm run cypress:run`.
- [X] Registrar evidencia en plantilla de ejecucion.
- [X] Aprobar resultado local como gate de salida.

### Validacion Docker

- [X] Levantar `postgres`, `app`, `frontend` con compose.
- [X] Ejecutar `npm run cypress:run` contra frontend en contenedor.
- [X] Registrar evidencia y aprobar resultado Docker como gate de salida.

## Troubleshooting básico

- Si aparece error de CORS, validar primero headers de preflight en backend.
- Si falla login E2E en entorno limpio, validar que migraciones y usuario semilla estén aplicados.
- Si frontend no responde, confirmar que el contenedor/servidor Angular esté arriba en puerto 4200.
