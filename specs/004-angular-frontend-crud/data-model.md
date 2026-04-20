# Data Model - Frontend Angular CRUD

## 1) SesiónFrontend

- Purpose: Mantener estado de autenticación de la SPA.
- Fields:
  - `token: string` (required)
  - `authenticated: boolean` (derived)
  - `issuedAt?: number` (optional, para trazabilidad local)
- Validation rules:
  - `token` no vacío para estado autenticado.
- State transitions:
  - `ANON` -> `AUTHENTICATED`: login exitoso (`/api/auth/login`).
  - `AUTHENTICATED` -> `ANON`: logout explícito.
  - `AUTHENTICATED` -> `ANON`: respuesta `401` en endpoint privado.

## 2) LoginRequest

- Fields:
  - `correo: string` (required, email)
  - `password: string` (required)
- Validation rules:
  - formato de email válido.
  - password no vacío.

## 3) LoginResponse

- Fields:
  - `token: string` (required)
  - `type?: string` (optional, según backend real)
- Notes:
  - El frontend usa únicamente el token para autorización Bearer.

## 4) Empleado DTOs

### EmpleadoRequest
- Fields (alineados al backend):
  - `clave: string` (required)
  - `nombre: string` (required)
  - `direccion: string` (required)
  - `telefono: string` (required)
  - `departamentoClave: string` (required)

### EmpleadoResponse
- Fields (mínimos esperados):
  - `clave: string`
  - `nombre: string`
  - `direccion: string`
  - `telefono: string`
  - `departamentoClave: string`

- Validation rules:
  - `departamentoClave` MUST existir y ser no vacío en alta/edición.

## 5) Departamento DTOs

### DepartamentoRequest
- Fields:
  - `clave: string` (required)
  - `nombre: string` (required)

### DepartamentoResponse
- Fields:
  - `clave: string`
  - `nombre: string`

## 6) Paginación

### PageRequest
- Fields:
  - `page: number` (>= 0)
  - `size: number` (> 0)

### PageResponse<T>
- Fields:
  - `content: T[]`
  - `number: number`
  - `size: number`
  - `totalElements: number`
  - `totalPages: number`

## 7) ApiErrorViewModel

- Purpose: Modelo normalizado para mensajes UI.
- Fields:
  - `status: 400 | 401 | 409 | number`
  - `message: string`
  - `fieldErrors?: Array<{ field: string; message: string }>`
  - `businessCode?: string`
- Mapping rules:
  - `400`: poblar `fieldErrors` cuando backend envíe detalle de validación.
  - `401`: forzar limpieza de sesión y redirección.
  - `409`: mostrar mensaje de conflicto de negocio (incluye delete departamento con empleados).

## 8) Relaciones

- `EmpleadoRequest.departamentoClave` -> referencia lógica a `DepartamentoResponse.clave`.
- En UI, formularios de empleado dependen de catálogo de departamentos para selección válida.
