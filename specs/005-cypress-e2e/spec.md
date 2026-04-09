# Feature Specification: Feature 005 - Cypress E2E Base Suite

**Feature Branch**: `[005-cypress-e2e]`  
**Created**: 2026-03-26  
**Status**: Draft  
**Input**: User description: "Hagamos el spec 005 para cypress 0"

## Constitution Alignment *(mandatory)*

- Backend implementation MUST target Spring Boot 3.x with Java 17.
- APIs requiring protection MUST define authentication and authorization behavior.
- Persistent data changes MUST define PostgreSQL impact and migration needs.
- Delivery strategy MUST define Docker execution path (service + dependencies).
- API changes MUST define OpenAPI/Swagger documentation updates.
- Frontend web features MUST define Angular usage per assignment/practice version, official backend API consumption, JWT handling, route guards for private pages, and UI mapping for backend 400/401/409 errors.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validar Acceso Seguro Inicial (Priority: P1)

Como equipo del proyecto, queremos una suite E2E básica que valide login y navegación protegida para detectar de inmediato regresiones críticas de autenticación.

**Why this priority**: Si falla autenticación o guard de rutas, todo el flujo funcional del sistema queda bloqueado.

**Independent Test**: Puede probarse de forma independiente ejecutando solo escenarios de login exitoso, login inválido y acceso a rutas privadas sin sesión.

**Acceptance Scenarios**:

1. **Given** el sistema operativo y servicios disponibles, **When** se ejecuta el escenario de login válido, **Then** el usuario accede a una ruta privada permitida.
2. **Given** credenciales inválidas, **When** se envía intento de login, **Then** se mantiene en login y se muestra mensaje de error de autenticación en la UI sin navegar a rutas privadas.
3. **Given** no existe sesión activa, **When** se intenta abrir una ruta privada, **Then** se redirige al flujo de autenticación.

---

### User Story 2 - Validar Flujos CRUD Críticos (Priority: P2)

Como equipo del proyecto, queremos pruebas E2E de los flujos CRUD principales para empleados y departamentos para reducir riesgo de regresión funcional en cambios de frontend y backend.

**Why this priority**: Los módulos CRUD son el núcleo de la práctica y concentran la mayor parte del valor funcional.

**Independent Test**: Puede ejecutarse por separado con escenarios de crear, editar, listar y eliminar en ambos módulos, verificando en UI que cada operación refleja el cambio esperado en la tabla dentro de 5 segundos.

**Acceptance Scenarios**:

1. **Given** una sesión válida, **When** se ejecuta el flujo CRUD de departamentos (crear, editar y eliminar), **Then** cada operación finaliza sin error de UI y la tabla refleja alta/modificación/baja del registro objetivo.
2. **Given** una sesión válida, **When** se ejecuta el flujo CRUD de empleados (crear, editar y eliminar), **Then** cada operación finaliza sin error de UI y la tabla refleja alta/modificación/baja del registro objetivo.
3. **Given** operaciones de listado, **When** se navega entre páginas, **Then** el índice de página cambia correctamente y la tabla muestra el conjunto de resultados correspondiente a la página seleccionada.

---

### User Story 3 - Validar Manejo de Errores de Negocio (Priority: P3)

Como equipo del proyecto, queremos escenarios E2E que validen manejo de errores 400/401/409 para asegurar que la experiencia de usuario y seguridad se mantienen consistentes.

**Why this priority**: Errores mal manejados generan fallos silenciosos y soporte innecesario; también pueden ocultar problemas de seguridad.

**Independent Test**: Puede probarse de forma independiente ejecutando escenarios forzados de validación, sesión inválida y conflicto de negocio.

**Acceptance Scenarios**:

1. **Given** un payload inválido, **When** se ejecuta la acción correspondiente, **Then** se muestra respuesta de validación esperada en UI.
2. **Given** una sesión inválida o expirada, **When** se intenta una operación privada, **Then** se aplica el comportamiento de seguridad definido para no autenticados.
3. **Given** una operación con conflicto de negocio, **When** se ejecuta la acción, **Then** se muestra el error de conflicto sin romper la aplicación.

---

### Edge Cases

- Backend disponible pero sin usuario administrador semilla funcional.
- Servicios levantados, pero frontend no alcanza backend por configuración de origen cruzado.
- Datos base no existentes para flujos de edición o eliminación.
- Error intermitente de red durante una operación de crear/editar/eliminar desde formulario.
- Ejecución en entorno limpio con tiempos de carga mayores al promedio esperado.

## Execution Baseline *(mandatory)*

