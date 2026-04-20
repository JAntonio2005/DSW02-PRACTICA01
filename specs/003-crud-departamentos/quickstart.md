# Quickstart - Feature 003 CRUD de Departamentos

## Prerequisitos
- Proyecto en rama `003-crud-departamentos`.
- PostgreSQL accesible con credenciales del entorno.
- Aplicación Spring Boot ejecutable con `./mvnw spring-boot:run`.

## Flujo recomendado de implementación
1. Crear migración Flyway de departamentos y relación con empleados en etapas seguras.
2. Implementar módulo `departamentos` (entidad, repository, service, controller).
3. Ajustar flujo de empleados para `departamentoClave` obligatorio y válido.
4. Actualizar `GlobalExceptionHandler` para errores de negocio (`409` / validaciones).
5. Actualizar OpenAPI/Swagger.
6. Ejecutar pruebas unitarias + integración.

## Smoke Test funcional esperado

### 1) Login para obtener JWT
- `POST /api/auth/login` con correo/password válidos.
- Respuesta: token JWT.

### 2) Crear departamento
- `POST /api/v2/departamentos` con Bearer token.
- Body ejemplo:
```json
{
  "nombre": "Recursos Humanos"
}
```

### 3) Listar departamentos paginados
- `GET /api/v2/departamentos?page=0&size=10` con Bearer token.
- Verificar estructura paginada consistente con empleados.

### 4) Crear/actualizar empleado con departamentoClave
- En create/update de empleado, enviar `departamentoClave` obligatorio.
- Si no existe la clave, esperar error de validación de negocio.

### 5) Intentar eliminar departamento con empleados asociados
- `DELETE /api/v2/departamentos/{clave}`.
- Esperar `409 Conflict`.

## Validaciones de migración
- Confirmar que todos los empleados existentes quedaron asignados a un departamento válido.
- Confirmar que `empleados.departamento_clave` está en `NOT NULL` y con FK activa.

### Script SQL de verificación post-migración

```sql
SELECT COUNT(*) AS empleados_sin_departamento
FROM empleados
WHERE departamento_clave IS NULL;

SELECT COUNT(*) AS empleados_con_departamento_invalido
FROM empleados e
LEFT JOIN departamentos d ON d.clave = e.departamento_clave
WHERE d.clave IS NULL;

SELECT is_nullable
FROM information_schema.columns
WHERE table_name = 'empleados'
  AND column_name = 'departamento_clave';

SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'empleados'
  AND constraint_name = 'fk_empleados_departamento';
```

## Validación bootstrap-auth (ambiente limpio)

1. Levantar entorno limpio (`docker compose -f docker/docker-compose.yml down -v` y luego `up --build`).
2. Verificar que Flyway aplica migraciones sin pasos manuales.
3. Verificar presencia de admin semilla (`admin@empresa.com`) en tabla `empleados`.
4. Ejecutar `POST /api/auth/login` con correo/password del admin semilla.
5. Confirmar obtención de JWT y uso exitoso del Bearer token en endpoint protegido.
6. Confirmar que no se realizaron inserciones manuales fuera del repositorio.
