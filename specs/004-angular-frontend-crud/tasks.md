# Tasks: Feature 004 - Frontend Angular CRUD Empleados/Departamentos

**Input**: Design documents from `/specs/004-angular-frontend-crud/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Se incluyen pruebas porque la especificación exige validación explícita de login/JWT/guards, paginación y manejo de errores `400/401/409`.

**Organization**: Las tareas están agrupadas por historia de usuario para permitir implementación y validación independiente por incremento.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: US1, US2, US3 para trazabilidad de historias
- Todas las tareas incluyen ruta de archivo exacta

## Phase 1: Setup (Frontend Base)

**Purpose**: Inicializar el proyecto Angular sin modificar backend existente

- [x] T001 Crear proyecto Angular base en frontend/ (estructura inicial y configuración de workspace)
- [ ] T002 [P] Configurar scripts de desarrollo/test/lint en frontend/package.json
- [x] T003 [P] Definir configuración de entorno API (`apiBaseUrl`) en frontend/src/environments/environment.ts y frontend/src/environments/environment.prod.ts
- [x] T004 [P] Crear archivo de configuración de API en frontend/src/app/core/config/api.config.ts
- [x] T005 Crear routing base de aplicación en frontend/src/app/app.routes.ts con rutas públicas/privadas placeholder
- [x] T006 Crear layout base autenticado con navegación y logout en frontend/src/app/shared/ui/app-layout.component.ts
- [x] T007 [P] Crear estructura de carpetas por feature/core/shared en frontend/src/app/

---

## Phase 2: Foundational (Bloqueantes)

**Purpose**: Infraestructura transversal obligatoria antes de cualquier CRUD

**⚠️ CRITICAL**: Ninguna historia de usuario inicia antes de completar esta fase

- [x] T008 Crear modelos compartidos de autenticación, paginación y errores en frontend/src/app/core/http/api.models.ts
- [x] T009 [P] Implementar almacenamiento de sesión (`SessionStore`) en frontend/src/app/core/auth/session.store.ts
- [x] T010 [P] Implementar servicio de autenticación base (`AuthService`) en frontend/src/app/core/auth/auth.service.ts
- [x] T011 [P] Implementar guard de rutas privadas (`AuthGuard`) en frontend/src/app/core/auth/auth.guard.ts
- [x] T012 [P] Implementar interceptor JWT para Bearer token en frontend/src/app/core/http/jwt.interceptor.ts
- [x] T013 [P] Implementar mapeador global de errores HTTP (`ApiErrorMapper`) en frontend/src/app/core/http/api-error.mapper.ts
- [x] T014 Implementar cliente HTTP base con prefijo `/api` en frontend/src/app/core/http/api-client.service.ts
- [x] T015 Configurar providers globales de `HttpClient` e interceptor en frontend/src/app/app.config.ts
- [x] T016 Crear componente reutilizable de errores API en frontend/src/app/shared/ui/api-error-banner.component.ts
- [x] T017 Crear componente reutilizable de paginación en frontend/src/app/shared/ui/pagination.component.ts
- [x] T018 Configurar redirección global a `/login` ante `401` (limpieza de sesión) en frontend/src/app/core/http/jwt.interceptor.ts
- [x] T019 Registrar rutas privadas con guard y fallback de navegación en frontend/src/app/app.routes.ts
- [ ] T020 Documentar explícitamente restricción de no cambios backend/API en specs/004-angular-frontend-crud/quickstart.md

**Checkpoint**: Base lista (auth + guard + interceptor + errores + paginación compartida)

---

## Phase 3: User Story 1 - Login y Navegación Segura (Priority: P1) 🎯 MVP

**Goal**: Permitir login por `/api/auth/login`, mantener sesión JWT y proteger navegación privada

**Independent Test**: Login válido habilita rutas privadas; sin token o con `401` redirige a `/login`.

### Tests for User Story 1

- [x] T021 [P] [US1] Crear pruebas unitarias de `SessionStore` (set/get/clear token) en frontend/src/app/core/auth/session.store.spec.ts
- [x] T022 [P] [US1] Crear pruebas unitarias de `AuthGuard` (allow/redirect) en frontend/src/app/core/auth/auth.guard.spec.ts
- [x] T023 [P] [US1] Crear pruebas unitarias de `JwtInterceptor` (adjunta Bearer y maneja `401`) en frontend/src/app/core/http/jwt.interceptor.spec.ts
- [x] T024 [P] [US1] Crear pruebas de integración HTTP para login en frontend/src/app/core/auth/auth.service.spec.ts
- [x] T025 [US1] Crear prueba E2E de flujo login exitoso y acceso a `/empleados` en frontend/tests/e2e/auth-login.e2e.ts
- [x] T026 [US1] Crear prueba E2E de redirección a `/login` sin token en frontend/tests/e2e/auth-guard.e2e.ts

### Implementation for User Story 1

- [x] T027 [US1] Implementar página de login en frontend/src/app/features/login/login-page.component.ts
- [x] T028 [US1] Implementar formulario reactivo de login en frontend/src/app/features/login/login-form.component.ts
- [x] T029 [US1] Conectar `login-page` con `AuthService.login()` y navegación post-login en frontend/src/app/features/login/login-page.component.ts
- [x] T030 [US1] Implementar acción de logout en layout autenticado en frontend/src/app/shared/ui/app-layout.component.ts
- [x] T031 [US1] Completar rutas finales de login y privadas en frontend/src/app/app.routes.ts

**Checkpoint**: US1 funcional y demostrable de forma independiente

---

## Phase 4: User Story 3 - CRUD de Departamentos en UI (Priority: P3)

**Goal**: Listar/crear/editar/eliminar departamentos con paginación y manejo de conflicto `409`

**Independent Test**: CRUD de departamentos funciona con `/api/v2/departamentos` y muestra conflicto al eliminar con asociados.

### Tests for User Story 3

- [x] T032 [P] [US3] Crear pruebas unitarias de `DepartamentosService` (CRUD + paginación) en frontend/src/app/features/departamentos/departamentos.service.spec.ts
- [x] T033 [P] [US3] Crear pruebas de componente para listado paginado de departamentos en frontend/src/app/features/departamentos/departamentos-list-page.component.spec.ts
- [x] T034 [P] [US3] Crear pruebas de formulario de departamento en frontend/src/app/features/departamentos/departamento-form-page.component.spec.ts
- [x] T035 [US3] Crear prueba E2E de CRUD de departamentos en frontend/tests/e2e/departamentos-crud.e2e.ts
- [x] T036 [US3] Crear prueba E2E de conflicto `409` al eliminar departamento con asociados en frontend/tests/e2e/departamentos-conflict.e2e.ts

### Implementation for User Story 3

- [x] T037 [P] [US3] Definir modelos DTO/ViewModel de departamentos en frontend/src/app/features/departamentos/departamentos.models.ts
- [x] T038 [US3] Implementar servicio HTTP de departamentos en frontend/src/app/features/departamentos/departamentos.service.ts
- [x] T039 [US3] Implementar página de listado paginado de departamentos en frontend/src/app/features/departamentos/departamentos-list-page.component.ts
- [x] T040 [US3] Implementar página de formulario (crear/editar) de departamento en frontend/src/app/features/departamentos/departamento-form-page.component.ts
- [x] T041 [US3] Integrar manejo visual de `409` por eliminación con asociados en frontend/src/app/features/departamentos/departamentos-list-page.component.ts
- [x] T042 [US3] Agregar rutas `/departamentos`, `/departamentos/nuevo`, `/departamentos/:clave/editar` en frontend/src/app/app.routes.ts

**Checkpoint**: US3 funcional con paginación y conflicto `409` validado

---

## Phase 5: User Story 2 - CRUD de Empleados en UI (Priority: P2)

**Goal**: Listar/crear/editar/eliminar empleados con paginación y `departamentoClave` obligatorio

**Independent Test**: CRUD de empleados funciona con `/api/v2/empleados`, paginación activa y manejo visible de `400/401/409`.

### Tests for User Story 2

- [x] T043 [P] [US2] Crear pruebas unitarias de `EmpleadosService` (CRUD + paginación) en frontend/src/app/features/empleados/empleados.service.spec.ts
- [x] T044 [P] [US2] Crear pruebas de componente para listado paginado de empleados en frontend/src/app/features/empleados/empleados-list-page.component.spec.ts
- [x] T045 [P] [US2] Crear pruebas de formulario de empleado (`departamentoClave` obligatorio) en frontend/src/app/features/empleados/empleado-form-page.component.spec.ts
- [x] T046 [US2] Crear prueba E2E de alta/edición/baja de empleado en frontend/tests/e2e/empleados-crud.e2e.ts
- [x] T047 [US2] Crear prueba E2E de error `400` y `409` en flujo de empleados en frontend/tests/e2e/empleados-errors.e2e.ts

### Implementation for User Story 2

- [x] T048 [P] [US2] Definir modelos DTO/ViewModel de empleados en frontend/src/app/features/empleados/empleados.models.ts
- [x] T049 [US2] Implementar servicio HTTP de empleados en frontend/src/app/features/empleados/empleados.service.ts
- [x] T050 [US2] Implementar página de listado paginado de empleados en frontend/src/app/features/empleados/empleados-list-page.component.ts
- [x] T051 [US2] Implementar página de formulario (crear/editar) de empleado en frontend/src/app/features/empleados/empleado-form-page.component.ts
- [x] T052 [US2] Agregar validadores reactivos de `departamentoClave` obligatorio en frontend/src/app/shared/forms/validators.ts
- [x] T053 [US2] Integrar mapeo visual de errores `400/409` en vistas de empleados usando frontend/src/app/shared/ui/api-error-banner.component.ts
- [x] T054 [US2] Agregar rutas `/empleados`, `/empleados/nuevo`, `/empleados/:clave/editar` en frontend/src/app/app.routes.ts

**Checkpoint**: US2 funcional sin cambios de backend ni endpoints nuevos

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de calidad, documentación y validación integral de frontend

- [x] T055 [P] Ejecutar y ajustar lint del frontend en frontend/package.json
- [x] T056 [P] Ejecutar suite unitaria de frontend en frontend/package.json
- [x] T057 Ejecutar pruebas E2E de flujos críticos auth+empleados+departamentos en frontend/package.json
- [ ] T058 Verificar manualmente redirección a `/login` al expirar token en frontend/tests/e2e/auth-guard.e2e.ts
- [x] T059 Verificar consumo exclusivo de `/api/auth/login` y `/api/v2/**` en frontend/src/app/core/http/api-client.service.ts
- [ ] T060 Ejecutar validación local en Docker (backend + PostgreSQL) y smoke test end-to-end (login, rutas protegidas, CRUD de empleados y CRUD de departamentos) antes de merge; registrar evidencia en specs/004-angular-frontend-crud/quickstart.md
- [x] T061 Ejecutar validación métrica de rendimiento de primera carga en entorno local (<3s) y registrar evidencia en specs/004-angular-frontend-crud/quickstart.md
- [x] T062 Actualizar guía de ejecución/validación de frontend en specs/004-angular-frontend-crud/quickstart.md
- [ ] T063 Documentar evidencia consolidada de cumplimiento SC-001..SC-005 + validación Docker + validación métrica en specs/004-angular-frontend-crud/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sin dependencias
- **Phase 2 (Foundational)**: depende de Phase 1 y bloquea todas las historias
- **Phase 3 (US1)**: depende de Phase 2
- **Phase 4 (US3)**: depende de Phase 3
- **Phase 5 (US2)**: depende de Phase 4 por dependencia funcional de `departamentoClave`
- **Phase 6 (Polish)**: depende de cierre de US1, US2 y US3

### User Story Dependencies

- **US1 (P1)**: base de autenticación y navegación privada, sin dependencia de otras historias
- **US3 (P3)**: requiere auth estable de US1; consume solo backend existente de departamentos
- **US2 (P2)**: requiere auth estable de US1 y catálogo de departamentos funcional (US3) por obligatoriedad de `departamentoClave`

### Within Each User Story

- Pruebas primero (deben fallar inicialmente)
- Modelos/servicios antes de páginas
- Páginas antes de rutas finales
- Historia completa y verificable antes de pasar a la siguiente

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T007
- **Phase 2**: T009, T010, T011, T012, T013
- **US1**: T021, T022, T023, T024
- **US3**: T032, T033, T034
- **US2**: T043, T044, T045
- **Phase 6**: T055, T056

---

## Parallel Example: User Story 1

```bash
Task: "T021 [US1] Pruebas unitarias SessionStore"
Task: "T022 [US1] Pruebas unitarias AuthGuard"
Task: "T023 [US1] Pruebas unitarias JwtInterceptor"
```

## Parallel Example: User Story 2

```bash
Task: "T043 [US2] Pruebas unitarias EmpleadosService"
Task: "T044 [US2] Pruebas de listado paginado de empleados"
Task: "T045 [US2] Pruebas de formulario empleado"
```

## Parallel Example: User Story 3

```bash
Task: "T032 [US3] Pruebas unitarias DepartamentosService"
Task: "T033 [US3] Pruebas de listado paginado de departamentos"
Task: "T034 [US3] Pruebas de formulario departamento"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Completar Setup + Foundational
2. Completar US1 (login + guard + sesión + redirección por `401`)
3. Validar US1 de forma independiente

### Incremental Delivery

1. Entregar US1
2. Entregar US3
3. Entregar US2
4. Ejecutar polish final y evidencias de criterios de éxito

### Safety Constraints

- No modificar archivos de backend bajo `src/main/java` ni migraciones backend
- No crear endpoints nuevos ni consumir `/api/v3/**`
- Consumir exclusivamente `/api/auth/login` y `/api/v2/**`
