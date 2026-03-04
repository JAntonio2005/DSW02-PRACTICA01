# Tasks: CRUD de Empleados

**Input**: Design documents from `/specs/001-crud-empleados/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se generan tareas de creación de pruebas en este plan porque no fueron solicitadas explícitamente en el spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Inicializar proyecto Spring Boot 3 con Java 17 en pom.xml
- [X] T002 Crear clase principal de aplicación en src/main/java/com/dsw02/practica01/Application.java
- [X] T003 [P] Configurar propiedades base por entorno en src/main/resources/application.yml
- [X] T004 [P] Agregar dependencias y configuración de OpenAPI/Swagger en pom.xml
- [X] T005 [P] Crear estructura de paquetes empleados/common en src/main/java/com/dsw02/practica01/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Configurar conexión PostgreSQL y variables de entorno en src/main/resources/application.yml
- [X] T007 Crear migración inicial de tabla empleados y secuencia `empleados_seq` en src/main/resources/db/migration/V1__create_empleados.sql
- [X] T008 [P] Implementar configuración base de Spring Security y filtro de autenticación en src/main/java/com/dsw02/practica01/common/security/SecurityConfig.java
- [X] T009 [P] Implementar manejador global de errores API en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [X] T010 [P] Definir modelo de error estandarizado en src/main/java/com/dsw02/practica01/common/web/ApiErrorResponse.java
- [X] T011 [P] Crear Dockerfile de la aplicación en Dockerfile
- [X] T012 [P] Crear orquestación local app + PostgreSQL en docker/docker-compose.yml
- [X] T013 Configurar health check y logging estructurado en src/main/resources/application.yml

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Registrar empleado (Priority: P1) 🎯 MVP

**Goal**: Permitir alta de empleados con `clave` autogenerada en formato `EMP-` + consecutivo y validaciones de longitud/obligatoriedad

**Independent Test**: Crear un empleado válido y verificar que la respuesta devuelve una `clave` autogenerada con formato `EMP-` + consecutivo, sin captura manual de clave.

### Implementation for User Story 1

- [X] T014 [P] [US1] Crear entidad Empleado en src/main/java/com/dsw02/practica01/empleados/domain/Empleado.java
- [X] T015 [P] [US1] Crear repositorio EmpleadoRepository en src/main/java/com/dsw02/practica01/empleados/repository/EmpleadoRepository.java
- [X] T016 [P] [US1] Crear DTO de solicitud de empleado sin campo `clave` en src/main/java/com/dsw02/practica01/empleados/dto/EmpleadoRequest.java
- [X] T017 [P] [US1] Crear DTO de respuesta de empleado en src/main/java/com/dsw02/practica01/empleados/dto/EmpleadoResponse.java
- [X] T018 [US1] Implementar lógica de alta con generación de `clave` (`EMP-` + consecutivo) y garantía de unicidad en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T019 [US1] Implementar endpoint POST /api/v1/empleados en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [X] T020 [US1] Documentar operación de alta en OpenAPI annotations en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Consultar y editar empleado (Priority: P2)

**Goal**: Permitir consulta por clave/listado y actualización de datos del empleado

**Independent Test**: Consultar un empleado existente por clave, listar empleados y actualizar nombre/dirección/teléfono con datos válidos.

### Implementation for User Story 2

- [X] T021 [US2] Implementar consulta por clave y listado en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T022 [US2] Implementar actualización por clave con validaciones sin permitir cambio de `clave` en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T023 [US2] Implementar endpoint GET /api/v1/empleados y GET /api/v1/empleados/{clave} en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [X] T024 [US2] Implementar endpoint PUT /api/v1/empleados/{clave} en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [X] T025 [US2] Mapear errores de no encontrado/validación en flujo de consulta y actualización en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [X] T026 [US2] Actualizar documentación OpenAPI para endpoints GET/PUT en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java

**Checkpoint**: User Stories 1 and 2 work independently

---

## Phase 5: User Story 3 - Eliminar empleado (Priority: P3)

**Goal**: Permitir eliminación física de empleados por clave

**Independent Test**: Eliminar un empleado existente y confirmar respuesta 204; intentar eliminar clave inexistente y validar 404.

### Implementation for User Story 3

- [X] T027 [US3] Implementar eliminación física por clave en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T028 [US3] Implementar endpoint DELETE /api/v1/empleados/{clave} en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [X] T029 [US3] Mapear error de clave inexistente en eliminación en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [X] T030 [US3] Actualizar documentación OpenAPI para endpoint DELETE en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T031 [P] Alinear contrato OpenAPI del feature con implementación final en specs/001-crud-empleados/contracts/empleados.openapi.yaml
- [X] T032 [P] Actualizar guía de ejecución y validación manual en specs/001-crud-empleados/quickstart.md
- [X] T033 Documentar variables de entorno requeridas en .env.example
- [X] T034 Ejecutar validación de quickstart y ajustar pasos en specs/001-crud-empleados/quickstart.md
- [X] T035 Ejecutar build y pruebas existentes del proyecto en pom.xml

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Pueden ejecutarse en paralelo por equipo
  - O secuencialmente en prioridad P1 → P2 → P3
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Inicia tras Phase 2; no depende de otras historias
- **User Story 2 (P2)**: Inicia tras Phase 2; usa componentes de US1 para entidad/base del servicio
- **User Story 3 (P3)**: Inicia tras Phase 2; usa componentes de US1/US2 para repositorio/servicio

### Within Each User Story

- Modelos/DTOs antes que servicios
- Servicios antes que endpoints
- Endpoints antes que cierre de documentación OpenAPI
- Cada historia debe cerrar con validación independiente

### Parallel Opportunities

- Tareas [P] de Setup pueden ejecutarse en paralelo
- Tareas [P] de Foundational pueden ejecutarse en paralelo
- En US1, T014-T017 pueden ejecutarse en paralelo
- Historias US2 y US3 pueden repartirse en paralelo tras cerrar US1 base

---

## Parallel Example: User Story 1

```bash
# Trabajo paralelo de modelos/DTOs para US1:
Task: "T014 [US1] Crear entidad Empleado"
Task: "T015 [US1] Crear EmpleadoRepository"
Task: "T016 [US1] Crear EmpleadoRequest"
Task: "T017 [US1] Crear EmpleadoResponse"
```

## Parallel Example: User Story 2

```bash
# Trabajo paralelo de documentación/manejo de errores mientras se cierra servicio:
Task: "T025 [US2] Mapear errores en GlobalExceptionHandler"
Task: "T026 [US2] Actualizar OpenAPI de GET/PUT"
```

## Parallel Example: User Story 3

```bash
# Trabajo paralelo al cierre de US3:
Task: "T029 [US3] Mapear error de eliminación inexistente"
Task: "T030 [US3] Actualizar OpenAPI de DELETE"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar Phase 3 (US1)
4. Validar alta + generación de clave `EMP-<consecutivo>` + límites de 100 caracteres
5. Demostrar MVP

### Incremental Delivery

1. Foundation lista (Phase 1 + 2)
2. Entregar US1 (alta)
3. Entregar US2 (consulta/edición)
4. Entregar US3 (eliminación)
5. Cerrar con Phase 6 (polish)

### Parallel Team Strategy

1. Equipo completo en Setup + Foundational
2. Luego:
   - Dev A: US2
   - Dev B: US3
   - Dev C: OpenAPI/quickstart/polish
3. Integración por checkpoints de cada fase

---

## Notes

- Todas las tareas usan formato checklist estricto `- [ ] T### ...`
- Las etiquetas [US1]/[US2]/[US3] se aplican solo en fases de historias
- Mantener cumplimiento constitucional: Java 17, Spring Boot 3, PostgreSQL, Docker, Swagger, seguridad explícita
- No introducir cambios fuera del alcance CRUD de empleados
