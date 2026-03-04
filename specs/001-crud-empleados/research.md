# Research: CRUD de Empleados

## Decision 1: Seguridad de endpoints CRUD
- Decision: Proteger endpoints CRUD con Spring Security (autenticación obligatoria) y autorización por rol administrativo, usando autenticación básica con credenciales `admin/admin123`.
- Rationale: La constitución exige protección para APIs no públicas y definición explícita de autorización por recurso.
- Alternatives considered:
  - API abierta en local sin auth: rechazada por incumplir la constitución.
  - Autorización solo por red privada: rechazada por no ser control de identidad suficiente.

## Decision 2: Migraciones de base de datos
- Decision: Usar Flyway para versionar cambios de esquema PostgreSQL.
- Rationale: Cumple el principio de migraciones trazables y permite ejecución consistente en local/CI.
- Alternatives considered:
  - Liquibase: válida, pero se prioriza Flyway por simplicidad para práctica académica.
  - SQL manual sin versionado: rechazada por baja trazabilidad.

## Decision 3: Estrategia de eliminación
- Decision: Implementar eliminación física por `clave` para el CRUD inicial.
- Rationale: El spec describe eliminación del registro y no exige retención histórica ni auditoría en alcance actual.
- Alternatives considered:
  - Borrado lógico (`activo=false`): pospuesto para futura iteración con requerimientos de auditoría.
  - Respaldo previo obligatorio: rechazado por complejidad fuera de alcance MVP.

## Decision 4: Contrato API
- Decision: API REST JSON versionada bajo `/api/v2/empleados` con operaciones create/list/get/update/delete y paginación en el listado.
- Rationale: Convención estándar para CRUD, fácil de documentar en OpenAPI/Swagger y testear con MockMvc.
- Alternatives considered:
  - Rutas sin versionado: rechazada para evitar deuda de versionamiento futuro.
  - API RPC/GraphQL: rechazada por no aportar valor al alcance.

## Decision 5: Reglas de validación de campos
- Decision: `nombre`, `direccion`, `telefono` son obligatorios y máximo 100 caracteres; `clave` se autogenera con formato `EMP-<consecutivo>`.
- Rationale: Alineado con requerimientos FR-002a y FR-006 del spec.
- Alternatives considered:
  - Límites distintos por campo: rechazado por contradecir requisito explícito del usuario.
  - Validar formato estricto de teléfono: pospuesto por no estar requerido.