- Entorno local de referencia para métricas de tiempo: Docker Desktop en ejecución, `docker/docker-compose.yml` levantando `postgres`, `app` y `frontend`, y ejecución de Cypress desde `frontend`.
- La comparación de duración y estabilidad de ejecución MUST usar este baseline (no entornos ad hoc).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST definir una suite E2E automatizada para frontend que pueda ejecutarse de forma local y en CI.
- **FR-002**: El sistema MUST incluir escenarios de autenticación (éxito, fallo y rutas privadas sin sesión).
- **FR-003**: El sistema MUST incluir escenarios E2E de operaciones CRUD críticas para empleados.
- **FR-004**: El sistema MUST incluir escenarios E2E de operaciones CRUD críticas para departamentos.
- **FR-005**: El sistema MUST validar en E2E el comportamiento de paginación en módulos de listado.
- **FR-006**: El sistema MUST declarar explícitamente el impacto de esta feature sobre OpenAPI/Swagger con uno de estos resultados verificables: (a) "sin impacto en contrato OpenAPI" o (b) "contrato actualizado". La evidencia MUST quedar documentada en `specs/005-cypress-e2e/contracts/cypress-e2e-coverage.md` y en `specs/005-cypress-e2e/quickstart.md`.
- **FR-007**: El sistema MUST definir una matriz de autorización por endpoint/recurso usada por los escenarios E2E, incluyendo como mínimo: método HTTP, patrón de ruta, si requiere autenticación, rol/permiso esperado y resultado esperado para 401/403. La matriz MUST quedar documentada en `specs/005-cypress-e2e/contracts/cypress-e2e-coverage.md`.
- **FR-008**: El sistema MUST declarar explícitamente impacto en PostgreSQL/Flyway con uno de estos resultados verificables: (a) "sin cambios de esquema ni datos" y "sin nuevas migraciones Flyway" para esta feature, o (b) lista de migraciones requeridas con identificador de versión. La evidencia MUST quedar documentada en `specs/005-cypress-e2e/plan.md` y `specs/005-cypress-e2e/quickstart.md`.
- **FR-009**: El frontend MUST consumir únicamente la API oficial del backend del proyecto en pruebas E2E.
- **FR-010**: El frontend MUST validar en E2E el manejo de JWT y protección de rutas privadas.
- **FR-011**: El frontend MUST validar en E2E la representación de errores backend 400/401/409 en la interfaz.
- **FR-012**: El sistema MUST proveer un comando de ejecución E2E reproducible para desarrolladores y CI.
- **FR-013**: El sistema MUST documentar precondiciones de ejecución E2E (servicios requeridos, datos mínimos, variables necesarias).
- **FR-014**: El sistema MUST producir reporte de ejecución E2E con estado de cada escenario (aprobado/fallido), duración y marca de tiempo. El artefacto canonico MUST quedar en `specs/005-cypress-e2e/quickstart.md` con referencia al archivo de salida de Cypress generado por la corrida.

### Key Entities *(include if feature involves data)*

- **E2ETestScenario**: Caso de prueba funcional de extremo a extremo; incluye nombre, prioridad, precondiciones y resultado esperado.
- **E2ERunReport**: Resultado consolidado de ejecución E2E; incluye fecha/hora, entorno, casos ejecutados, aprobados y fallidos.
- **TestDataProfile**: Conjunto de datos mínimos necesarios para ejecutar escenarios críticos de autenticación y CRUD.

## Assumptions & Dependencies

- Existe al menos un entorno local reproducible con frontend y backend accesibles para ejecución de pruebas de extremo a extremo.
- El flujo de autenticación oficial y los endpoints funcionales de empleados/departamentos se mantienen vigentes durante esta feature.
- Los datos mínimos requeridos para escenarios críticos (por ejemplo, usuario autenticable y registros base) pueden prepararse de forma trazable.
- La pipeline de integración continua del proyecto permite ejecutar pruebas automatizadas de interfaz sin intervención manual.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos 1 flujo completo de autenticación y acceso protegido se ejecuta automáticamente con tasa de éxito de 100% en entorno estable.
- **SC-002**: Al menos 2 flujos CRUD críticos (empleados y departamentos) se ejecutan automáticamente y validan resultados esperados en UI.
- **SC-003**: Los escenarios de error 400/401/409 se validan automáticamente y muestran el mensaje de UI definido para cada caso en el 100% de ejecuciones exitosas.
- **SC-004**: El comando oficial de ejecución E2E finaliza en menos de 10 minutos usando el entorno local de referencia definido en "Execution Baseline".
- **SC-005**: Cada ejecución genera evidencia trazable de casos ejecutados y su estado para revisión del equipo.
