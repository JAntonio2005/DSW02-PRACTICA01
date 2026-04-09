# Tasks: Feature 005 - Cypress E2E Base Suite

**Input**: Design documents from `/specs/005-cypress-e2e/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Sí. Esta feature trata explícitamente de una suite de pruebas E2E, por lo que las tareas de testing son el núcleo de implementación.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: [US1], [US2], [US3] para trazabilidad por historia
- Cada tarea incluye ruta exacta de archivo

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar infraestructura mínima de Cypress en el frontend

- [X] T001 Configurar dependencias Cypress y utilidades E2E en frontend/package.json
- [X] T002 [P] Crear configuración base de Cypress en frontend/cypress.config.ts
- [X] T003 [P] Crear bootstrap de soporte Cypress en frontend/cypress/support/e2e.ts
- [X] T004 [P] Crear comandos reutilizables base en frontend/cypress/support/commands.ts
- [X] T005 [P] Crear tipado de comandos custom en frontend/cypress/support/component.d.ts
- [X] T006 Definir scripts de ejecución local/CI (`cypress:open`, `cypress:run`, `e2e`) en frontend/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base transversal para que cualquier historia E2E se ejecute de forma reproducible

**⚠️ CRITICAL**: Ninguna historia de usuario inicia antes de completar esta fase

- [X] T007 Definir convenciones de datos de prueba (prefijos y limpieza funcional) en frontend/cypress/support/test-data.ts
- [X] T008 [P] Implementar comando reusable de autenticación para Cypress en frontend/cypress/support/commands.ts
- [X] T009 [P] Configurar utilidades de navegación segura por rutas privadas en frontend/cypress/support/navigation.ts
- [X] T010 [P] Crear fixtures base de credenciales y datos mínimos en frontend/cypress/fixtures/auth.json
- [X] T011 [P] Crear fixtures base para empleados/departamentos en frontend/cypress/fixtures/entities.json
- [X] T012 Documentar precondiciones de ejecución E2E y orden de arranque en specs/005-cypress-e2e/quickstart.md
- [X] T013 Registrar contrato de cobertura E2E en specs/005-cypress-e2e/contracts/cypress-e2e-coverage.md
- [X] T014 Agregar comando de evidencia/reporte de ejecución en frontend/package.json
- [X] T050 [P] Declarar tempranamente impacto OpenAPI/Swagger (sin cambios o cambios requeridos) en specs/005-cypress-e2e/contracts/cypress-e2e-coverage.md
- [X] T051 [P] Definir tempranamente matriz de autorización por endpoint/recurso (método, ruta, auth, rol, 401/403) en specs/005-cypress-e2e/contracts/cypress-e2e-coverage.md
- [X] T052 [P] Registrar evidencia temprana de FR-006 en quickstart (resultado OpenAPI/Swagger) en specs/005-cypress-e2e/quickstart.md

**Checkpoint**: Base Cypress lista para implementar historias por prioridad

---

## Phase 3: User Story 1 - Validar Acceso Seguro Inicial (Priority: P1) 🎯 MVP

**Goal**: Validar login, fallo de login y protección de rutas privadas sin sesión

**Independent Test**: Ejecutar solo spec de auth y confirmar éxito en login válido, error visible en login inválido y redirección a login desde ruta privada sin sesión.

### Tests for User Story 1

- [X] T015 [P] [US1] Crear escenario E2E de login exitoso en frontend/cypress/e2e/auth/login-success.cy.ts
- [X] T016 [P] [US1] Crear escenario E2E de login inválido en frontend/cypress/e2e/auth/login-invalid.cy.ts
- [X] T017 [P] [US1] Crear escenario E2E de acceso a ruta privada sin sesión en frontend/cypress/e2e/auth/private-route-guard.cy.ts

### Implementation for User Story 1

- [X] T018 [US1] Implementar helpers de auth reutilizables para specs de US1 en frontend/cypress/support/auth-helpers.ts
- [X] T019 [US1] Ajustar selectores de estabilidad para página login en frontend/cypress/support/selectors.ts
- [X] T020 [US1] Crear suite agrupadora de auth para ejecución selectiva en frontend/cypress/e2e/auth/_auth-suite.cy.ts
- [X] T021 [US1] Documentar comando de ejecución independiente de US1 en specs/005-cypress-e2e/quickstart.md

**Checkpoint**: US1 funcional y demostrable de forma independiente

---

## Phase 4: User Story 2 - Validar Flujos CRUD Críticos (Priority: P2)

**Goal**: Validar CRUD crítico de empleados y departamentos con paginación

**Independent Test**: Ejecutar specs de CRUD (empleados/departamentos) y confirmar alta, edición, eliminación crítica y navegación paginada.

### Tests for User Story 2

- [X] T022 [P] [US2] Crear escenario E2E de CRUD crítico de departamentos en frontend/cypress/e2e/departamentos/departamentos-crud.cy.ts
- [X] T023 [P] [US2] Crear escenario E2E de paginación en departamentos en frontend/cypress/e2e/departamentos/departamentos-pagination.cy.ts
- [X] T024 [P] [US2] Crear escenario E2E de CRUD crítico de empleados en frontend/cypress/e2e/empleados/empleados-crud.cy.ts
- [X] T025 [P] [US2] Crear escenario E2E de paginación en empleados en frontend/cypress/e2e/empleados/empleados-pagination.cy.ts

### Implementation for User Story 2

- [X] T026 [US2] Implementar helpers de CRUD de departamentos para Cypress en frontend/cypress/support/departamentos-helpers.ts
- [X] T027 [US2] Implementar helpers de CRUD de empleados para Cypress en frontend/cypress/support/empleados-helpers.ts
- [X] T028 [US2] Añadir estrategia de datos únicos por corrida en frontend/cypress/support/test-data.ts
- [X] T029 [US2] Crear suite agrupadora de CRUD para ejecución selectiva en frontend/cypress/e2e/crud/_crud-suite.cy.ts
- [X] T030 [US2] Documentar comando de ejecución independiente de US2 en specs/005-cypress-e2e/quickstart.md

**Checkpoint**: US2 funcional sin depender de ejecución completa de otras historias

---

## Phase 5: User Story 3 - Validar Manejo de Errores 400/401/409 (Priority: P3)

**Goal**: Validar visual y funcionalmente el manejo de errores backend críticos

**Independent Test**: Ejecutar specs de errores y confirmar mapeo visible correcto para 400, 401 y 409.

### Tests for User Story 3

- [X] T031 [P] [US3] Crear escenario E2E de error 400 por validación en frontend/cypress/e2e/errors/error-400-validation.cy.ts
- [X] T032 [P] [US3] Crear escenario E2E de error 401 por sesión inválida/expirada en frontend/cypress/e2e/errors/error-401-unauthorized.cy.ts
- [X] T033 [P] [US3] Crear escenario E2E de error 409 por conflicto de negocio en frontend/cypress/e2e/errors/error-409-conflict.cy.ts

### Implementation for User Story 3

- [X] T034 [US3] Implementar utilidades de verificación de banners/mensajes de error en frontend/cypress/support/error-helpers.ts
- [X] T035 [US3] Configurar manejo de sesión para escenario 401 en comandos Cypress en frontend/cypress/support/commands.ts
- [X] T036 [US3] Crear suite agrupadora de errores para ejecución selectiva en frontend/cypress/e2e/errors/_errors-suite.cy.ts
- [X] T037 [US3] Documentar comando de ejecución independiente de US3 en specs/005-cypress-e2e/quickstart.md

**Checkpoint**: US3 funcional y validable sin ejecutar todas las demás suites

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de calidad, trazabilidad y ejecución integral

- [X] T038 [P] Consolidar reporte de ejecución E2E (casos ejecutados/aprobados/fallidos) en specs/005-cypress-e2e/quickstart.md
- [X] T039 [P] Ajustar documentación de cobertura mínima y exclusiones en specs/005-cypress-e2e/contracts/cypress-e2e-coverage.md
- [X] T040 Ejecutar validación local de comando integral E2E y registrar evidencia final en specs/005-cypress-e2e/quickstart.md
- [X] T041 Ejecutar validación en entorno Docker (postgres + app + frontend) para E2E y registrar evidencia final en specs/005-cypress-e2e/quickstart.md
- [X] T042 Registrar evidencia final de cumplimiento SC-001..SC-005 en specs/005-cypress-e2e/quickstart.md
- [X] T043 [P] Validar cumplimiento constitucional de la feature con checklist explícito en specs/005-cypress-e2e/quickstart.md
- [X] T044 [P] Realizar reconciliación final y documentar impacto OpenAPI/Swagger (sin cambios o cambios requeridos) en specs/005-cypress-e2e/contracts/cypress-e2e-coverage.md
- [X] T045 [P] Realizar reconciliación final de la matriz de autorización por endpoint/recurso (método, ruta, auth, rol, 401/403) en specs/005-cypress-e2e/contracts/cypress-e2e-coverage.md
- [X] T046 [P] Confirmar y documentar no impacto en PostgreSQL/Flyway (sin esquema nuevo y sin migraciones nuevas) en specs/005-cypress-e2e/quickstart.md
- [X] T047 Registrar verificación explícita de "sin cambios de lógica de negocio" en specs/005-cypress-e2e/quickstart.md
- [X] T048 Revisar y aprobar evidencia de validación local (producida en T040) como gate de salida en specs/005-cypress-e2e/quickstart.md
- [X] T049 Revisar y aprobar evidencia de validación Docker (producida en T041) como gate de salida en specs/005-cypress-e2e/quickstart.md
- [X] T053 Ejecutar y registrar validación de pruebas unitarias/integración críticas (auth y acceso PostgreSQL) como gate constitucional en specs/005-cypress-e2e/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3-5)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on completion of US1, US2, US3

### User Story Dependencies

- **US1 (P1)**: Puede iniciar inmediatamente después de Foundational
- **US2 (P2)**: Depende de Foundational y reutiliza autenticación establecida en US1
- **US3 (P3)**: Depende de Foundational y de escenarios base de auth/CRUD para forzar errores de negocio de manera controlada

### Within Each User Story

- Especificaciones E2E primero
- Helpers/comandos de soporte después
- Suite agregada y documentación de ejecución al final de la historia

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005
- **Phase 2**: T008, T009, T010, T011, T050, T051, T052
- **US1**: T015, T016, T017
- **US2**: T022, T023, T024, T025
- **US3**: T031, T032, T033
- **Phase 6**: T038, T039, T043, T044, T045, T046

---

## Parallel Example: User Story 1

```bash
Task: "T015 [US1] Login exitoso"
Task: "T016 [US1] Login inválido"
Task: "T017 [US1] Ruta privada sin sesión"
```

## Parallel Example: User Story 2

```bash
Task: "T022 [US2] CRUD departamentos"
Task: "T024 [US2] CRUD empleados"
Task: "T023 [US2] Paginación departamentos"
Task: "T025 [US2] Paginación empleados"
```

## Parallel Example: User Story 3

```bash
Task: "T031 [US3] Error 400"
Task: "T032 [US3] Error 401"
Task: "T033 [US3] Error 409"
```

---

## Implementation Strategy

### MVP First (US1)

1. Completar Phase 1
2. Completar Phase 2
3. Completar US1
4. Validar flujo de autenticación/rutas privadas de forma independiente

### Incremental Delivery

1. Entregar US1 (auth crítica)
2. Entregar US2 (CRUD críticos)
3. Entregar US3 (errores críticos)
4. Cerrar con Polish + evidencia

### Parallel Team Strategy

1. Equipo base completa Setup + Foundational
2. Luego paralelo por historia:
   - Dev A: US1
   - Dev B: US2
   - Dev C: US3
3. Integración final en Phase 6

---

## Requirements Traceability

- **FR-001**: T001, T006, T014
- **FR-002**: T015, T016, T017
- **FR-003**: T024, T027
- **FR-004**: T022, T026
- **FR-005**: T023, T025
- **FR-006**: T050, T052, T044
- **FR-007**: T051, T045
- **FR-008**: T046
- **FR-009**: T013, T043
- **FR-010**: T017, T018, T035
- **FR-011**: T031, T032, T033, T034
- **FR-012**: T006, T040, T041
- **FR-013**: T012, T021, T030, T037
- **FR-014**: T038, T042

## Constitution Traceability

- **Workflow Gate 3 (tests unitarias/integración críticas)**: T053
