# Frontend API Consumption Contract

Este contrato define el consumo permitido del frontend Angular para la feature 004.

## Base URL

- `http://localhost:8080` (configurable por entorno)

## Authentication

### Login (público)

- Method: `POST`
- Path: `/api/auth/login`
- Request body:

```json
{
  "correo": "admin@empresa.com",
  "password": "admin123"
}
```

- Success response (`200`): incluye JWT.
- Error response (`400`/`401`): debe mostrarse en UI.

### Authenticated requests

- Header requerido en rutas privadas:
  - `Authorization: Bearer <token>`

## Empleados (`/api/v2/empleados`)

- `GET /api/v2/empleados?page={page}&size={size}` listado paginado.
- `GET /api/v2/empleados/{clave}` consulta por clave.
- `POST /api/v2/empleados` alta.
- `PUT /api/v2/empleados/{clave}` edición.
- `DELETE /api/v2/empleados/{clave}` baja.

### Reglas de frontend

- `departamentoClave` es obligatorio en alta/edición.
- Errores `400` y `409` se muestran con feedback visible.
- Error `401` debe limpiar sesión y redirigir a `/login`.

## Departamentos (`/api/v2/departamentos`)

- `GET /api/v2/departamentos?page={page}&size={size}` listado paginado.
- `GET /api/v2/departamentos/{clave}` consulta por clave.
- `POST /api/v2/departamentos` alta.
- `PUT /api/v2/departamentos/{clave}` edición.
- `DELETE /api/v2/departamentos/{clave}` baja.

### Reglas de frontend

- Mostrar conflicto `409` al intentar eliminar departamento con empleados asociados.
- Errores `400` de validación deben reflejarse en formularios.

## Restricciones contractuales

- No crear endpoints nuevos ni consumir `/api/v3/**`.
- No modificar payloads backend fuera del mapeo UI.
- OpenAPI/Swagger del backend existente es la fuente de verdad del contrato.
