# Tasks: Feature 003 - CRUD de Departamentos

**Input**: Design documents from `/specs/003-crud-departamentos/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Se incluyen pruebas de integración y unitarias porque la feature exige validaciones de negocio, migración segura y compatibilidad con seguridad JWT.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: US1, US2, US3 para trazabilidad por historia
- Cada tarea incluye ruta exacta de archivo

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de trabajo para la feature sin romper v2

- [x] T001 Verificar estado base de OpenAPI y seguridad JWT en src/main/java/com/dsw02/practica01/common/config/OpenApiConfig.java y src/main/java/com/dsw02/practica01/common/security/SecurityConfig.java
- [x] T002 [P] Crear estructura de paquete de feature en src/main/java/com/dsw02/practica01/departamentos/
- [x] T003 [P] Crear estructura de pruebas de feature en src/test/java/com/dsw02/practica01/integration/
- [x] T004 [P] Definir versión de migración para departamentos en src/main/resources/db/migration/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base de datos, dominio y contrato base compartido para todas las historias

**⚠️ CRITICAL**: Ninguna historia de usuario inicia antes de completar esta fase

- [x] T005 Crear migración base de departamentos (tabla + índices + unique nombre) en src/main/resources/db/migration/V4__create_departamentos.sql
- [x] T006 Crear migración de semilla para departamento inicial en src/main/resources/db/migration/V5__seed_departamento_default.sql
- [x] T007 Crear migración de columna referencial nullable en empleados en src/main/resources/db/migration/V6__add_departamento_clave_to_empleados.sql
- [x] T008 Crear migración de backfill de empleados existentes al departamento semilla en src/main/resources/db/migration/V7__backfill_empleados_departamento.sql
- [x] T009 Crear migración de hardening final (`NOT NULL` + `FOREIGN KEY`) en src/main/resources/db/migration/V8__enforce_departamento_fk.sql
- [x] T010 [P] Crear entidad Departamento (`clave`, `nombre`) en src/main/java/com/dsw02/practica01/departamentos/domain/Departamento.java
- [x] T011 [P] Agregar referencia obligatoria de departamento en src/main/java/com/dsw02/practica01/empleados/domain/Empleado.java
- [x] T012 [P] Crear DepartamentoRepository en src/main/java/com/dsw02/practica01/departamentos/repository/DepartamentoRepository.java
- [x] T013 [P] Agregar método `existsByDepartamento_Clave` en src/main/java/com/dsw02/practica01/empleados/repository/EmpleadoRepository.java
- [x] T014 [P] Crear DTO DepartamentoRequest (`nombre`) en src/main/java/com/dsw02/practica01/departamentos/dto/DepartamentoRequest.java
- [x] T015 [P] Crear DTO DepartamentoResponse (`clave`,`nombre`) en src/main/java/com/dsw02/practica01/departamentos/dto/DepartamentoResponse.java
- [x] T016 [P] Reutilizar `ResourceNotFoundException` existente para departamento inexistente (sin crear nueva excepción) y documentar su uso en src/main/java/com/dsw02/practica01/common/exception/ResourceNotFoundException.java

**Checkpoint**: Foundation lista para iniciar historias en orden de prioridad

---

## Phase 3: User Story 1 - CRUD de Departamentos (Priority: P1) 🎯 MVP

**Goal**: CRUD completo en `/api/v2/departamentos` con paginación y regla de eliminación 409

**Independent Test**: CRUD de departamentos funciona con JWT y la eliminación de departamento con empleados asociados responde 409.

### Tests for User Story 1

- [x] T017 [P] [US1] Crear prueba de crear/listar departamentos con paginación en src/test/java/com/dsw02/practica01/integration/DepartamentoCrudIntegrationTest.java
- [x] T018 [P] [US1] Crear prueba de obtener/actualizar departamento por clave en src/test/java/com/dsw02/practica01/integration/DepartamentoCrudIntegrationTest.java
- [x] T019 [P] [US1] Crear prueba de eliminación con empleados asociados devolviendo 409 en src/test/java/com/dsw02/practica01/integration/DepartamentoDeleteConflictIntegrationTest.java
- [x] T020 [P] [US1] Crear prueba de endpoints de departamentos protegidos por JWT en src/test/java/com/dsw02/practica01/integration/DepartamentoAuthzIntegrationTest.java

### Implementation for User Story 1

- [x] T021 [US1] Implementar generación de clave de departamento en src/main/java/com/dsw02/practica01/departamentos/service/DepartamentoService.java
- [x] T022 [US1] Implementar create y validación de nombre único en src/main/java/com/dsw02/practica01/departamentos/service/DepartamentoService.java
- [x] T023 [US1] Implementar list paginado en src/main/java/com/dsw02/practica01/departamentos/service/DepartamentoService.java
- [x] T024 [US1] Implementar getByClave y update en src/main/java/com/dsw02/practica01/departamentos/service/DepartamentoService.java
- [x] T025 [US1] Implementar regla de eliminación con conflicto 409 usando `EmpleadoRepository` en src/main/java/com/dsw02/practica01/departamentos/service/DepartamentoService.java
- [x] T026 [US1] Crear DepartamentoController con rutas `/api/v2/departamentos` en src/main/java/com/dsw02/practica01/departamentos/web/DepartamentoController.java
- [x] T027 [US1] Ajustar mensajes/códigos de conflicto de departamentos en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [x] T028 [US1] Verificar que seguridad JWT cubre `/api/v2/departamentos/**` en src/main/java/com/dsw02/practica01/common/security/SecurityConfig.java

**Checkpoint**: US1 funcional y demostrable independientemente

---

## Phase 4: User Story 2 - Departamento obligatorio en Empleados (Priority: P2)

**Goal**: `departamentoClave` obligatorio y existente en create/update de empleados

**Independent Test**: Empleado con `departamentoClave` válido se guarda; ausente o inexistente se rechaza con error de negocio/validación.

### Tests for User Story 2

- [x] T029 [P] [US2] Crear prueba de crear empleado con `departamentoClave` válido en src/test/java/com/dsw02/practica01/integration/EmpleadoDepartamentoIntegrationTest.java
- [x] T030 [P] [US2] Crear prueba de crear/actualizar empleado sin `departamentoClave` (400) en src/test/java/com/dsw02/practica01/integration/EmpleadoDepartamentoValidationIntegrationTest.java
- [x] T031 [P] [US2] Crear prueba de crear/actualizar empleado con `departamentoClave` inexistente en src/test/java/com/dsw02/practica01/integration/EmpleadoDepartamentoValidationIntegrationTest.java

### Implementation for User Story 2

- [x] T032 [US2] Agregar `departamentoClave` obligatorio en src/main/java/com/dsw02/practica01/empleados/dto/EmpleadoRequest.java
- [x] T033 [US2] Agregar `departamentoClave` en respuesta de empleado en src/main/java/com/dsw02/practica01/empleados/dto/EmpleadoResponse.java
- [x] T034 [US2] Validar existencia de departamento en create/update en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [x] T035 [US2] Mapear `departamentoClave` a entidad `Empleado` en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [x] T036 [US2] Ajustar `EmpleadoController` para contratos impactados en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [x] T037 [US2] Estandarizar error de negocio para departamento inexistente en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java

**Checkpoint**: US2 funcional sin romper endpoints v2 existentes

---

## Phase 5: User Story 3 - Migración segura de datos existentes (Priority: P3)

**Goal**: Aplicar migración en etapas sin dejar empleados huérfanos ni romper integridad

**Independent Test**: Base con empleados existentes migra correctamente y finaliza con FK + NOT NULL activos.

### Tests for User Story 3

- [x] T038 [P] [US3] Crear prueba de integración para validar backfill de empleados existentes en src/test/java/com/dsw02/practica01/integration/DepartamentoMigrationIntegrationTest.java
- [x] T039 [P] [US3] Crear prueba de integridad final (`NOT NULL` + FK) en src/test/java/com/dsw02/practica01/integration/DepartamentoMigrationIntegrationTest.java

### Implementation for User Story 3

- [x] T040 [US3] Añadir script SQL de verificación post-migración en specs/003-crud-departamentos/quickstart.md
- [x] T041 [US3] Ajustar migraciones para idempotencia y rollback seguro en src/main/resources/db/migration/V4__create_departamentos.sql y src/main/resources/db/migration/V8__enforce_departamento_fk.sql
- [x] T042 [US3] Asegurar uso del departamento semilla en backfill sin registros huérfanos en src/main/resources/db/migration/V7__backfill_empleados_departamento.sql

**Checkpoint**: US3 funcional con migración segura y validada

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de documentación, contrato y validación integral

- [x] T043 [P] Actualizar contrato OpenAPI de departamentos en specs/003-crud-departamentos/contracts/departamentos.openapi.yaml
- [x] T044 [P] Reflejar `departamentoClave` en contrato de empleados en specs/003-crud-departamentos/contracts/departamentos.openapi.yaml
- [x] T045 [P] Ajustar anotaciones OpenAPI en controlador de departamentos en src/main/java/com/dsw02/practica01/departamentos/web/DepartamentoController.java
- [x] T046 Ejecutar pruebas unitarias de reglas de negocio de departamento en src/test/java/com/dsw02/practica01/unit/departamentos/DepartamentoServiceTest.java
- [x] T047 Ejecutar pruebas de integración de departamentos y empleados impactados en src/test/java/com/dsw02/practica01/integration/
- [x] T048 Ejecutar validación completa de build/tests con `./mvnw clean test` en pom.xml
- [x] T049 Documentar flujo de validación final y smoke tests en specs/003-crud-departamentos/quickstart.md
- [ ] T050 Ejecutar verificación runtime con Docker (servicio + base de datos) usando docker/docker-compose.yml; **criterio de aceptación**: app levantada y `GET /actuator/health` responde estado UP
- [x] T051 Verificar explícitamente en OpenAPI/Swagger la distinción entre login (`/api/auth/login` con correo/password) y uso de Bearer token en endpoints protegidos; **criterio de aceptación**: ambos flujos visibles y diferenciados en documentación
- [ ] T052 Ejecutar validación end-to-end de bootstrap-auth en ambiente limpio: levantar entorno limpio, aplicar migraciones, verificar presencia de admin semilla, ejecutar login con admin semilla y confirmar obtención de JWT; **criterio de aceptación**: flujo completo exitoso sin inserciones manuales fuera del repositorio

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Phase 1
- **US1-US3 (Phase 3-5)**: Depend on Phase 2
- **Polish (Phase 6)**: Depends on completion of US1, US2, US3

### User Story Dependencies

- **US1 (P1)**: Puede iniciar inmediatamente tras Foundation
- **US2 (P2)**: Depende de Foundation y se integra con dominio de empleados existente
- **US3 (P3)**: Depende de Foundation y de migraciones de Phase 2 para validación final

### Within Each User Story

- Tests de historia primero (fallando inicialmente) → implementación de dominio/servicio → controller/errores → validación de historia

### Parallel Opportunities

- **Phase 1**: T002, T003, T004
- **Phase 2**: T010, T011, T012, T014, T015, T016
- **US1**: T017, T018, T019, T020
- **US2**: T029, T030, T031
- **US3**: T038, T039
- **Polish**: T043, T044, T045

---

## Parallel Example: User Story 1

```bash
Task: "T017 [US1] Prueba create/list de departamentos"
Task: "T018 [US1] Prueba get/update por clave"
Task: "T020 [US1] Prueba authz JWT de departamentos"
```

## Parallel Example: User Story 2

```bash
Task: "T029 [US2] Prueba empleado con departamento válido"
Task: "T030 [US2] Prueba departamentoClave obligatorio"
Task: "T031 [US2] Prueba departamento inexistente"
```

## Parallel Example: User Story 3

```bash
Task: "T038 [US3] Prueba de backfill"
Task: "T039 [US3] Prueba de integridad final FK/NOT NULL"
```

---

## Implementation Strategy

### MVP First (US1)

1. Completar Phase 1
2. Completar Phase 2
3. Completar Phase 3 (US1)
4. Validar CRUD departamentos + 409 + JWT en v2

### Incremental Delivery

1. Foundation (migraciones + entidades base)
2. US1 (catálogo departamentos)
3. US2 (departamento obligatorio en empleados)
4. US3 (migración segura verificada)
5. Polish (OpenAPI + pruebas finales)

### Safety-First Approach

- Priorizar cambios mínimos sobre módulos existentes.
- No tocar versión de API ni contratos no impactados.
- Mantener seguridad JWT y paginación vigente.
- Aplicar migraciones en etapas para evitar ruptura de datos existentes.
