<!--
Sync Impact Report
- Version change: 1.1.0 → 1.2.0
- Modified principles:
	- Ninguno
- Added sections:
	- VI. Frontend Web Oficial en Angular
- Removed sections:
	- Ninguna
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending: .specify/templates/commands/*.md (directorio no existe en este workspace)
	- ✅ reviewed: runtime docs (README/docs no presentes; sin cambios aplicables)
- Follow-up TODOs:
	- Ninguno
-->

# DSW02-Practica01 Constitution

## Core Principles

### I. Spring Boot 3 + Java 17 como Base Única
Todos los servicios backend MUST implementarse en Spring Boot 3.x y Java 17.
No se permite introducir frameworks de servidor alternos ni versiones de Java fuera
de 17 sin una enmienda formal a esta constitución.
Rationale: mantener compatibilidad, soporte LTS y uniformidad operativa.

### II. Autenticación Obligatoria en Toda API Expuesta
Todo endpoint no público MUST estar protegido con autenticación en Spring Security.
Las decisiones de autorización MUST declararse explícitamente por ruta/recurso y
los eventos de autenticación fallida MUST registrarse para auditoría.

El sistema MUST garantizar un mecanismo de acceso inicial reproducible para evitar
bloqueo operativo en ambientes nuevos. Para ello, MUST existir un usuario
administrador semilla aprovisionado mediante migración versionada de base de datos
o mecanismo equivalente trazable, nunca por pasos manuales no documentados.

Las credenciales iniciales del administrador MUST estar definidas y documentadas
para fines de arranque controlado del sistema. En esta práctica, el bootstrap
inicial de autenticación usa:
- correo: `admin@empresa.com`
- password inicial: `admin123`

Estas credenciales iniciales MUST poder restablecerse de forma reproducible en un
ambiente nuevo y MUST cambiarse o reconfigurarse si el proyecto evoluciona a un
entorno productivo.
Rationale: reducir superficie de ataque, asegurar control de acceso consistente y
evitar que el sistema quede inutilizable por ausencia de un usuario autenticable inicial.

### III. Persistencia en PostgreSQL con Migraciones Trazables
La persistencia de datos MUST usar PostgreSQL como motor relacional primario.
Todo cambio de esquema MUST versionarse mediante migraciones (por ejemplo,
Flyway/Liquibase), ejecutables en entornos locales y CI sin pasos manuales.

La creación o restauración del usuario administrador semilla MUST formar parte de
una migración trazable o mecanismo equivalente versionado, de modo que una base
nueva pueda quedar operativa sin inserciones manuales fuera del flujo del proyecto.
Rationale: garantizar trazabilidad, reproducibilidad y rollback controlado.

### IV. Entrega Contenerizada con Docker Reproducible
Cada servicio backend MUST incluir Dockerfile funcional y configuración de
ejecución local con dependencias necesarias (incluyendo PostgreSQL) mediante
Docker Compose o equivalente. Las imágenes MUST ser reproducibles por versión.
Rationale: estandarizar despliegue y disminuir diferencias entre ambientes.

### V. Contrato API Documentado con OpenAPI/Swagger
Toda API REST MUST exponer especificación OpenAPI vigente y su documentación
Swagger UI en entornos no productivos. Ningún endpoint nuevo se considera
completo sin contrato documentado, ejemplos de request/response y códigos de
error principales.

La documentación MUST distinguir claramente entre:
- endpoint de login con correo/password para obtener JWT
- uso posterior del token Bearer en endpoints protegidos

Rationale: acelerar integración cliente-backend y reducir ambigüedad funcional.

### VI. Frontend Web Oficial en Angular
El cliente web oficial MUST implementarse en Angular con la versión requerida
por la asignatura o la versión Angular definida para la práctica vigente.

El frontend MUST consumir exclusivamente la API oficial del backend del proyecto
y no se permiten rutas o fuentes de datos paralelas fuera de ese contrato.

El frontend MUST manejar el JWT emitido por el backend para acceso a recursos
protegidos y MUST proteger rutas privadas mediante guards.

La interfaz MUST reflejar errores relevantes del backend, como mínimo `400`,
`401` y `409`, con mensajes consistentes para el usuario.

Rationale: mantener una arquitectura integrada frontend-backend, con seguridad
consistente y comportamiento funcional alineado al contrato oficial.

## Standards Técnicos Obligatorios

- Build y dependencias MUST gestionarse con Maven Wrapper (`mvnw`) y perfiles por entorno.
- Configuración sensible MUST venir de variables de entorno; secretos en texto plano están prohibidos.
- Validación de entrada MUST implementarse con Bean Validation en DTOs de entrada.
- Errores MUST exponerse con formato consistente y sin filtrar detalles internos.
- Observabilidad mínima MUST incluir logs estructurados por request y health checks.
- El usuario administrador semilla MUST definirse de manera reproducible y no depender de inserciones manuales ad hoc en la base de datos.
- Las credenciales iniciales usadas para bootstrap MUST documentarse en el proyecto solo para fines académicos o de entorno local controlado.

## Bootstrap Inicial de Autenticación

Para evitar dependencia circular entre autenticación y creación del primer usuario,
todo ambiente nuevo MUST quedar con un administrador semilla funcional al finalizar
las migraciones.

Flujo esperado:
1. Se crea el esquema en PostgreSQL.
2. Se aplican migraciones versionadas.
3. Se crea o restaura el administrador semilla.
4. Se realiza login con correo/password.
5. El token JWT obtenido se usa en endpoints protegidos.
6. La creación de nuevos empleados autenticables ocurre ya bajo acceso autorizado.

Rationale: resolver el problema de bootstrap inicial y mantener coherencia entre
seguridad, trazabilidad y operatividad del sistema.

## Workflow y Quality Gates

Cada cambio MUST pasar por este flujo:

1. Definir especificación con criterios de aceptación y requisitos de seguridad.
2. Actualizar contrato OpenAPI/Swagger antes o junto con la implementación.
3. Implementar/actualizar pruebas unitarias e integración para casos críticos,
	 incluyendo autenticación y acceso a PostgreSQL.
4. Verificar ejecución local en Docker (servicio + base de datos) antes de merge.
5. Realizar revisión de código con checklist de cumplimiento constitucional.
6. Verificar explícitamente que el ambiente nuevo pueda autenticarse con el
	administrador semilla sin pasos manuales externos al repositorio.

## Governance

Esta constitución prevalece sobre convenciones locales de implementación.

- Amendment Procedure: toda enmienda MUST documentar motivación, impacto en
	plantillas de SpecKit y plan de migración para trabajo en curso.
- Approval Policy: cambios constitucionales MUST aprobarse por el responsable
	técnico del proyecto y al menos un revisor adicional.
- Versioning Policy: se aplica SemVer a la constitución.
	- MAJOR: eliminación o redefinición incompatible de principios/gobernanza.
	- MINOR: adición de principios o expansión material de reglas obligatorias.
	- PATCH: aclaraciones editoriales sin cambio normativo.
- Compliance Review: cada PR MUST incluir verificación explícita del
	Constitution Check en plan/spec/tasks cuando aplique.

**Version**: 1.2.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-03-19