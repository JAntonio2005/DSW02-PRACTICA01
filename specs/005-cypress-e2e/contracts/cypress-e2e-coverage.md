# Cypress E2E Coverage Contract - Feature 005

Este contrato define el alcance mínimo obligatorio de la suite E2E.

## 0. OpenAPI/Swagger Impact Contract

- Estado inicial (FR-006): **sin impacto en contrato OpenAPI/Swagger**.
- Si durante implementación cambia algún endpoint, request o response, se MUST actualizar OpenAPI y registrar reconciliación final en este documento.

## 1. Authentication Contract

- MUST validar login exitoso con credencial válida.
- MUST validar login fallido con credencial inválida.
- MUST validar redirección a login al intentar abrir rutas privadas sin sesión.

### Auth Matrix by Endpoint/Resource (FR-007)

| Metodo | Ruta | Requiere auth | Rol esperado | Resultado esperado 401/403 |
|--------|------|---------------|--------------|----------------------------|
| POST | /api/auth/login | No | Publico | 401 cuando credenciales invalidas |
| GET | /api/v2/empleados | Si | Usuario autenticado | 401 sin token o token invalido |
| POST | /api/v2/empleados | Si | Usuario autenticado | 401 sin token o token invalido |
| PUT | /api/v2/empleados/{clave} | Si | Usuario autenticado | 401 sin token o token invalido |
| DELETE | /api/v2/empleados/{clave} | Si | Usuario autenticado | 401 sin token o token invalido |
| GET | /api/v2/departamentos | Si | Usuario autenticado | 401 sin token o token invalido |
| POST | /api/v2/departamentos | Si | Usuario autenticado | 401 sin token o token invalido |
| PUT | /api/v2/departamentos/{clave} | Si | Usuario autenticado | 401 sin token o token invalido |
| DELETE | /api/v2/departamentos/{clave} | Si | Usuario autenticado | 401 sin token o token invalido |

## 2. CRUD Coverage Contract

### Empleados
- MUST cubrir listado paginado.
- MUST cubrir alta de empleado con datos válidos.
- MUST cubrir edición de empleado existente.
- MUST cubrir eliminación de empleado de prueba.

### Departamentos
- MUST cubrir listado paginado.
- MUST cubrir alta de departamento con datos válidos.
- MUST cubrir edición de departamento existente.
- MUST cubrir eliminación válida de departamento.

## 3. Error Contract

- MUST cubrir respuesta 400 en flujo de formulario inválido.
- MUST cubrir respuesta 401 en flujo sin sesión/token inválido.
- MUST cubrir respuesta 409 en conflicto de negocio representativo.

## 4. Execution Contract

- MUST proveer comando reproducible para ejecución local.
- MUST proveer comando reproducible para ejecución CI/headless.
- MUST generar reporte de resultado con casos aprobados/fallidos.

## 5. PostgreSQL/Flyway Impact Contract (FR-008)

- Esta feature declara **sin cambios de esquema PostgreSQL**.
- Esta feature declara **sin nuevas migraciones Flyway**.
- Si aparece necesidad de migración durante implementación, se MUST registrar identificador de versión de migración y justificación.

## 6. Out of Scope

- Pruebas de performance masiva.
- Visual regression pixel-perfect.
- Cobertura E2E completa de todos los campos opcionales del sistema.

## 7. Final Reconciliation Notes

- Confirmar al cierre que no hubo cambios en contrato OpenAPI.
- Confirmar que la matriz de autorización sigue alineada con el backend final.
