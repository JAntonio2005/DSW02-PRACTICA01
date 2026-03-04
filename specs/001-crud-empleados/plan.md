# Implementation Plan: CRUD de Empleados

**Branch**: `[001-crud-empleados]` | **Date**: 2026-02-26 | **Spec**: [specs/001-crud-empleados/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-crud-empleados/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar un CRUD de empleados con persistencia en PostgreSQL para los campos `clave` (PK texto, único, máximo 100), `nombre`, `dirección` y `teléfono` (máximo 100 cada uno), incluyendo validaciones, errores consistentes, documentación OpenAPI y ejecución local en Docker. La solución se construirá como API REST con Spring Boot 3 + Java 17, migraciones versionadas y cobertura de pruebas para rutas felices y errores de validación/unicidad/no encontrado.

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3.x (Web, Validation, Data JPA, Security), PostgreSQL Driver, Flyway, springdoc-openapi, Lombok (opcional)  
**Storage**: PostgreSQL (relacional primario)  
**Testing**: JUnit 5, Spring Boot Test, MockMvc, Testcontainers PostgreSQL (integración)  
**Target Platform**: Linux containers (Docker) para ejecución local/CI
**Project Type**: Web service (REST API backend)  
**Performance Goals**: p95 < 2s para operaciones CRUD válidas en entorno local (alineado con SC-003)  
**Constraints**: Campos `clave`, `nombre`, `dirección`, `teléfono` obligatorios y máximo 100; `clave` única; formato de error consistente; secretos por variables de entorno  
**Scale/Scope**: Práctica académica, un servicio backend, una entidad principal (Empleado), carga de usuarios baja/moderada

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Stack gate: Solution uses Spring Boot 3.x + Java 17 (or includes approved amendment).
- [x] Security gate: Authentication/authorization strategy is explicit for all non-public APIs.
- [x] Data gate: PostgreSQL is primary datastore and schema migration plan is defined.
- [x] Container gate: Dockerfile and local container orchestration approach are defined.
- [x] API contract gate: OpenAPI/Swagger documentation update is planned with implementation.
- [x] Quality gate: Tests and compliance checks include auth, data access, and error paths.

**Pre-Phase 0 Result**: PASS. Se detectó tensión entre FR-012 del spec (sin auth obligatoria en práctica local) y la constitución (auth obligatoria en APIs no públicas). La decisión de diseño mantiene seguridad activa para endpoints CRUD, con configuración explícita por ruta/rol.

## Project Structure

### Documentation (this feature)

```text
specs/001-crud-empleados/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main/
│   ├── java/
│   │   └── com/dsw02/practica01/
│   │       ├── empleados/
│   │       │   ├── web/
│   │       │   ├── service/
│   │       │   ├── domain/
│   │       │   ├── repository/
│   │       │   └── dto/
│   │       └── common/
│   └── resources/
│       ├── db/migration/
│       └── application*.yml
└── test/
    └── java/
        └── com/dsw02/practica01/
            ├── contract/
            ├── integration/
            └── unit/
docker/
└── docker-compose.yml
Dockerfile
```

**Structure Decision**: Se adopta estructura única de backend Spring Boot (servicio REST) porque el workspace está en estado greenfield sin código previo y el alcance requiere API + persistencia PostgreSQL + contenedores.

## Phase 0 Research Plan

- Resolver estrategia de autenticación/autorización compatible con constitución y con el alcance académico.
- Definir estrategia de migraciones PostgreSQL (herramienta y lineamientos).
- Definir contrato API inicial (convenciones de endpoints, códigos y errores).
- Definir estrategia de eliminación para empleados y su impacto funcional.

## Phase 1 Design Plan

- Modelar entidad `Empleado` con reglas de validación y estados.
- Diseñar contratos API REST y ejemplos mínimos en OpenAPI.
- Redactar guía de arranque local con Docker y ejecución de pruebas.
- Preparar contexto para generación posterior de tareas (`/speckit.tasks`).

## Post-Design Constitution Check

- [x] Stack gate: Diseño mantiene Java 17 + Spring Boot 3.
- [x] Security gate: Endpoints CRUD bajo autenticación explícita por rol.
- [x] Data gate: PostgreSQL + Flyway definidos para esquema y evolución.
- [x] Container gate: Dockerfile + docker-compose contemplados para app + DB.
- [x] API contract gate: OpenAPI/Swagger incluido como entregable de diseño.
- [x] Quality gate: Se incluyen pruebas de auth, datos, validación y errores.

**Post-Phase 1 Result**: PASS.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ninguna | N/A | N/A |
