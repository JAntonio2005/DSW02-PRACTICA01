# Implementation Plan: Frontend Angular CRUD de Empleados y Departamentos

**Branch**: `[004-angular-frontend-crud]` | **Date**: 2026-03-19 | **Spec**: `/specs/004-angular-frontend-crud/spec.md`
**Input**: Feature specification from `/specs/004-angular-frontend-crud/spec.md`

## Summary

Construir el frontend web oficial en Angular para autenticación y operación de CRUD de empleados y departamentos sobre el backend existente, consumiendo exclusivamente `POST /api/auth/login` y `/api/v2/**`. La implementación se centra en: rutas privadas con guard, interceptor JWT, gestión de sesión en cliente, formularios reactivos con validaciones alineadas al backend, paginación en listados y manejo consistente de errores `400/401/409`, sin modificar contratos ni reglas de negocio del backend.

## Technical Context

**Language/Version**: TypeScript + Angular (versión requerida por asignatura; referencia Angular 22 LTS académica)  
**Primary Dependencies**: Angular Router, Angular HttpClient, RxJS, Angular Forms (Reactive Forms)  
**Storage**: Session storage del navegador para JWT en cliente; backend mantiene PostgreSQL + Flyway (sin cambios)  
**Testing**: Angular unit/component tests (Jasmine/Karma) + pruebas de integración HTTP con `HttpTestingController`; pruebas E2E de flujos críticos (login/guards/CRUD/error handling)  
**Target Platform**: Web SPA en navegador moderno (desktop-first para entorno académico)
**Project Type**: Web application (frontend separado consumiendo backend REST existente)  
**Performance Goals**: Primera carga funcional < 3s en entorno local; navegación entre listados/formularios sin recarga completa; paginación responsiva  
**Constraints**: No crear API v3; no modificar backend ni contratos OpenAPI existentes; consumir solo `/api/auth/login` y `/api/v2/**`; cubrir errores `400/401/409`  
**Scale/Scope**: 7 pantallas mínimas (login + 3 empleados + 3 departamentos), 2 módulos CRUD con paginación, autenticación JWT completa en cliente

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Stack gate: Backend se mantiene en Spring Boot 3.x + Java 17 sin cambios; frontend agregado en Angular conforme constitución.
- [x] Security gate: Login por `/api/auth/login`, guard para rutas privadas, interceptor Bearer y logout forzado ante `401`.
- [x] Data gate: Persistencia backend sigue en PostgreSQL + Flyway existentes; frontend no altera esquema ni migraciones.
- [x] Container gate: Se conserva Dockerfile/backend compose existente y el cierre de la feature incluye validación local en Docker (backend + base de datos) antes de merge.
- [x] API contract gate: Integración se alinea al OpenAPI existente (`/api/auth/login`, `/api/v2/empleados`, `/api/v2/departamentos`) sin cambios de contrato.
- [x] Quality gate: Plan incluye pruebas unitarias/componentes, HTTP mocking, guard/interceptor y escenarios de error `400/401/409`.
- [x] Frontend gate (if applicable): Cliente web en Angular según versión académica requerida.
- [x] Frontend security gate (if applicable): Consumo exclusivo API oficial, JWT en cliente, rutas privadas protegidas y mapeo explícito de errores backend.

## Project Structure

### Documentation (this feature)

```text
specs/004-angular-frontend-crud/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
```text
src/                                # backend existente (sin cambios por esta feature)

