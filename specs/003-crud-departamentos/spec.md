# Feature Specification: Feature 003 - CRUD de Departamentos

**Feature Branch**: `[003-crud-departamentos]`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "Crear feature 003 con CRUD de departamentos, relación obligatoria con empleados, validaciones de negocio y migración segura en API v2"

## Constitution Alignment *(mandatory)*

- Backend implementation MUST target Spring Boot 3.x with Java 17.
- APIs requiring protection MUST define authentication and authorization behavior.
- Persistent data changes MUST define PostgreSQL impact and migration needs.
- Delivery strategy MUST define Docker execution path (service + dependencies).
- API changes MUST define OpenAPI/Swagger documentation updates.

## Objective *(mandatory)*

Incorporar gestión completa de departamentos en la API existente versión v2, asegurando integridad de datos entre departamentos y empleados, manteniendo autenticación JWT en recursos protegidos y sin romper el contrato actual de empleados salvo la incorporación obligatoria de la referencia a departamento.

## Scope *(mandatory)*

### In Scope

- CRUD completo de departamentos en `/api/v2/departamentos`.
- Relación 1:N entre departamento y empleados.
- Regla de obligatoriedad de `departamentoClave` al crear/actualizar empleados.
- Validación de existencia de departamento al crear/actualizar empleados.
- Regla de negocio para impedir eliminación de departamentos con empleados asociados (409 Conflict).
- Paginación para listado de departamentos con comportamiento consistente al de empleados.
- Actualización de OpenAPI/Swagger para endpoints y contratos impactados.
- Estrategia de migración de datos existentes para introducir relación obligatoria sin romper registros actuales.

### Out of Scope

- Cambiar versión de API a v3 (se mantiene v2).
- Agregar campos adicionales a la entidad Departamento distintos de `clave` y `nombre`.
- Cambiar autenticación actual de login o su endpoint.
- Modificar reglas de negocio no relacionadas a departamentos en otros dominios.

## User Scenarios & Testing *(mandatory)*


### User Story 1 - Gestionar Departamentos (Priority: P1)

Como usuario autenticado con permisos de gestión, quiero crear, consultar, actualizar y eliminar departamentos para administrar la estructura organizacional del catálogo base.

**Why this priority**: Sin catálogo de departamentos no puede cumplirse la nueva regla de que todo empleado pertenezca obligatoriamente a un departamento.

**Independent Test**: Puede validarse de forma independiente ejecutando operaciones CRUD sobre `/api/v2/departamentos` con JWT válido y verificando respuestas de creación, consulta paginada, actualización y eliminación con reglas de negocio.

**Acceptance Scenarios**:

1. **Given** un JWT válido y un nombre de departamento único, **When** se crea un departamento, **Then** el sistema responde éxito y devuelve `clave` y `nombre`.
2. **Given** múltiples departamentos existentes, **When** se consulta el listado paginado, **Then** el sistema devuelve resultados paginados consistentes con el patrón de empleados.
3. **Given** un departamento sin empleados asociados, **When** se elimina, **Then** la eliminación se completa correctamente.
4. **Given** un departamento con empleados asociados, **When** se intenta eliminar, **Then** el sistema responde `409 Conflict`.


**Why this priority**: La relación obligatoria empleado-departamento es una regla central de la nueva especificación y previene datos huérfanos.

**Independent Test**: Puede validarse con pruebas de creación/actualización de empleado enviando `departamentoClave` válido, faltante e inexistente y verificando comportamiento esperado.

**Acceptance Scenarios**:

1. **Given** un departamento existente, **When** se crea un empleado con `departamentoClave` válido, **Then** el empleado queda asociado correctamente.
2. **Given** una solicitud de alta o actualización de empleado sin `departamentoClave`, **When** se procesa la validación, **Then** el sistema rechaza la solicitud por dato obligatorio.
3. **Given** una solicitud con `departamentoClave` inexistente, **When** se procesa la lógica de negocio, **Then** el sistema responde error de validación de negocio.

---

### User Story 3 - Migrar Datos Existentes sin Interrupción (Priority: P3)

Como responsable técnico, quiero migrar la base de datos existente de forma segura para introducir la relación obligatoria sin perder ni invalidar empleados ya registrados.

**Why this priority**: La base ya contiene empleados; la migración debe evitar downtime funcional y fallos por datos inconsistentes.

**Independent Test**: Puede validarse ejecutando migraciones sobre una base con datos existentes y comprobando que todos los empleados quedan vinculados a un departamento válido antes de forzar `NOT NULL` y `FOREIGN KEY`.

**Acceptance Scenarios**:

1. **Given** una base con empleados existentes, **When** se aplican migraciones, **Then** se crea la tabla de departamentos y un departamento semilla para asignación inicial.
2. **Given** empleados preexistentes sin referencia departamental, **When** se ejecuta la etapa de backfill, **Then** todos quedan asociados a un departamento válido.
3. **Given** datos ya migrados, **When** se activa la restricción final, **Then** la relación empleado-departamento queda obligatoria con restricción de integridad activa.

