# Feature Specification: CRUD de Empleados

**Feature Branch**: `[001-crud-empleados]`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User description: "Crea un crud de empleados con los campos clave, nombre, dirección y teléfono. Donde clave sea el PK y nombre, dirección y teléfono sea de 100 carácteres"

## Constitution Alignment *(mandatory)*

- Esta funcionalidad se define para ser compatible con backend en Spring Boot 3.x y Java 17.
- Este alcance no exige endpoints protegidos; si se habilita seguridad en una fase posterior, se deberá definir autenticación y autorización por recurso.
- La funcionalidad requiere cambios persistentes para almacenar empleados, incluyendo definición de esquema y estrategia de migración de datos.
- La entrega debe contemplar ejecución en entorno Docker para el servicio y sus dependencias.
- Los endpoints del CRUD deben quedar documentados y actualizados en OpenAPI/Swagger.

## Clarifications

### Session 2026-02-26

- Q: ¿Cómo debe definirse `clave` en la especificación final? → A: `clave` se define como PK compuesta por formato `EMP-` + un consecutivo autonumérico generado por el sistema.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar empleado (Priority: P1)

Como usuario administrativo, quiero registrar un empleado con nombre, dirección y teléfono para darlo de alta en el sistema y que la clave se genere automáticamente.

**Why this priority**: Sin alta de empleados no existe información base para operar ni para usar el resto del CRUD.

**Independent Test**: Se puede probar creando un empleado con datos válidos y verificando que queda disponible para consulta posterior.

**Acceptance Scenarios**:

1. **Given** que el usuario captura nombre, dirección y teléfono válidos (hasta 100 caracteres), **When** guarda el registro, **Then** el sistema crea el empleado y genera la clave con formato `EMP-` seguido de consecutivo autonumérico.
2. **Given** que existe un nuevo registro por crear, **When** el sistema asigna la clave, **Then** la clave generada es única y no reutiliza un consecutivo ya existente.

---

### User Story 2 - Consultar y editar empleado (Priority: P2)

Como usuario administrativo, quiero consultar empleados y editar sus datos para mantener la información actualizada.

**Why this priority**: Mantener datos vigentes reduce errores operativos y evita registros obsoletos.

**Independent Test**: Se puede probar consultando un empleado existente, actualizando uno o más campos válidos y verificando que los cambios se guardan.

**Acceptance Scenarios**:

1. **Given** que existe un empleado registrado, **When** el usuario solicita su consulta por clave, **Then** el sistema muestra clave, nombre, dirección y teléfono.
2. **Given** que existe un empleado y se envían cambios con longitud máxima de 100 caracteres por campo editable, **When** el usuario guarda la edición, **Then** el sistema actualiza el registro y conserva la misma clave.

---

### User Story 3 - Eliminar empleado (Priority: P3)

Como usuario administrativo, quiero eliminar empleados que ya no deban estar activos para mantener la base limpia.

**Why this priority**: Es importante para higiene de datos, pero depende de que ya exista alta de empleados.

**Independent Test**: Se puede probar eliminando un empleado existente y confirmando que deja de aparecer en consultas.

**Acceptance Scenarios**:

1. **Given** que existe un empleado, **When** el usuario confirma la eliminación, **Then** el sistema elimina el registro y notifica éxito.
2. **Given** que la clave no existe, **When** se intenta eliminar, **Then** el sistema informa que no hay un empleado asociado a esa clave.

---

### Edge Cases

- Intento de registrar o actualizar nombre, dirección o teléfono con más de 100 caracteres.
- Intento de enviar manualmente una clave en creación o edición cuando la clave debe ser autogenerada.
- Intento de registrar un empleado con campos requeridos vacíos.
- Consulta, actualización o eliminación con clave inexistente.
- Captura de textos con espacios al inicio o final; el sistema debe tratarlos de forma consistente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir registrar empleados con los campos nombre, dirección y teléfono.
- **FR-002**: El sistema DEBE generar `clave` automáticamente como PK compuesta por el prefijo literal `EMP-` y un consecutivo autonumérico.
- **FR-002a**: El sistema DEBE garantizar que `clave` sea única para cada empleado registrado.
- **FR-003**: El sistema DEBE permitir consultar empleados por su clave y listar empleados existentes.
- **FR-004**: El sistema DEBE permitir actualizar nombre, dirección y teléfono de un empleado existente sin modificar la clave generada.
- **FR-005**: El sistema DEBE permitir eliminar empleados por clave.
- **FR-006**: El sistema DEBE validar que nombre, dirección y teléfono no excedan 100 caracteres cada uno.
- **FR-007**: El sistema DEBE rechazar operaciones de creación o actualización cuando nombre, dirección o teléfono requeridos estén vacíos.
- **FR-008**: El sistema DEBE mostrar mensajes claros de éxito o error para operaciones de crear, consultar, actualizar y eliminar.
- **FR-009**: El sistema DEBE persistir la información de empleados para que permanezca disponible entre sesiones.
- **FR-010**: El sistema DEBE documentar los endpoints del CRUD en OpenAPI/Swagger.
- **FR-011**: El sistema DEBE definir el impacto en esquema PostgreSQL y la estrategia de migración para la entidad de empleados.
- **FR-012**: El sistema DEBE declarar que, en este alcance, no se requiere autenticación obligatoria para operar el CRUD en entorno local de práctica.

### Key Entities *(include if feature involves data)*

- **Empleado**: Representa a una persona registrada en el sistema. Atributos clave: clave (texto, PK autogenerada con formato `EMP-` + consecutivo autonumérico, única), nombre (máximo 100), dirección (máximo 100) y teléfono (máximo 100).

## Assumptions

- La funcionalidad está orientada a una práctica académica con un solo tipo de usuario operativo.
- Los campos obligatorios de captura son `nombre`, `dirección` y `teléfono`; `clave` se genera automáticamente.
- El límite de 100 caracteres aplica a `nombre`, `dirección` y `teléfono`.
- No se requieren reglas de negocio adicionales sobre formato de teléfono en este alcance.

## Dependencies

- Disponibilidad de un medio de persistencia compatible con PostgreSQL para almacenar la entidad Empleado.
- Disponibilidad de documentación OpenAPI/Swagger en el proyecto para publicar los cambios del CRUD.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los intentos de alta con nombre, dirección y teléfono válidos se completan exitosamente generando una clave en formato `EMP-` + consecutivo autonumérico.
- **SC-002**: El 100% de los intentos con nombre, dirección o teléfono mayores a 100 caracteres son rechazados con mensaje claro.
- **SC-003**: Al menos 95% de las operaciones CRUD válidas se completan en menos de 2 segundos en entorno local de práctica.
- **SC-004**: Al menos 90% de los usuarios de prueba completan un ciclo completo (alta, consulta, edición y baja) sin asistencia externa.
