# Implementation Plan: Feature 003 - CRUD de Departamentos

**Branch**: `[003-crud-departamentos]` | **Date**: 2026-03-19 | **Spec**: [specs/003-crud-departamentos/spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-crud-departamentos/spec.md`

## Summary

Implementar CRUD completo de departamentos en `/api/v2/departamentos` y volver obligatoria la relación empleado→departamento sin crear v3. El enfoque técnico prioriza migración de datos segura en Flyway por etapas (tabla + semilla + backfill + restricciones finales), integración con seguridad JWT existente, consistencia de paginación con empleados y actualización de OpenAPI/Swagger para endpoints y contratos impactados.

## Technical Context

**Language/Version**: Java 17  
**Primary Dependencies**: Spring Boot 3.3.x (Web, Validation, Data JPA, Security), Flyway, springdoc-openapi, JJWT  
**Storage**: PostgreSQL (schema versionado con Flyway)  
**Testing**: JUnit 5, Spring Boot Test, MockMvc, Testcontainers PostgreSQL (con fallback sin Docker en tests existentes)  
**Target Platform**: Linux containers (Docker) y ejecución local de desarrollo
**Project Type**: Backend web-service REST monolítico  
**Performance Goals**: Mantener tiempos de respuesta en listados paginados y operaciones CRUD dentro de objetivos actuales del proyecto (sin regresión perceptible frente a empleados)  
**Constraints**: Mantener `/api/v2`; no crear v3; no romper JWT, Swagger ni endpoints existentes más allá de `departamentoClave` obligatorio en empleados; Departamento solo `clave` y `nombre`  
**Scale/Scope**: Feature incremental sobre dominio existente de empleados con un nuevo agregado (departamentos) y migración de datos históricos

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
specs/003-crud-departamentos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)
```text
src/
├── main/
│   ├── java/com/dsw02/practica01/
│   │   ├── common/
│   │   ├── empleados/
│   │   └── departamentos/        # nuevo módulo de feature
│   └── resources/
│       ├── application.yml
│       └── db/migration/
└── test/
  └── java/com/dsw02/practica01/
    ├── integration/
    └── unit/

docker/
└── docker-compose.yml
```

**Structure Decision**: Se mantiene arquitectura backend monolítica actual y se agrega un paquete `departamentos` paralelo a `empleados`; `common` conserva seguridad JWT y manejo de errores compartido. Empleados se modifica de forma mínima para referenciar `departamentoClave`/relación obligatoria.

## Phase 0 - Research Summary

- Se usará migración en 4 pasos dentro de Flyway para evitar ruptura de datos existentes.
- La regla de eliminación con empleados asociados se manejará en capa de servicio con chequeo explícito para retornar `409 Conflict` con contrato consistente.
- Para compatibilidad v2, los endpoints actuales de empleados se mantienen y solo se amplía contrato para `departamentoClave` obligatorio.

## Phase 1 - Technical Design Plan

### Migraciones SQL (Flyway)

1. Crear tabla `departamentos` con `clave` (PK) y `nombre` (único, no nulo).
2. Insertar departamento semilla para transición (por ejemplo `DEP-DEFAULT`).
3. Agregar columna de referencia en `empleados` inicialmente nullable y hacer backfill de registros existentes al semilla.
4. Aplicar restricción final: `NOT NULL` + `FOREIGN KEY` (`empleados.departamento_clave` → `departamentos.clave`) + índices necesarios.

### Modelo de dominio

- Nueva entidad `Departamento` con campos `clave` y `nombre`.
- `Empleado` incorpora relación obligatoria a `Departamento` (sin eliminar compatibilidad de atributos existentes).

### DTOs

- `DepartamentoRequest` (`nombre`).
- `DepartamentoResponse` (`clave`, `nombre`).
- Actualización de DTOs de empleado para incluir `departamentoClave` obligatorio en create/update.

### Repositories

- `DepartamentoRepository` con búsqueda por clave/nombre, paginación y validación de duplicados.
- `EmpleadoRepository` incorpora helpers para validar existencia de empleados por departamento.

### Services

- `DepartamentoService`: create, findAll paginado, findByClave, update, delete con regla `409` si hay empleados asociados.
- `EmpleadoService`: validar `departamentoClave` obligatorio y existencia al crear/actualizar.

### Controllers

- Nuevo `DepartamentoController` en `/api/v2/departamentos` con CRUD y paginación.
- `EmpleadoController` mantiene rutas v2 existentes y consume validación departamental sin cambio de versión.

### Validaciones y errores esperados

- `400 Bad Request` por campos obligatorios/formato inválido.
- `404 Not Found` para recurso inexistente por clave.
- `409 Conflict` al eliminar departamento con empleados asociados o por conflictos de unicidad.
- Error de negocio explícito cuando `departamentoClave` no exista en create/update de empleado.

### OpenAPI/Swagger impact

- Documentar todos los endpoints de departamentos.
- Reflejar `departamentoClave` en contratos de empleado.
- Mantener esquema BearerAuth y respuestas de error consistentes.

### Test strategy

- **Unit**: validación de reglas de servicio (delete con asociados, validación de existencia de departamento).
- **Integration**: CRUD departamentos, paginación, protección JWT, integración de empleados con `departamentoClave`, migración/backfill validada en base de pruebas.
- **Contract**: verificación de OpenAPI para nuevos endpoints y campos obligatorios.

## Phase 2 - Implementation Order (Recommended)

1. Flyway migration segura (tabla + semilla + backfill + constraints finales).
2. Entidad/repository `Departamento` y ajustes de `Empleado`.
3. `DepartamentoService` + `DepartamentoController` con paginación.
4. Integración de validación `departamentoClave` en `EmpleadoService`/DTOs.
5. Ajustes de `GlobalExceptionHandler` para conflictos/validación de negocio.
6. Actualización OpenAPI/Swagger.
7. Pruebas unitarias e integración.

## Risks & Mitigations

- **Riesgo**: Backfill incompleto en empleados existentes.  
  **Mitigación**: Migración idempotente con validación post-backfill antes de aplicar `NOT NULL`.
- **Riesgo**: Regresión en contratos v2 de empleados.  
  **Mitigación**: Mantener rutas/estructura base y agregar solo `departamentoClave` requerido con pruebas de compatibilidad.
- **Riesgo**: Diferencias entre entorno con y sin Docker para integración DB.  
  **Mitigación**: Mantener pruebas desacopladas de Docker cuando aplique y validar migraciones en entorno reproducible.

## Post-Design Constitution Check

- [x] Stack gate re-check: Spring Boot 3 + Java 17 mantenido.
- [x] Security gate re-check: recursos nuevos protegidos por JWT, login permanece público.
- [x] Data gate re-check: migración PostgreSQL/Flyway definida en etapas seguras.
- [x] Container gate re-check: ejecución local sigue soportada con Docker Compose del proyecto.
- [x] API contract gate re-check: actualización OpenAPI/Swagger explícitamente planificada.
- [x] Quality gate re-check: suite de pruebas cubre seguridad, datos y errores.

### Bootstrap-Auth Checkpoint (Ambiente Nuevo)

- [x] Migraciones ejecutadas en ambiente limpio sin pasos manuales fuera del repositorio.
- [x] Usuario administrador semilla presente tras aplicar migraciones.
- [x] Login exitoso con correo/password del admin semilla en endpoint de autenticación.
- [x] Obtención de JWT válida para consumir endpoints protegidos.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ninguna | N/A | N/A |