---

### Edge Cases

- Intento de crear departamento con `nombre` duplicado o vacío.
- Solicitud de actualización de departamento con datos inválidos.
- Intento de eliminar un departamento que tiene uno o más empleados asociados.
- Solicitud de creación/actualización de empleado con `departamentoClave` ausente.
- Solicitud de creación/actualización de empleado con `departamentoClave` inexistente.
- Paginación solicitada con parámetros fuera de rango permitido.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST exponer CRUD completo de departamentos en la versión actual `/api/v2/departamentos`.
- **FR-002**: La entidad Departamento MUST contener únicamente los atributos `clave` y `nombre`.
- **FR-003**: El listado de departamentos MUST soportar paginación consistente con el comportamiento de `/api/v2/empleados`.
- **FR-004**: Los endpoints protegidos de departamentos y empleados MUST requerir JWT válido, manteniendo el esquema actual de autenticación.
- **FR-005**: El sistema MUST establecer una relación 1:N donde un departamento puede tener muchos empleados.
- **FR-006**: El sistema MUST impedir que exista un empleado sin departamento asociado.
- **FR-007**: Al crear o actualizar empleado, `departamentoClave` MUST ser obligatorio.
- **FR-008**: Al crear o actualizar empleado, el sistema MUST validar que `departamentoClave` exista en catálogo de departamentos.
- **FR-009**: Si `departamentoClave` no existe, el sistema MUST responder error de validación de negocio.
- **FR-010**: El sistema MUST rechazar con `409 Conflict` cualquier intento de eliminar un departamento con empleados asociados.
- **FR-011**: El sistema MUST mantener compatibilidad del contrato actual de empleados en v2, incorporando únicamente los cambios necesarios para la referencia departamental.
- **FR-012**: El sistema MUST documentar en OpenAPI/Swagger los endpoints nuevos de departamentos y los cambios en contratos de empleados.
- **FR-013**: El sistema MUST definir una migración de datos en PostgreSQL/Flyway en etapas seguras para bases con empleados existentes.
- **FR-014**: La migración MUST incluir: creación de tabla `departamentos`, inserción de departamento semilla para asignación inicial si hace falta, asignación de empleados existentes a departamento válido, y luego aplicación de obligatoriedad (`NOT NULL` + clave foránea).

### Business Rules

- **BR-001**: No se permite eliminar departamentos con empleados asociados; respuesta obligatoria `409 Conflict`.
- **BR-002**: `departamentoClave` es obligatorio en alta y actualización de empleados.
- **BR-003**: Solo se aceptan claves de departamento existentes para asociar empleados.
- **BR-004**: La API se mantiene en v2; no se crean rutas v3 para esta feature.

### Expected Endpoints

- `POST /api/v2/departamentos` (crear departamento).
- `GET /api/v2/departamentos` (listar departamentos con paginación).
- `GET /api/v2/departamentos/{clave}` (consultar departamento por clave).
- `PUT /api/v2/departamentos/{clave}` (actualizar departamento).
- `DELETE /api/v2/departamentos/{clave}` (eliminar departamento, sujeto a BR-001).

### Impact on Empleados

- Solicitudes de creación y actualización de empleados en v2 incorporan `departamentoClave` obligatorio.
- Persistencia de empleados debe incluir referencia obligatoria a departamento.
- Flujos existentes de autenticación y protección JWT se mantienen sin cambio funcional de versión.

### Key Entities *(include if feature involves data)*

- **Departamento**: Catálogo organizacional con atributos `clave` y `nombre`; puede agrupar múltiples empleados.
- **Empleado**: Registro de personal que debe pertenecer a un único departamento válido de forma obligatoria.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de operaciones CRUD de `/api/v2/departamentos` responde conforme a su resultado esperado en pruebas funcionales (éxito o error de negocio).
- **SC-002**: El 100% de altas y actualizaciones de empleados sin `departamentoClave` válido son rechazadas de acuerdo con reglas de validación de negocio.
- **SC-003**: El 100% de intentos de eliminar departamentos con empleados asociados responde `409 Conflict`.
- **SC-004**: El 100% de empleados existentes quedan vinculados a un departamento válido tras la migración, sin registros huérfanos.
- **SC-005**: La documentación OpenAPI/Swagger refleja endpoints de departamentos y contratos impactados de empleados sin inconsistencias detectadas en revisión funcional.

## Assumptions

- Las rutas de departamentos estarán protegidas bajo el mismo esquema JWT que actualmente protege recursos de negocio.
- La clave de departamento seguirá convención compatible con el estilo de claves de la práctica.
- El departamento semilla se usará exclusivamente para transición de datos existentes cuando no haya valor previo asignable.
- El contrato de respuesta de errores seguirá el formato estándar ya usado por el proyecto.
