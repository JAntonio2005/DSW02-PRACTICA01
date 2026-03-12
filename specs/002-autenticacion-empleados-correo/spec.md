# Feature Specification: Autenticación de Empleados

**Feature Branch**: `[002-autenticacion-empleados-correo]`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "002- Autenticación con correo y pwd de empleados"

## Constitution Alignment *(mandatory)*

- Backend implementation MUST target Spring Boot 3.x with Java 17.
- APIs requiring protection MUST define authentication and authorization behavior.
- Persistent data changes MUST define PostgreSQL impact and migration needs.
- Delivery strategy MUST define Docker execution path (service + dependencies).
- API changes MUST define OpenAPI/Swagger documentation updates.

## Clarifications

### Session 2026-03-11

- Q: ¿Qué mecanismo de autenticación se usará? → A: Login con correo/password que devuelve token JWT Bearer con expiración.
- Q: ¿Qué vigencia tendrá el token JWT? → A: JWT de 60 minutos sin refresh token; al expirar requiere nuevo login.
- Q: ¿Cómo se manejarán roles y autorización? → A: No habrá roles; todas las operaciones protegidas requieren solo autenticación válida.
- Q: ¿Cómo se almacenará la contraseña? → A: Contraseña con hash SHA-256 sin sal.
- Q: ¿Cómo manejar intentos fallidos repetidos? → A: Sin bloqueo de cuenta ni límite por intentos en esta iteración.
- Q: ¿Qué pasa con tokens activos cuando cambian credenciales? → A: Los tokens activos se mantienen válidos hasta su expiración natural (60 min).
- Q: ¿Qué rutas se consideran protegidas para validar SC-003? → A: Todas las rutas bajo /api/empleados/** son protegidas, excepto /api/auth/login que es pública.
- Q: ¿Qué formato debe tener el error de autenticación inválida? → A: Respuesta estándar con campos {code, message, timestamp}; para credenciales inválidas usar code=AUTH_INVALID_CREDENTIALS y message="Credenciales inválidas".
- Q: ¿Qué código usar para errores de validación de login (correo inválido/contraseña vacía)? → A: Usar code=AUTH_VALIDATION_ERROR y message="Datos de autenticación inválidos".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iniciar sesión por correo (Priority: P1)

Como empleado, quiero iniciar sesión usando mi correo y contraseña para acceder de forma segura al sistema.

**Why this priority**: Es la base de seguridad del acceso; sin autenticación no se puede restringir ni personalizar operaciones por usuario.

**Independent Test**: Se puede probar creando un empleado habilitado con correo/contraseña válidos e iniciando sesión exitosamente, recibiendo una respuesta de autenticación válida.

**Acceptance Scenarios**:

1. **Given** que existe un empleado activo con correo y contraseña válidos, **When** envía credenciales correctas, **Then** el sistema autentica al empleado y devuelve un token JWT Bearer con vigencia de 60 minutos.
2. **Given** que un empleado envía credenciales inválidas, **When** intenta iniciar sesión, **Then** el sistema rechaza la autenticación y devuelve un mensaje de error claro sin revelar datos sensibles.

---

### User Story 2 - Protección de endpoints (Priority: P2)

Como sistema, quiero que endpoints protegidos requieran autenticación para evitar accesos no autorizados.

**Why this priority**: Reduce riesgo de uso indebido y cumple las reglas de seguridad del proyecto.

**Independent Test**: Se puede probar llamando un endpoint protegido sin autenticación (debe fallar) y luego con autenticación válida (debe responder).

**Acceptance Scenarios**:

1. **Given** que un cliente no autenticado consume un recurso protegido, **When** hace la solicitud, **Then** el sistema responde acceso denegado.
2. **Given** que un cliente autenticado consume ese mismo recurso protegido, **When** hace la solicitud, **Then** el sistema permite el acceso.

---

### User Story 3 - Gestión de credenciales de empleado (Priority: P3)

Como usuario autenticado, quiero registrar y actualizar credenciales de empleados para mantener cuentas utilizables y seguras.

**Why this priority**: Permite operación continua del acceso de usuarios sin depender de configuraciones manuales.

**Independent Test**: Se puede probar registrando/actualizando correo y contraseña de un empleado y verificando que luego pueda autenticarse con los nuevos datos.

**Acceptance Scenarios**:

1. **Given** que se registra un empleado con correo único y contraseña válida, **When** se guarda el registro, **Then** el sistema persiste las credenciales y el empleado puede autenticarse.
2. **Given** que se intenta registrar o actualizar un correo ya usado por otro empleado, **When** se procesa la solicitud, **Then** el sistema rechaza la operación con mensaje claro.

### Edge Cases

- Intento de inicio de sesión con correo inexistente.
- Intento de inicio de sesión con contraseña vacía o nula.
- Intento de registro de empleado con correo en formato inválido.
- Intento de registro o actualización con correo duplicado.
- Intentos repetidos de autenticación fallida en un periodo corto sin bloqueo automático.
- Uso de token expirado para acceder a un endpoint protegido.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir autenticación de empleados con correo y contraseña mediante un endpoint de login que emite token JWT Bearer con expiración.
- **FR-001a**: El token JWT DEBE tener una vigencia de 60 minutos y, al expirar, el sistema DEBE requerir nuevo login (sin refresh token).
- **FR-001b**: Tras cambio de credenciales de un empleado, los tokens JWT ya emitidos DEBEN permanecer válidos hasta su expiración natural; la nueva credencial aplica a emisiones posteriores.
- **FR-002**: El sistema DEBE validar formato de correo antes de procesar autenticación o alta/actualización de credenciales.
- **FR-003**: El sistema DEBE rechazar autenticaciones con credenciales inválidas sin exponer si falló correo o contraseña.
- **FR-003a**: Las respuestas de error de autenticación DEBEN usar formato estándar `{code, message, timestamp}`: para credenciales incorrectas DEBEN usar `code=AUTH_INVALID_CREDENTIALS` y `message="Credenciales inválidas"`; para errores de validación de login (correo inválido/contraseña vacía) DEBEN usar `code=AUTH_VALIDATION_ERROR` y `message="Datos de autenticación inválidos"`.
- **FR-004**: El sistema DEBE asociar un correo único por empleado.
- **FR-005**: El sistema DEBE permitir registrar credenciales de acceso de empleados en alta o actualización.
- **FR-006**: El sistema DEBE proteger endpoints definidos como privados y requerir token JWT Bearer válido para su acceso.
- **FR-006a**: Para esta iteración, TODAS las rutas bajo `/api/empleados/**` DEBEN requerir autenticación JWT válida; `/api/auth/login` DEBE permanecer pública.
- **FR-007**: El sistema DEBE registrar eventos de autenticación exitosa y fallida para auditoría operativa.
- **FR-008**: El sistema DEBE aplicar la política de credenciales definida para esta iteración según FR-008a y FR-008b.
- **FR-008a**: La contraseña DEBE almacenarse como hash SHA-256 sin sal y nunca enviarse en texto plano en respuestas.
- **FR-008b**: En esta iteración, el sistema NO DEBE bloquear cuentas ni aplicar límite automático por intentos fallidos; solo DEBE registrar dichos eventos.
- **FR-009**: El sistema DEBE documentar endpoints y flujos afectados en OpenAPI/Swagger.
- **FR-010**: El sistema DEBE definir impacto de esquema PostgreSQL y estrategia de migración para nuevos campos o tablas de autenticación.

### Key Entities *(include if feature involves data)*

- **Empleado**: Representa al usuario interno que accede al sistema; incluye identidad laboral y datos de acceso.
- **CredencialEmpleado**: Representa los datos de autenticación vinculados a un empleado (correo único, contraseña protegida, estado de cuenta y fechas operativas de autenticación).
- **EventoAutenticacion**: Representa un registro de intento de autenticación con resultado, fecha/hora y contexto mínimo para auditoría.

## Assumptions

- La autenticación aplica a empleados registrados en el sistema existente.
- No forma parte de este alcance la recuperación de contraseña por correo.
- No se definen roles de autorización en esta iteración; el control de acceso se basa en autenticación válida.
- El sistema seguirá operando en entorno local con Docker para validaciones funcionales.

## Dependencies

- Disponibilidad de almacenamiento PostgreSQL para datos de credenciales y eventos.
- Mecanismo de autenticación de la plataforma backend habilitado para proteger endpoints.
- Contrato OpenAPI/Swagger disponible para publicar cambios del feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En entorno de prueba local, en una corrida de 100 intentos consecutivos de autenticación con credenciales válidas, al menos 95 intentos DEBEN completarse exitosamente y el p95 del endpoint de login DEBE ser menor a 500 ms.
- **SC-002**: El 100% de intentos con correo inválido o contraseña vacía DEBE ser rechazado con respuesta en formato `{code, message, timestamp}` usando `code=AUTH_VALIDATION_ERROR`; y el 100% de credenciales incorrectas DEBE usar `code=AUTH_INVALID_CREDENTIALS`.
- **SC-003**: El 100% de endpoints definidos como protegidos rechaza solicitudes sin autenticación válida.
- **SC-004**: El 100% de los cambios de credenciales aplicados a un empleado se reflejan en su siguiente intento de autenticación.
