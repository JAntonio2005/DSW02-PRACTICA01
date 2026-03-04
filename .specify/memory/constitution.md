<!--
Sync Impact Report
- Version change: 0.0.0-template → 1.0.0
- Modified principles:
	- Template Principle 1 placeholder → I. Spring Boot 3 + Java 17 como Base Única
	- Template Principle 2 placeholder → II. Autenticación Obligatoria en Toda API Expuesta
	- Template Principle 3 placeholder → III. Persistencia en PostgreSQL con Migraciones Trazables
	- Template Principle 4 placeholder → IV. Entrega Contenerizada con Docker Reproducible
	- Template Principle 5 placeholder → V. Contrato API Documentado con OpenAPI/Swagger
- Added sections:
	- Standards Técnicos Obligatorios
	- Workflow y Quality Gates
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
Rationale: reducir superficie de ataque y asegurar control de acceso consistente.

### III. Persistencia en PostgreSQL con Migraciones Trazables
La persistencia de datos MUST usar PostgreSQL como motor relacional primario.
Todo cambio de esquema MUST versionarse mediante migraciones (por ejemplo,
Flyway/Liquibase), ejecutables en entornos locales y CI sin pasos manuales.
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
Rationale: acelerar integración cliente-backend y reducir ambigüedad funcional.

## Standards Técnicos Obligatorios

- Build y dependencias MUST gestionarse con Maven Wrapper (`mvnw`) y perfiles por entorno.
- Configuración sensible MUST venir de variables de entorno; secretos en texto plano están prohibidos.
- Validación de entrada MUST implementarse con Bean Validation en DTOs de entrada.
- Errores MUST exponerse con formato consistente y sin filtrar detalles internos.
- Observabilidad mínima MUST incluir logs estructurados por request y health checks.

## Workflow y Quality Gates

Cada cambio MUST pasar por este flujo:

1. Definir especificación con criterios de aceptación y requisitos de seguridad.
2. Actualizar contrato OpenAPI/Swagger antes o junto con la implementación.
3. Implementar/actualizar pruebas unitarias e integración para casos críticos,
	 incluyendo autenticación y acceso a PostgreSQL.
4. Verificar ejecución local en Docker (servicio + base de datos) antes de merge.
5. Realizar revisión de código con checklist de cumplimiento constitucional.

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

**Version**: 1.0.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-02-25
