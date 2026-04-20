# Feature Specification: Feature 004 - Frontend Angular CRUD Empleados/Departamentos

**Feature Branch**: `[004-angular-frontend-crud]`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "Frontend web Angular (requerimiento 5): login + CRUD empleados/departamentos consumiendo /api/auth/login y /api/v2 con JWT, guards, paginación y manejo de errores 400/401/409, sin cambios de backend ni API v3"

## Constitution Alignment *(mandatory)*

- Backend implementation MUST mantenerse en Spring Boot 3.x + Java 17 sin cambios de alcance por esta feature.
- La solución MUST agregar frontend web oficial en Angular con versión requerida por la asignatura (Angular 22 LTS como requerimiento académico vigente del profesor).
- El frontend MUST consumir exclusivamente la API oficial ya existente (`/api/auth/login` y `/api/v2/**`) sin crear backend paralelo ni v3.
- El frontend MUST manejar JWT emitido por backend y proteger rutas privadas con guards.
- La UI MUST reflejar errores relevantes de backend (`400`, `401`, `409`) de manera consistente.
- OpenAPI/Swagger existente MUST conservarse como referencia contractual de integración frontend-backend.

## Objective *(mandatory)*

Incorporar un frontend web oficial en Angular para operar login, CRUD de empleados y CRUD de departamentos sobre la API actual existente, sin modificar reglas de negocio backend ni versionado de API, garantizando autenticación JWT en cliente, protección de rutas privadas y manejo visible de errores funcionales.

## Scope *(mandatory)*

### In Scope

- Pantalla de login con correo/password contra `POST /api/auth/login`.
- Layout base autenticado con navegación a módulos de empleados y departamentos.
- Vistas de empleados: listar paginado, crear, editar, eliminar.
- Vistas de departamentos: listar paginado, crear, editar, eliminar.
- Uso obligatorio de `departamentoClave` en formularios de alta/edición de empleado.
- Guards para rutas privadas; redirección automática a login cuando no exista token o sea inválido.
- Manejo UI de errores backend `400`, `401`, `409`.
- Integración con endpoints existentes en `/api/v2/empleados` y `/api/v2/departamentos`.

### Out of Scope

- Crear o modificar endpoints backend fuera del contrato actual.
- Crear `/api/v3`.
- Agregar campos nuevos no existentes en backend para empleados o departamentos.
- Cambiar reglas backend ya implementadas (por ejemplo, conflicto `409` al eliminar departamento con empleados asociados).

## Pantallas mínimas *(mandatory)*

- Login.
- Empleados - listado paginado.
- Empleados - formulario crear.
- Empleados - formulario editar.
- Departamentos - listado paginado.
- Departamentos - formulario crear.
- Departamentos - formulario editar.

## Rutas del frontend *(mandatory)*

- `/login` (pública).
- `/empleados` (privada).
- `/empleados/nuevo` (privada).
- `/empleados/:clave/editar` (privada).
- `/departamentos` (privada).
- `/departamentos/nuevo` (privada).
- `/departamentos/:clave/editar` (privada).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iniciar Sesión y Navegar con Seguridad (Priority: P1)

Como usuario del sistema, quiero iniciar sesión con correo/password para obtener acceso a las secciones privadas del frontend con token JWT válido.

**Why this priority**: Sin autenticación y guards, el resto de funcionalidades no puede usarse de forma segura ni coherente con la constitución.

**Independent Test**: Se valida ejecutando login exitoso, navegación a ruta privada y redirección automática a `/login` cuando no existe token o backend responde `401`.

**Acceptance Scenarios**:

1. **Given** un usuario con credenciales válidas, **When** envía login en `/login`, **Then** el frontend obtiene JWT desde `/api/auth/login`, conserva sesión y permite acceso a rutas privadas.
2. **Given** un usuario sin token o con token inválido, **When** intenta entrar a una ruta privada, **Then** el guard lo redirige a `/login`.
3. **Given** un usuario autenticado, **When** backend responde `401` en una petición privada, **Then** el frontend limpia sesión y redirige a `/login`.

---

### User Story 2 - Gestionar Empleados desde UI (Priority: P2)

Como usuario autenticado, quiero listar, crear, editar y eliminar empleados para operar el catálogo de personal desde el frontend.

**Why this priority**: El CRUD de empleados es parte central del requerimiento académico del frontend.

**Independent Test**: Se valida usando únicamente vistas de empleados con backend real existente, incluyendo paginación y validaciones de formulario/errores.

**Acceptance Scenarios**:

1. **Given** sesión válida, **When** el usuario abre `/empleados`, **Then** visualiza listado paginado consumiendo `/api/v2/empleados`.
2. **Given** sesión válida, **When** crea o edita un empleado, **Then** el formulario exige `departamentoClave` y la operación consume endpoints existentes de empleados.
3. **Given** backend responde `400` por validación o `409` por conflicto de negocio, **When** se procesa la respuesta, **Then** la UI muestra el error de forma clara sin romper flujo.

---

### User Story 3 - Gestionar Departamentos desde UI (Priority: P3)

Como usuario autenticado, quiero listar, crear, editar y eliminar departamentos para mantener la estructura organizacional desde el frontend.