frontend/                           # nuevo proyecto Angular
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── session.store.ts
│   │   │   ├── http/
│   │   │   │   ├── api-client.service.ts
│   │   │   │   ├── jwt.interceptor.ts
│   │   │   │   └── api-error.mapper.ts
│   │   │   └── config/
│   │   │       └── api.config.ts
│   │   ├── features/
│   │   │   ├── login/
│   │   │   │   ├── login-page.component.ts
│   │   │   │   └── login-form.component.ts
│   │   │   ├── empleados/
│   │   │   │   ├── empleados-list-page.component.ts
│   │   │   │   ├── empleado-form-page.component.ts
│   │   │   │   ├── empleados.service.ts
│   │   │   │   └── empleados.models.ts
│   │   │   └── departamentos/
│   │   │       ├── departamentos-list-page.component.ts
│   │   │       ├── departamento-form-page.component.ts
│   │   │       ├── departamentos.service.ts
│   │   │       └── departamentos.models.ts
│   │   ├── shared/
│   │   │   ├── ui/
│   │   │   │   ├── app-layout.component.ts
│   │   │   │   ├── pagination.component.ts
│   │   │   │   └── api-error-banner.component.ts
│   │   │   └── forms/
│   │   │       └── validators.ts
│   │   ├── app.routes.ts
│   │   └── app.component.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.css
└── tests/
  ├── unit/
  ├── integration/
  └── e2e/
