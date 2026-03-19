# Tasks: Autenticación de Empleados

**Input**: Design documents from `/specs/002-autenticacion-empleados-correo/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Se incluyen pruebas críticas de autenticación, autorización, expiración de token, contrato de errores y actualización de credenciales para cumplir constitución.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar dependencias y configuración base de autenticación JWT

- [X] T001 Agregar dependencia JWT compatible con Spring Security en pom.xml
- [X] T002 [P] Añadir configuración JWT base (secret y expiración) en src/main/resources/application.yml
- [X] T003 [P] Definir variables de entorno JWT en .env.example
- [X] T004 [P] Propagar variables JWT para ejecución local en docker/docker-compose.yml
- [X] T005 Crear estructura base de seguridad en src/main/java/com/dsw02/practica01/common/security/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura compartida de seguridad, persistencia y auditoría

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Crear migración para correo y hash de contraseña en src/main/resources/db/migration/V2__auth_empleados.sql
- [X] T007 [P] Implementar propiedades tipadas de JWT en src/main/java/com/dsw02/practica01/common/security/JwtProperties.java
- [X] T008 [P] Implementar emisión/validación de JWT en src/main/java/com/dsw02/practica01/common/security/JwtService.java
- [X] T009 [P] Implementar filtro JWT para SecurityContext en src/main/java/com/dsw02/practica01/common/security/JwtAuthenticationFilter.java
- [X] T010 Configurar cadena base de seguridad (stateless + filtro JWT) en src/main/java/com/dsw02/practica01/common/security/SecurityConfig.java
- [X] T011 [P] Crear DTOs de login en src/main/java/com/dsw02/practica01/empleados/dto/LoginRequest.java y src/main/java/com/dsw02/practica01/empleados/dto/LoginResponse.java
- [X] T012 [P] Crear entidad de eventos de autenticación en src/main/java/com/dsw02/practica01/empleados/domain/EventoAutenticacion.java
- [X] T013 [P] Crear repositorio de eventos de autenticación en src/main/java/com/dsw02/practica01/empleados/repository/EventoAutenticacionRepository.java

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Iniciar sesión por correo (Priority: P1) 🎯 MVP

**Goal**: Permitir login por correo/contraseña y emisión de JWT con políticas de error estandarizadas

**Independent Test**: Login válido devuelve token; credenciales incorrectas y validaciones inválidas devuelven error con contrato `{code,message,timestamp}`.

### Tests for User Story 1

- [X] T014 [P] [US1] Crear prueba de login válido y credenciales incorrectas verificando `AUTH_INVALID_CREDENTIALS` en src/test/java/com/dsw02/practica01/integration/AuthLoginIntegrationTest.java
- [X] T015 [P] [US1] Crear prueba de correo inválido/contraseña vacía verificando `AUTH_VALIDATION_ERROR` en src/test/java/com/dsw02/practica01/integration/AuthLoginValidationIntegrationTest.java
- [X] T016 [P] [US1] Crear prueba de contrato de error `{code,message,timestamp}` para login en src/test/java/com/dsw02/practica01/integration/AuthErrorContractIntegrationTest.java

### Implementation for User Story 1

- [X] T017 [P] [US1] Agregar campo de correo único en src/main/java/com/dsw02/practica01/empleados/domain/Empleado.java
- [X] T018 [P] [US1] Agregar campo de hash de contraseña en src/main/java/com/dsw02/practica01/empleados/domain/Empleado.java
- [X] T019 [P] [US1] Añadir consulta por correo en src/main/java/com/dsw02/practica01/empleados/repository/EmpleadoRepository.java
- [X] T020 [US1] Implementar autenticación por correo/password con SHA-256 en src/main/java/com/dsw02/practica01/empleados/service/AuthService.java
- [X] T021 [US1] Implementar endpoint POST de login en src/main/java/com/dsw02/practica01/empleados/web/AuthController.java
- [X] T022 [US1] Mapear errores de autenticación sin filtrar detalle interno en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [X] T023 [US1] Estandarizar payload de error de login con `AUTH_INVALID_CREDENTIALS` y `AUTH_VALIDATION_ERROR` en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [X] T024 [US1] Registrar eventos de autenticación exitosa/fallida en src/main/java/com/dsw02/practica01/empleados/service/AuthService.java
- [X] T025 [US1] Validar formato de correo de login con Bean Validation en src/main/java/com/dsw02/practica01/empleados/dto/LoginRequest.java

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Protección de endpoints (Priority: P2)

**Goal**: Garantizar enforcement de rutas protegidas conforme FR-006a

**Independent Test**: `/api/empleados/**` sin token rechaza; con token válido permite; `/api/auth/login` permanece pública.

### Tests for User Story 2

- [X] T026 [P] [US2] Crear prueba de acceso a `/api/empleados/**` sin token y con token válido, validando `/api/auth/login` pública en src/test/java/com/dsw02/practica01/integration/AuthzEndpointIntegrationTest.java
- [X] T027 [P] [US2] Crear prueba de token expirado en src/test/java/com/dsw02/practica01/integration/TokenExpirationIntegrationTest.java

### Implementation for User Story 2

- [X] T028 [US2] Definir en SecurityConfig que `/api/empleados/**` es privado y `/api/auth/login` es público en src/main/java/com/dsw02/practica01/common/security/SecurityConfig.java
- [X] T029 [US2] Aplicar validación de expiración de 60 minutos en src/main/java/com/dsw02/practica01/common/security/JwtService.java
- [X] T030 [US2] Ajustar manejo de token ausente/expirado/inválido en src/main/java/com/dsw02/practica01/common/security/JwtAuthenticationFilter.java
- [X] T031 [US2] Estandarizar respuestas de autorización/autenticación por política en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java
- [X] T032 [US2] Mantener registro de intentos fallidos repetidos sin bloqueo automático en src/main/java/com/dsw02/practica01/empleados/service/AuthService.java

**Checkpoint**: User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Gestión de credenciales de empleado (Priority: P3)

**Goal**: Permitir alta/actualización de credenciales y respetar continuidad de token previo (FR-001b)

**Independent Test**: Tras cambio de credenciales, login siguiente usa credenciales nuevas y token previo emitido sigue válido hasta expirar.

### Tests for User Story 3

- [ ] T033 [P] [US3] Crear prueba de actualización de credenciales y login posterior exitoso en src/test/java/com/dsw02/practica01/integration/CredentialUpdateIntegrationTest.java
- [ ] T034 [P] [US3] Crear prueba de continuidad de token previo tras cambio de credenciales (FR-001b) en src/test/java/com/dsw02/practica01/integration/TokenContinuityAfterCredentialChangeIntegrationTest.java
- [ ] T035 [P] [US3] Crear prueba de correo duplicado y formato inválido en gestión de credenciales en src/test/java/com/dsw02/practica01/integration/CredentialValidationIntegrationTest.java

### Implementation for User Story 3

- [X] T036 [P] [US3] Crear DTO de alta/actualización de credenciales en src/main/java/com/dsw02/practica01/empleados/dto/CredencialEmpleadoRequest.java
- [X] T037 [US3] Implementar actualización de correo/hash de contraseña en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T038 [US3] Validar unicidad de correo en alta/actualización en src/main/java/com/dsw02/practica01/empleados/service/EmpleadoService.java
- [X] T039 [US3] Implementar endpoint de gestión de credenciales en src/main/java/com/dsw02/practica01/empleados/web/EmpleadoController.java
- [X] T040 [US3] Validar formato de correo en DTO de credenciales en src/main/java/com/dsw02/practica01/empleados/dto/CredencialEmpleadoRequest.java
- [X] T041 [US3] Mapear conflicto por correo duplicado y validaciones de entrada en src/main/java/com/dsw02/practica01/common/web/GlobalExceptionHandler.java

**Checkpoint**: User Story 3 should be fully functional and testable independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre documental, métricas y validación transversal

- [ ] T042 [P] Documentar quickstart de login JWT y uso de token en specs/002-autenticacion-empleados-correo/quickstart.md
- [ ] T043 [P] Documentar contrato OpenAPI de login y seguridad Bearer con ejemplos request/response y errores 400/401/403/409 en specs/002-autenticacion-empleados-correo/contracts/auth.openapi.yaml
- [ ] T044 [P] Validar en OpenAPI esquema BearerAuth y respuestas por endpoint protegido en specs/002-autenticacion-empleados-correo/contracts/auth.openapi.yaml
- [X] T045 Ejecutar validación de build y pruebas con ./mvnw clean test en pom.xml
- [ ] T046 Verificar ejecución en Docker con variables JWT en docker/docker-compose.yml
- [ ] T047 Ejecutar verificación de SC-001 (100 intentos, 95% éxito y p95 < 500 ms) en specs/002-autenticacion-empleados-correo/quickstart.md
- [ ] T048 Ejecutar verificación de SC-002 con códigos de error AUTH_VALIDATION_ERROR y AUTH_INVALID_CREDENTIALS en specs/002-autenticacion-empleados-correo/quickstart.md
- [ ] T049 Ejecutar verificación de SC-003 sobre `/api/empleados/**` (rechazo sin token) y `/api/auth/login` (acceso público) en specs/002-autenticacion-empleados-correo/quickstart.md
- [ ] T050 Ejecutar verificación de SC-004 (cambio de credenciales visible en siguiente login) en specs/002-autenticacion-empleados-correo/quickstart.md
- [ ] T051 Documentar evidencia final de SC-001, SC-002, SC-003 y SC-004 en specs/002-autenticacion-empleados-correo/quickstart.md
- [X] T052 [P] Crear pruebas unitarias de JWT (emisión/validación/expiración) en src/test/java/com/dsw02/practica01/unit/security/JwtServiceTest.java
- [ ] T053 [P] Documentar impacto de esquema PostgreSQL y estrategia de migración/rollback para autenticación en specs/002-autenticacion-empleados-correo/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on completed user stories

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational and delivers MVP login
- **US2 (P2)**: Can start after Foundational; depends on security base and token support
- **US3 (P3)**: Can start after Foundational; reuses servicios y entidades de empleados

### Within Each User Story

- Tests first (if defined) → models/DTOs → services → endpoints → error mapping
- Each story remains independently testable

### Parallel Opportunities

- **Setup**: T002, T003, T004
- **Foundational**: T007, T008, T009, T011, T012, T013
- **US1**: T014, T015, T016, T017, T018, T019
- **US2**: T026, T027
- **US3**: T033, T034, T035, T036

---

## Parallel Example: User Story 1

```bash
Task: "T014 [US1] Probar login válido/inválido"
Task: "T015 [US1] Probar validaciones de login"
Task: "T016 [US1] Agregar correo único en Empleado"
```

## Parallel Example: User Story 2

```bash
Task: "T026 [US2] Probar acceso con/sin token"
Task: "T027 [US2] Probar token expirado"
```

## Parallel Example: User Story 3

```bash
Task: "T033 [US3] Probar actualización de credenciales"
Task: "T034 [US3] Probar continuidad de token previo"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: login válido/inválido + contrato de error + token 60 min
5. Demo MVP

### Incremental Delivery

1. Foundation ready (Phase 1 + 2)
2. Deliver US1 (login + contrato de error)
3. Deliver US2 (protección de endpoints)
4. Deliver US3 (gestión de credenciales + FR-001b)
5. Polish and final verification

### Suggested MVP Scope

- User Story 1 only (Phase 3) after foundational completion
