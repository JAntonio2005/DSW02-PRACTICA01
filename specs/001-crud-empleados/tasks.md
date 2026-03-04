# Tasks: CRUD de Empleados

**Input**: Design documents from `/specs/001-crud-empleados/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Se agregan tareas de pruebas críticas por cumplimiento constitucional (autenticación, validación y persistencia), aun sin requerir enfoque TDD estricto.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline configuration

- [X] T001 Configurar dependencias base de Spring Boot 3, PostgreSQL, Flyway y OpenAPI en pom.xml
- [X] T002 Crear clase principal de arranque en src/main/java/com/dsw02/practica01/Application.java
- [X] T003 [P] Configurar propiedades de aplicación y datasource en src/main/resources/application.yml
- [X] T004 [P] Configurar wrapper de Maven para ejecución local en mvnw y mvnw.cmd
- [X] T005 [P] Definir estructura de paquetes base empleados/common en src/main/java/com/dsw02/practica01/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Crear migración inicial de secuencia y tabla empleados en src/main/resources/db/migration/V1__create_empleados.sql
- [X] T007 [P] Implementar configuración de seguridad HTTP Basic con credenciales de referencia `admin/admin123` inyectadas por variables de entorno (sin hardcode) en src/main/java/com/dsw02/practica01/common/security/SecurityConfig.java y src/main/resources/application.yml
- [X] T008 [P] Crear excepciones de dominio para no encontrado y conflicto en src/main/java/com/dsw02/practica01/common/exception/ResourceNotFoundException.java y src/main/java/com/dsw02/practica01/common/exception/ConflictException.java
- [X] T009 [P] Implementar contrato de error API en src/main/java/com/dsw02/practica01/common/web/ApiErrorResponse.java
- [X] T010 Implementar manejo global de excepciones en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [X] T011 [P] Crear imagen de aplicación con Docker en Dockerfile
- [X] T012 [P] Configurar orquestación local app + postgres en docker/docker-compose.yml
- [X] T013 Configurar variables de entorno de ejemplo en .env.example
- [X] T036 [P] Crear prueba de integración de autenticación requerida para CRUD en src/test/java/com/dsw02/practica01/integration/AuthIntegrationTest.java
- [X] T037 [P] Crear prueba de validación (campos vacíos y >100) en src/test/java/com/dsw02/practica01/integration/EmpleadoValidationIntegrationTest.java
- [X] T038 [P] Crear prueba de acceso a PostgreSQL y migración Flyway en src/test/java/com/dsw02/practica01/integration/PersistenceIntegrationTest.java

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Registrar empleado (Priority: P1) 🎯 MVP

**Goal**: Permitir alta de empleados con `clave` autogenerada `EMP-<consecutivo>` y validación de campos requeridos con longitud máxima de 100.

**Independent Test**: Crear un empleado válido y verificar respuesta 201 con `clave` autogenerada y persistencia en base de datos.

### Implementation for User Story 1

- [X] T014 [P] [US1] Crear entidad Empleado en src/main/java/com/dsw02/practica01/empleados/domain/Empleado.java
- [X] T015 [P] [US1] Crear repositorio EmpleadoRepository en src/main/java/com/dsw02/practica01/empleados/repository/EmpleadoRepository.java
- [X] T016 [P] [US1] Crear DTO de entrada sin `clave` en src/main/java/com/dsw02/practica01/empleados/dto/EmpleadoRequest.java
- [X] T017 [P] [US1] Crear DTO de salida con `clave` en src/main/java/com/dsw02/practica01/empleados/dto/EmpleadoResponse.java
- [X] T018 [US1] Implementar generación de clave `EMP-<consecutivo>` y alta de empleado en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T019 [US1] Implementar endpoint POST /api/v2/empleados en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [X] T020 [US1] Documentar operación POST en contrato OpenAPI en specs/001-crud-empleados/contracts/empleados.openapi.yaml

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Consultar y editar empleado (Priority: P2)

**Goal**: Permitir consulta por clave, listado paginado y actualización de nombre, dirección y teléfono sin alterar `clave`.

**Independent Test**: Obtener empleado por clave, listar con `page` y `size`, y actualizar datos válidos con respuesta exitosa.

### Implementation for User Story 2

- [X] T021 [US2] Implementar búsqueda por clave y listado paginado en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T022 [US2] Implementar actualización por clave sin modificación de PK en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T023 [US2] Implementar endpoint GET /api/v2/empleados con parámetros page/size en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [X] T024 [US2] Implementar endpoint GET /api/v2/empleados/{clave} y PUT /api/v2/empleados/{clave} en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [X] T025 [US2] Ajustar mapeo de errores 400/404 para consulta y edición en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [X] T026 [US2] Documentar endpoints GET/PUT y paginación en specs/001-crud-empleados/contracts/empleados.openapi.yaml

**Checkpoint**: User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Eliminar empleado (Priority: P3)

**Goal**: Permitir eliminación física de empleados por `clave` con manejo de no encontrado.

**Independent Test**: Eliminar un empleado existente y validar 204; eliminar una clave inexistente y validar 404.

### Implementation for User Story 3

- [X] T027 [US3] Implementar eliminación física por clave en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T028 [US3] Implementar endpoint DELETE /api/v2/empleados/{clave} en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [X] T029 [US3] Ajustar respuesta de error para eliminación de clave inexistente en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [X] T030 [US3] Documentar endpoint DELETE en specs/001-crud-empleados/contracts/empleados.openapi.yaml

**Checkpoint**: User Story 3 should be fully functional and testable independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T031 [P] Alinear especificación funcional con decisiones finales en specs/001-crud-empleados/spec.md
- [X] T032 [P] Actualizar decisiones técnicas en specs/001-crud-empleados/research.md
- [X] T033 [P] Actualizar modelo de datos final en specs/001-crud-empleados/data-model.md
- [X] T034 [P] Actualizar guía de ejecución y pruebas manuales en specs/001-crud-empleados/quickstart.md
- [X] T035 Ejecutar validación de compilación y pruebas existentes con mvn clean test en pom.xml
- [X] T039 Definir y ejecutar verificación de latencia p95 < 2s para operaciones CRUD válidas en entorno local en specs/001-crud-empleados/quickstart.md
- [X] T040 Registrar evidencia de medición (comando, muestra y resultados) en specs/001-crud-empleados/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2 (can start independently, but usually reuses artifacts from US1)
- **Phase 5 (US3)**: Depends on Phase 2 (can start independently, but usually reuses artifacts from US1)
- **Phase 6 (Polish)**: Depends on completed user stories

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundational phase
- **US2 (P2)**: No functional dependency on US3; can progress after foundational phase
- **US3 (P3)**: No functional dependency on US2; can progress after foundational phase

### Dependency Graph (Story Order)

- Foundational → US1 (MVP)
- Foundational → US2
- Foundational → US3
- US1 + US2 + US3 → Polish

### Parallel Opportunities

- **Setup**: T003, T004 y T005 en paralelo
- **Foundational**: T007, T008, T009, T011, T012 y T013 en paralelo
- **US1**: T014, T015, T016 y T017 en paralelo antes de T018
- **US2**: T025 y T026 en paralelo mientras se completa T021-T024
- **US3**: T029 y T030 en paralelo tras T028

---

## Parallel Example: User Story 1

```bash
Task: "T014 [US1] Crear entidad Empleado en src/main/java/com/dsw02/practica01/empleados/domain/Empleado.java"
Task: "T015 [US1] Crear repositorio EmpleadoRepository en src/main/java/com/dsw02/practica01/empleados/repository/EmpleadoRepository.java"
Task: "T016 [US1] Crear EmpleadoRequest en src/main/java/com/dsw02/practica01/empleados/dto/EmpleadoRequest.java"
Task: "T017 [US1] Crear EmpleadoResponse en src/main/java/com/dsw02/practica01/empleados/dto/EmpleadoResponse.java"
```

## Parallel Example: User Story 2

```bash
Task: "T025 [US2] Ajustar mapeo de errores en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java"
Task: "T026 [US2] Documentar paginación y GET/PUT en specs/001-crud-empleados/contracts/empleados.openapi.yaml"
```

## Parallel Example: User Story 3

```bash
Task: "T029 [US3] Ajustar error 404 de eliminación en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java"
Task: "T030 [US3] Documentar DELETE en specs/001-crud-empleados/contracts/empleados.openapi.yaml"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2
2. Complete Phase 3 (US1)
3. Validate US1 independently (alta con clave autogenerada)
4. Demo MVP

### Incremental Delivery

1. Foundation ready (Phases 1-2)
2. Deliver US1 (alta)
3. Deliver US2 (consulta, paginación, edición)
4. Deliver US3 (eliminación)
5. Run polish and final verification

### Suggested MVP Scope

- US1 only (Phase 3) after foundational completion