**Why this priority**: Completa el requerimiento del profesor y garantiza coherencia funcional con reglas actuales de backend.

**Independent Test**: Se valida en módulo de departamentos sin depender de cambios de backend, incluyendo paginación y conflicto de eliminación con asociados.

**Acceptance Scenarios**:

1. **Given** sesión válida, **When** el usuario abre `/departamentos`, **Then** visualiza listado paginado consumiendo `/api/v2/departamentos`.
2. **Given** un departamento con empleados asociados, **When** el usuario intenta eliminarlo, **Then** backend responde `409` y la UI muestra mensaje de conflicto.
3. **Given** backend responde `400` por validación en crear/editar departamento, **When** se procesa la respuesta, **Then** la UI muestra errores de validación en pantalla.

---

### Edge Cases

- Sesión expirada durante navegación activa en módulo privado.
- Recarga de navegador con token existente en ruta privada.
- Token corrupto/ausente en almacenamiento cliente.
- Error `400` con errores por campo en formularios de empleado/departamento.
- Error `409` por conflicto de negocio (correo duplicado, departamento con empleados asociados).
- Cambio de página y tamaño en listados con respuesta vacía o última página.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El frontend MUST implementarse en Angular según versión definida por la asignatura (Angular 22 LTS como referencia académica vigente).
- **FR-002**: El frontend MUST consumir exclusivamente `POST /api/auth/login` para autenticación.
- **FR-003**: El frontend MUST consumir exclusivamente endpoints existentes bajo `/api/v2/empleados` y `/api/v2/departamentos` para CRUD y listados.
- **FR-004**: El frontend MUST manejar JWT emitido por backend para solicitudes autenticadas.
- **FR-005**: Las rutas privadas del frontend MUST protegerse con guards y redirigir a `/login` cuando no exista token válido.
- **FR-006**: El frontend MUST incluir vistas para listar, crear, editar y eliminar empleados.
- **FR-007**: El frontend MUST incluir vistas para listar, crear, editar y eliminar departamentos.
- **FR-008**: Los listados de empleados y departamentos MUST soportar paginación consumiendo parámetros del backend existente.
- **FR-009**: El formulario de empleado MUST exigir `departamentoClave` y no permitir envío sin ese dato.
- **FR-010**: La UI MUST mostrar y manejar errores `400`, `401` y `409` devueltos por backend.
- **FR-011**: La UI MUST limitarse a campos existentes del backend para empleados y departamentos, sin inventar atributos adicionales.
- **FR-012**: Esta feature MUST no modificar reglas de negocio backend ni crear nuevos endpoints/versiones de API.

### Flujo de Login y JWT *(mandatory)*

- Login con correo/password en `/login`.
- Consumo de `POST /api/auth/login`.
- Al éxito, el token JWT MUST almacenarse únicamente en `sessionStorage`.
- Inclusión del Bearer token en llamadas privadas.
- En logout explícito, el token JWT MUST eliminarse de `sessionStorage`.
- Ante `401` por token inválido/expirado, el token JWT MUST eliminarse de `sessionStorage` y el frontend MUST redirigir a `/login`.
- El frontend MUST no mantener persistencia indefinida del token entre cierre de pestaña/sesión de navegador.

### Guards y navegación privada *(mandatory)*

- Guards aplicados a todas las rutas de empleados/departamentos.
- `/login` permanece pública.
- Rutas privadas bloqueadas sin sesión autenticada.

### Consumo de módulos *(mandatory)*

- Empleados: operaciones de listado paginado, alta, edición y baja con backend actual.
- Departamentos: operaciones de listado paginado, alta, edición y baja con backend actual.
- Manejo explícito de `409` al eliminar departamento con empleados asociados.

### Key Entities *(include if feature involves data)*

- **SesiónFrontend**: Estado de autenticación en cliente, incluye token JWT y estado autenticado/no autenticado.
- **EmpleadoViewModel**: Representación de datos de empleado en UI, alineada al contrato actual de backend e incluyendo `departamentoClave`.
- **DepartamentoViewModel**: Representación de datos de departamento en UI con campos `clave` y `nombre`.
- **ApiErrorViewModel**: Modelo de error en UI para reflejar códigos `400`, `401`, `409` y mensajes relevantes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de rutas privadas (`/empleados*`, `/departamentos*`) redirigen a `/login` cuando no hay token válido.
- **SC-002**: El 100% de operaciones CRUD de empleados y departamentos en UI consumen únicamente `/api/auth/login` y `/api/v2/**` existentes.
- **SC-003**: El 100% de formularios de empleado bloquean envío sin `departamentoClave`.
- **SC-004**: El 100% de respuestas backend `400`, `401` y `409` en flujos principales se muestran en UI con feedback visible para el usuario.
- **SC-005**: Listados de empleados y departamentos permiten navegación paginada funcional en condiciones de datos reales.

## Assumptions

- El backend actual permanece disponible y estable en rutas `/api/auth/login` y `/api/v2/**`.
- La autenticación JWT y contratos OpenAPI existentes son la fuente oficial para integración frontend.
- La versión Angular requerida por la asignatura será la usada para esta práctica sin extender alcance a migraciones de backend.
