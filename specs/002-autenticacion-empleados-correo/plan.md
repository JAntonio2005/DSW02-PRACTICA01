# Implementation Plan: Autenticación de Empleados

**Branch**: `[002-autenticacion-empleados-correo]` | **Date**: 2026-03-11 | **Spec**: [specs/002-autenticacion-empleados-correo/spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-autenticacion-empleados-correo/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Agregar autenticación por correo y contraseña para empleados mediante JWT Bearer con vigencia de 60 minutos, protección de endpoints privados por token válido, gestión de credenciales de empleado, y trazabilidad de eventos de autenticación. La implementación mantiene Spring Boot 3 + Java 17, PostgreSQL y Docker, documentando cambios en OpenAPI/Swagger.

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3.x (Web, Validation, Data JPA, Security), JWT library compatible con Spring Security, Flyway, springdoc-openapi  
**Storage**: PostgreSQL  
**Testing**: JUnit 5, Spring Boot Test, MockMvc, Testcontainers PostgreSQL  
**Target Platform**: Linux containers (Docker)
**Project Type**: Web service (REST API backend)  
**Performance Goals**: Autenticación válida p95 < 500ms en entorno local de práctica  
**Constraints**: JWT 60 minutos sin refresh; sin roles; sin bloqueo automático por intentos fallidos; no exponer contraseñas en respuestas  
**Scale/Scope**: Práctica académica, backend único, autenticación de empleados y protección de endpoints privados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Stack gate: Solution uses Spring Boot 3.x + Java 17 (or includes approved amendment).
- [x] Security gate: Authentication/authorization strategy is explicit for all non-public APIs.
- [x] Data gate: PostgreSQL is primary datastore and schema migration plan is defined.
- [x] Container gate: Dockerfile and local container orchestration approach are defined.
- [x] API contract gate: OpenAPI/Swagger documentation update is planned with implementation.
- [x] Quality gate: Tests and compliance checks include auth, data access, and error paths.

## Project Structure

### Documentation (this feature)

```text
specs/002-autenticacion-empleados-correo/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── main/
│   ├── java/com/dsw02/practica01/
│   │   ├── common/
│   │   └── empleados/
│   └── resources/
│       ├── application.yml
│       └── db/migration/
└── test/
    └── java/com/dsw02/practica01/
        ├── integration/
        └── unit/

docker/
└── docker-compose.yml
Dockerfile
```

**Structure Decision**: Se mantiene estructura monolítica de backend Spring Boot existente y se extiende el módulo `empleados` + `common/security` para autenticación JWT y persistencia de credenciales/eventos.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ninguna | N/A | N/A |