```

**Structure Decision**: Se adopta una estructura de aplicación web con frontend Angular aislado en `frontend/`, manteniendo el backend Java existente intacto en `src/`. La organización por `core` (auth/http/config), `features` (login, empleados, departamentos) y `shared` permite aislar responsabilidades, reutilizar componentes de paginación y manejo de error, y asegurar que toda integración HTTP pase por interceptor/mapeador común.

## Implementación Técnica Detallada

### 1) Módulos/Páginas/Componentes

- `LoginPageComponent`: formulario de correo/password; invoca `AuthService.login()` y redirige a `/empleados` al éxito.
- `EmpleadosListPageComponent`: tabla paginada con acciones crear/editar/eliminar.
- `EmpleadoFormPageComponent`: formulario reactivo (crear/editar) con `departamentoClave` obligatorio.
- `DepartamentosListPageComponent`: tabla paginada con acciones crear/editar/eliminar.
- `DepartamentoFormPageComponent`: formulario reactivo (crear/editar).
- `AppLayoutComponent`: navegación y cierre de sesión para rutas privadas.
- Reutilizables: `PaginationComponent`, `ApiErrorBannerComponent`.

### 2) Rutas

- Públicas: `/login`.
- Privadas con `AuthGuard`: `/empleados`, `/empleados/nuevo`, `/empleados/:clave/editar`, `/departamentos`, `/departamentos/nuevo`, `/departamentos/:clave/editar`.
- Ruta por defecto: redirección a `/empleados` si autenticado, en otro caso `/login`.

### 3) Servicios HTTP

- `AuthService`
  - `login(request: LoginRequest): Observable<LoginResponse>` → `POST /api/auth/login`.
  - `logout(): void`.
  - `isAuthenticated(): boolean`.
- `EmpleadosService`
  - `getPage(page, size)` → `GET /api/v2/empleados`.
  - `getByClave(clave)` → `GET /api/v2/empleados/{clave}`.
  - `create(payload)` → `POST /api/v2/empleados`.
  - `update(clave, payload)` → `PUT /api/v2/empleados/{clave}`.
  - `delete(clave)` → `DELETE /api/v2/empleados/{clave}`.
- `DepartamentosService`
  - `getPage(page, size)` → `GET /api/v2/departamentos`.
  - `getByClave(clave)` → `GET /api/v2/departamentos/{clave}`.
  - `create(payload)` → `POST /api/v2/departamentos`.
  - `update(clave, payload)` → `PUT /api/v2/departamentos/{clave}`.
  - `delete(clave)` → `DELETE /api/v2/departamentos/{clave}`.

### 4) Interceptor JWT

- `JwtInterceptor` agrega encabezado `Authorization: Bearer <token>` a toda petición dirigida al backend (`/api/**`) excepto login.
- Ante error `401` en rutas privadas: limpiar sesión + redirección a `/login`.

### 5) Auth Guard y manejo de sesión

- `AuthGuard` bloquea rutas privadas cuando no hay sesión válida.
- `SessionStore` encapsula persistencia del token en `sessionStorage`, lectura inicial en bootstrap y limpieza segura en logout/401.
- Criterio verificable de sesión:
  - token se guarda únicamente en `sessionStorage` al login exitoso,
  - token se elimina en logout explícito,
  - token se elimina al recibir `401` en rutas privadas,
  - no hay persistencia indefinida al cerrar la pestaña/sesión de navegador.

### 6) Modelos/DTO frontend alineados al backend

- `LoginRequest { correo: string; password: string }`
- `LoginResponse { token: string; type?: string }` (usar solo campos que entregue backend real)
- `EmpleadoRequest/Response` alineados a contrato actual, incluyendo `departamentoClave` obligatorio en request.
- `DepartamentoRequest/Response` con campos backend existentes (`clave`, `nombre`, etc., según OpenAPI vigente).
- `PageResponse<T>` para paginación (`content`, `number`, `size`, `totalElements`, `totalPages`).

### 7) Estrategia de formularios

- Formularios reactivos con validación local mínima y mensajes por campo.
- Reglas clave:
  - Login: correo requerido/formato, password requerido.
  - Empleado: `clave`, `nombre`, `direccion`, `telefono`, `departamentoClave` requeridos según backend.
  - Departamento: `clave` y `nombre` requeridos según backend.
- Validaciones backend (`400`) se mapean a errores de formulario y banner general.

### 8) Estrategia de manejo de errores

- `ApiErrorMapper` transforma respuestas backend en mensajes UI consistentes.
- Código a comportamiento:
  - `400`: errores de validación/campos; mostrar detalle por campo cuando exista.
  - `401`: sesión inválida/expirada; logout y redirección a login.
  - `409`: conflicto de negocio (incluye eliminación de departamento con empleados asociados).
- Fallback para otros códigos con mensaje genérico no técnico.

### 9) Estrategia de pruebas

- Unitarias:
  - `AuthService`, `SessionStore`, `AuthGuard`, `JwtInterceptor`, `ApiErrorMapper`.
  - Validadores/form helpers y mapeo DTO↔ViewModel.
- Integración de frontend (HttpClient testing):
  - Flujos login, paginación empleados/departamentos, altas/ediciones/bajas y rutas de error `400/401/409`.
- E2E:
  - Login exitoso/fallido, acceso a rutas privadas, CRUD básico de cada módulo y caso `409` en departamentos.

### 10) Riesgos y mitigación

- Divergencia de DTOs respecto al backend real → mitigación: tipar desde OpenAPI vigente y validar con pruebas de integración HTTP.
- Manejo inconsistente de `401` en múltiples componentes → mitigación: centralizar en interceptor + SessionStore.
- Complejidad en mensajes de error `400` heterogéneos → mitigación: mapper con reglas por estructura de payload.
- Desfase entre paginación UI y backend (`page/size`) → mitigación: adapter `PageResponse` único reutilizable.

### 11) Orden recomendado de implementación

1. Scaffolding Angular + configuración de entornos + routing base.
2. `core/auth` (`SessionStore`, `AuthService`, `AuthGuard`, `JwtInterceptor`).
3. Pantalla de login y flujo de navegación autenticada.
4. Infra HTTP común (`ApiClient`, `ApiErrorMapper`, componentes de error).
5. Módulo de departamentos (listado paginado + form crear/editar + eliminar).
6. Módulo de empleados (listado paginado + form crear/editar + eliminar, con `departamentoClave` obligatorio), dependiente funcionalmente de catálogo de departamentos ya operativo.
7. Pruebas unitarias/integración frontend.
8. Pruebas E2E de flujos críticos y hardening final UX de errores.
9. Validación de cierre en Docker (backend + base de datos) con smoke test de login, rutas protegidas y CRUD UI.
10. Verificación métrica de rendimiento de primera carga (<3s) con evidencia en quickstart.

## Complexity Tracking

No hay violaciones constitucionales que requieran justificación adicional para esta feature.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
