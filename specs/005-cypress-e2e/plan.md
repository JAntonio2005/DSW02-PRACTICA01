# Implementation Plan: Feature 005 - Cypress E2E Base Suite

**Branch**: `[005-cypress-e2e]` | **Date**: 2026-03-26 | **Spec**: [specs/005-cypress-e2e/spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-cypress-e2e/spec.md`

## Summary

Implementar una suite E2E con Cypress para frontend Angular que cubra autenticación, rutas protegidas, flujos CRUD críticos de empleados/departamentos, paginación y manejo de errores 400/401/409, con ejecución reproducible local/CI y evidencia de resultados.

## Explicit Constitutional Compliance Statement

- Esta feature NO introduce cambios de logica de negocio en backend ni frontend; solo agrega y organiza pruebas E2E y documentacion de ejecucion.
- Esta feature NO introduce cambios de esquema PostgreSQL.
- Esta feature NO requiere nuevas migraciones Flyway.
- Esta feature NO modifica el contrato OpenAPI/Swagger existente; los escenarios E2E se ejecutan sobre endpoints ya publicados.
- El plan MUST incluir validacion local y validacion en Docker antes de marcar la feature como lista para implementacion completa.

## Technical Context

**Language/Version**: TypeScript (Angular 20) + Java 17 (backend existente)  
**Primary Dependencies**: Cypress, start-server-and-test, Angular CLI, Spring Boot 3.x  
**Storage**: PostgreSQL (sin cambios de modelo para esta feature)  
**Testing**: Cypress E2E; coexistencia con Jasmine/Karma actuales  
**Target Platform**: Web SPA en navegador Chrome/Electron para ejecución local y CI  
**Project Type**: Web application (frontend Angular + backend Spring Boot)  
**Performance Goals**: Suite crítica E2E ejecutable en <10 minutos en máquina de desarrollo estándar  
**Constraints**: No cambiar lógica de negocio existente; usar únicamente API oficial `/api/auth/login` y `/api/v2/**`; pruebas reproducibles con Docker/local  
**Scale/Scope**: 1 suite base con escenarios críticos de auth, CRUD empleados/departamentos y errores 400/401/409

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Stack gate: Solution uses Spring Boot 3.x + Java 17 (or includes approved amendment).
- [x] Security gate: Authentication/authorization strategy is explicit for all non-public APIs.
- [x] Data gate: PostgreSQL is primary datastore and schema migration plan is defined.
- [x] Container gate: Dockerfile and local container orchestration approach are defined.
- [x] API contract gate: OpenAPI/Swagger documentation update is planned with implementation.
- [x] Quality gate: Tests and compliance checks include auth, data access, and error paths.
- [x] Frontend gate (if applicable): Web client uses Angular version required by the assignment/practice.
- [x] Frontend security gate (if applicable): Frontend consumes only official backend API, handles JWT, protects private routes with guards, and maps backend 400/401/409 errors in UI.

## Project Structure

### Documentation (this feature)

```text
specs/005-cypress-e2e/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   ├── environments/
│   └── ...
├── tests/
└── cypress/                # nuevo para esta feature

src/
├── main/java/com/dsw02/practica01/
└── test/java/com/dsw02/practica01/

docker/
└── docker-compose.yml
```

**Structure Decision**: Se mantiene la arquitectura actual (backend Spring Boot + frontend Angular) y se agrega Cypress en `frontend/cypress/` con configuración y scripts de ejecución reproducible.

## Phase 0 - Research Summary

- Cypress será el framework E2E estándar para frontend por cobertura de rutas reales y debugging visual.
- El arranque de entorno para E2E se hará con `start-server-and-test` para asegurar orden correcto de servicios y reducir fallos por timing.
- La suite base se enfocará en escenarios críticos de negocio; pruebas de detalle fino permanecerán en unit/integration existentes.

## Phase 1 - Technical Design Plan

### Estructura de Cypress

1. Configuración central (`cypress.config.ts`) con `baseUrl` del frontend y timeouts razonables.
2. Organización de specs por dominio:
   - `auth.cy.ts`
   - `empleados.cy.ts`
   - `departamentos.cy.ts`
   - `errors.cy.ts`
3. Comandos reutilizables (`cypress/support/commands.ts`) para login y navegación base.

### Datos y precondiciones

1. Reutilizar admin semilla (`admin@empresa.com` / `admin123`) como credencial de smoke.
2. Definir estrategia de test data aislada por prefijos para evitar colisiones entre corridas.
3. Documentar condiciones mínimas del entorno (backend, DB, frontend y CORS funcional).

### Ejecución reproducible

1. Scripts npm dedicados:
   - abrir Cypress local
   - ejecutar headless
   - flujo integrado con `start-server-and-test`
2. Integración con Docker/local sin cambiar contratos de backend.

### Cobertura mínima obligatoria

1. Auth: login válido, login inválido, redirección de ruta privada.
2. CRUD: operaciones críticas de empleados y departamentos.
3. Errores: validación 400, no autorizado 401, conflicto 409.

## Post-Design Constitution Check

- [x] Stack gate re-check: Spring Boot 3 + Java 17 sin cambios incompatibles.
- [x] Security gate re-check: validaciones auth/guard cubiertas en escenarios E2E.
- [x] Data gate re-check: PostgreSQL permanece como datastore y se usa entorno existente.
- [x] Container gate re-check: ejecución soportada con docker-compose actual.
- [x] API contract gate re-check: se prueba contra contratos existentes sin endpoints paralelos.
- [x] Quality gate re-check: plan define pruebas críticas y reporte reproducible de resultados.
- [x] Frontend gate re-check: Angular permanece como cliente oficial.
- [x] Frontend security gate re-check: uso exclusivo de API oficial, JWT, guard y manejo 400/401/409.

## Validation Strategy (Local and Docker)

### Local Validation

1. Ejecutar frontend y backend en entorno local con PostgreSQL disponible.
2. Ejecutar comando E2E oficial en modo headless.
3. Verificar evidencia de ejecucion: casos ejecutados, aprobados, fallidos y tiempo total.

### Docker Validation

1. Levantar `postgres`, `app` y `frontend` con `docker/docker-compose.yml`.
2. Ejecutar el mismo comando E2E oficial apuntando al frontend en contenedor.
3. Verificar que no hay diferencias de contrato API ni dependencia de pasos manuales fuera del repositorio.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ninguna | N/A | N/A |
