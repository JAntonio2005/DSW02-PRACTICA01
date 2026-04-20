# Feature Specification: Feature 006 - Reverse Proxy en Entorno Docker

**Feature Branch**: `[006-nginx-proxy-compose]`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "Hagamos la spec 006 y quiero que la hagas bien segun su numero y tambien su respectiva rama, esta spec funcionara agregando un proxy con nginx al docker compose"

## Constitution Alignment *(mandatory)*

- Backend implementation MUST target Spring Boot 3.x with Java 17.
- APIs requiring protection MUST define authentication and authorization behavior.
- Persistent data changes MUST define PostgreSQL impact and migration needs.
- Delivery strategy MUST define Docker execution path (service + dependencies).
- API changes MUST define OpenAPI/Swagger documentation updates.
- Frontend web features MUST define Angular usage per assignment/practice version, official backend API consumption, JWT handling, route guards for private pages, and UI mapping for backend 400/401/409 errors.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceso Unificado por Proxy (Priority: P1)

Como desarrollador del proyecto, quiero un único punto de entrada HTTP para el sistema en Docker, para acceder de forma consistente al frontend y a la API sin configurar puertos ni URLs distintas por servicio.

**Why this priority**: El acceso unificado reduce errores de entorno y habilita un flujo mínimo funcional para todo el equipo.

**Independent Test**: Puede validarse iniciando el entorno Docker y comprobando que una sola URL pública permite cargar la interfaz y consumir la API esperada.

**Acceptance Scenarios**:

1. **Given** el stack Docker está levantado, **When** el usuario abre la URL pública definida del entorno, **Then** la aplicación web se carga correctamente desde ese punto de entrada.
2. **Given** el stack Docker está levantado, **When** la aplicación web realiza llamadas a la API mediante el mismo dominio de entrada, **Then** las respuestas son exitosas y el flujo funcional principal se mantiene.
3. **Given** el usuario no accede directamente a puertos internos de servicios, **When** usa únicamente el punto de entrada unificado, **Then** puede completar el flujo base de uso sin cambios manuales de configuración.

---

### User Story 2 - Enrutamiento Consistente de Tráfico (Priority: P2)

Como mantenedor del entorno, quiero reglas de enrutamiento claras para tráfico web y de API, para evitar ambigüedades entre servicios y reducir fallos por rutas mal dirigidas.

**Why this priority**: Un enrutamiento consistente evita errores intermitentes y simplifica la resolución de incidencias.

**Independent Test**: Puede validarse con solicitudes explícitas a rutas de frontend y rutas de API, verificando que cada una llega al servicio correcto.

**Acceptance Scenarios**:

1. **Given** existe tráfico hacia rutas de frontend, **When** se solicita una ruta de interfaz, **Then** la respuesta corresponde al servicio web esperado.
2. **Given** existe tráfico hacia rutas de API, **When** se solicita un endpoint backend válido, **Then** la respuesta proviene del servicio backend esperado.
3. **Given** una ruta inválida o no registrada, **When** se solicita desde el punto de entrada, **Then** el sistema devuelve una respuesta de error coherente y trazable para diagnóstico.

---

### User Story 3 - Operación Reproducible para Equipo (Priority: P3)

Como integrante del equipo, quiero que el proxy quede integrado en la orquestación Docker estándar del repositorio, para levantar y probar el entorno de forma reproducible en cualquier máquina de desarrollo.

**Why this priority**: La reproducibilidad reduce fricción de onboarding y asegura consistencia entre validaciones locales.

**Independent Test**: Puede validarse ejecutando el flujo documentado de arranque y comprobando que el proxy y servicios dependientes quedan operativos sin pasos ocultos.

**Acceptance Scenarios**:

1. **Given** una máquina con prerrequisitos Docker, **When** se ejecuta el comando oficial de arranque, **Then** el proxy y servicios dependientes inician en estado saludable.
2. **Given** el entorno ya está levantado, **When** se ejecutan verificaciones básicas de disponibilidad, **Then** se confirma que frontend y API son accesibles por el punto de entrada unificado.
3. **Given** una validación de regresión funcional, **When** se ejecutan pruebas críticas existentes, **Then** no se introducen regresiones por la incorporación del proxy.

---

### Edge Cases

- El proxy inicia antes de que backend o frontend estén listos para recibir tráfico.
- Un servicio interno cambia de puerto o nombre lógico y deja rutas sin destino válido.
- Existen rutas solapadas entre frontend y API que pueden enrutar al destino incorrecto.
- Se intenta acceso directo a servicios internos saltando el punto de entrada unificado.
- El entorno se reinicia con caché o configuración previa y conserva reglas obsoletas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST incorporar un punto de entrada HTTP unificado en el entorno Docker para acceso al sistema.
- **FR-002**: System MUST enrutar tráfico de interfaz al servicio web correspondiente.
- **FR-003**: System MUST enrutar tráfico de API al servicio backend correspondiente.
- **FR-004**: System MUST mantener compatibilidad con los flujos funcionales principales existentes al usar el punto de entrada unificado.
- **FR-005**: System MUST definir un comportamiento consistente para rutas no válidas y errores de enrutamiento.
- **FR-006**: System MUST actualizar OpenAPI/Swagger solo si la integración del proxy afecta rutas, endpoints o comportamiento de API; si no hay afectación, System MUST documentar explícitamente el no-impacto.
- **FR-007**: System MUST definir o actualizar requisitos de autenticación/autorización por endpoint/recurso solo si la integración del proxy altera comportamiento de acceso; si no hay afectación, System MUST documentar explícitamente el no-impacto.
- **FR-008**: System MUST definir cambios de esquema/datos en PostgreSQL y estrategia de migración solo si la integración del proxy introduce impacto en persistencia; si no hay afectación, System MUST documentar explícitamente el no-impacto.
- **FR-009**: Web frontend (if in scope) MUST consume only the official backend API and handle JWT issued by backend.
- **FR-010**: Web frontend private routes (if in scope) MUST be protected with guards and MUST map backend 400/401/409 errors in UI.
- **FR-011**: System MUST documentar procedimiento de arranque y validación del entorno con proxy dentro de la guía operativa de la feature.
- **FR-012**: System MUST incluir evidencia de validación local del punto de entrada unificado y su enrutamiento básico.

### Key Entities *(include if feature involves data)*

- **ProxyEntryPoint**: Punto de entrada público del entorno de desarrollo en contenedor que recibe tráfico entrante.
- **RoutingRule**: Regla funcional que define qué tipo de ruta debe llegar a cada servicio interno.
- **ServiceUpstream**: Servicio interno de destino para tráfico proxificado (interfaz web o API).

## Assumptions & Dependencies

- El entorno Docker del repositorio seguirá siendo el mecanismo oficial de orquestación local.
- Backend y frontend actuales mantienen sus capacidades funcionales y contratos vigentes.
- No se requiere cambio de lógica de negocio para incorporar el punto de entrada unificado.
- El equipo validará la feature con pruebas críticas ya existentes para detectar regresiones.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En entorno de referencia local (Docker Desktop limpio, sin contenedores previos del proyecto), la aplicación debe cargar correctamente por una sola URL pública en 20/20 ejecuciones consecutivas; regla de aceptación: éxito solo si 20 de 20 corridas completan carga inicial de UI y disponibilidad básica de API vía el mismo entrypoint.
- **SC-002**: El enrutamiento de rutas de interfaz y rutas de API alcanza el servicio correcto en al menos el 95% de verificaciones automatizadas repetidas (minimo 20 iteraciones) incluyendo: acceso a `/`, acceso a `/api`, bloqueo de acceso directo host a frontend/backend y evidencia automatizada de resultados.
- **SC-003**: El tiempo de arranque del entorno completo con punto de entrada unificado, medido con un método reproducible desde inicio de `docker compose up -d --build` hasta validación funcional mínima exitosa, se mantiene en <= 5 minutos en al menos 3 ejecuciones consecutivas en entorno de referencia.
- **SC-004**: Las pruebas críticas de regresión definidas para auth y flujos principales mantienen 0 fallos atribuibles a la incorporación del proxy.
- **SC-005**: Protocolo reproducible de onboarding en una sola pasada: actor = integrante nuevo sin contexto previo de la feature; pasos = (1) clonar/abrir repositorio, (2) ejecutar comando oficial de arranque, (3) ejecutar validaciones documentadas de UI/API y checks de red, (4) registrar evidencia requerida; evidencia = log de comandos ejecutados, salida de `docker compose ps` y resultados de validaciones en quickstart/evidence; condición de éxito = el actor completa los pasos sin ayuda externa, sin pasos implícitos y con resultado pass en la primera ejecución end-to-end.
