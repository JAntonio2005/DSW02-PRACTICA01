# Implementation Plan: Feature 006 - Reverse Proxy en Entorno Docker

**Branch**: `[006-nginx-proxy-compose]` | **Date**: 2026-04-09 | **Spec**: [specs/006-nginx-proxy-compose/spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-nginx-proxy-compose/spec.md`

## Summary

Integrar Nginx como reverse proxy dentro de `docker/docker-compose.yml` para que sea el unico punto de entrada expuesto al host, enrutar `/` a `frontend` y `/api` a `app`, mantener `frontend`, `app` y `postgres` accesibles solo en red interna Docker, preservar nombres de servicios actuales y asegurar compatibilidad con el flujo funcional existente.

## Technical Context

**Language/Version**: YAML (Compose Spec), Nginx config syntax, Java 17 backend, Angular 20 frontend  
**Primary Dependencies**: Docker Compose, imagen oficial `nginx`, servicio `app` (Spring Boot), servicio `frontend` (Angular)  
**Storage**: PostgreSQL 16 (sin cambios de esquema)  
**Testing**: Verificacion compose (`docker compose ps`), validacion automatizada SC-002 (/, /api, bloqueo host directo), medicion reproducible SC-003 (tiempo total de arranque a validacion minima), y smoke/regresion funcional critica existente  
**Target Platform**: Entorno local Docker Desktop (Windows/Linux/macOS)  
**Project Type**: Web application containerizada (frontend + backend + DB + proxy)  
**Performance Goals**: Sin degradacion funcional percibida en flujo base y enrutamiento estable para `/` y `/api`  
**Constraints**: Nginx unico puerto publicado al host; preservar nombres `postgres`, `app`, `frontend`; cambios minimos en compose; mantener arquitectura actual  
**Scale/Scope**: Ajuste de infraestructura Docker y capa de entrada HTTP; sin cambios de logica de negocio

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Stack gate: Solution uses Spring Boot 3.x + Java 17 (or includes approved amendment).
- [x] Security gate: Authentication/authorization strategy is explicit for all non-public APIs.
- [x] Data gate: PostgreSQL is primary datastore and schema migration plan is defined.
- [x] Container gate: Dockerfile and local container orchestration approach are defined.
- [x] API contract gate: Se documenta no-impacto explícito sobre OpenAPI/Swagger; no hay cambios de contrato API por esta feature.
- [x] Quality gate: Tests and compliance checks include auth, data access, and error paths.
- [x] Frontend gate (if applicable): Web client uses Angular version required by the assignment/practice.
- [x] Frontend security gate (if applicable): Frontend consumes only official backend API, handles JWT, protects private routes with guards, maps backend 400/401/409 errors in UI, y se valida explícitamente tras integrar el proxy.

## Project Structure

### Documentation (this feature)

```text
specs/006-nginx-proxy-compose/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── evidence/
│   ├── sc-002-results.json
│   └── sc-003-timing.json
├── contracts/
│   └── nginx-routing-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
docker/
└── docker-compose.yml

docker/nginx/
└── default.conf

frontend/
└── Dockerfile

scripts/
└── qa/
	├── nginx-proxy-sc002.ps1
	└── nginx-proxy-sc003.ps1

Dockerfile
src/
```

**Structure Decision**: Se mantiene la estructura actual y se agrega una carpeta de configuracion Nginx bajo `docker/` para versionar reglas de reverse proxy sin renombrar servicios existentes.

## Phase 0 - Research Summary

1. Nginx se define como edge unico expuesto al host.
2. El enrutamiento por prefijo es el patron mas simple y mantenible: `/api` -> backend, `/` -> frontend.
3. Los servicios internos quedan sin `ports` publicados y se comunican por nombre de servicio en red interna de compose.
4. La configuracion Nginx debe versionarse en `docker/nginx/default.conf` para trazabilidad y consistencia.
5. Se preservan nombres de servicios `postgres`, `app`, `frontend` para compatibilidad de flujo actual.

## Phase 1 - Technical Design Plan

### 1) Integracion de Nginx en compose

- Agregar servicio `nginx` con imagen oficial.
- Publicar solo el puerto del proxy al host (ej. `80:80` o variable equivalente).
- Montar/cargar archivo de configuracion Nginx versionado desde el repositorio.

### 2) Reglas de reverse proxy

- Definir `location /api` hacia `app:8080`.
- Definir `location /` hacia `frontend:4200`.
- Asegurar precedencia de `/api` sobre `/`.

### 3) Buenas practicas de red Docker

- Declarar red(es) explicitas en compose para separar claramente trafico interno de exposicion host.
- Conectar `nginx`, `frontend`, `app`, `postgres` a red interna de aplicacion.
- Mantener `app`, `frontend`, `postgres` sin puertos publicados al host.

### 4) Ajustes minimos en `docker-compose.yml`

- Conservar nombres de servicios existentes (`postgres`, `app`, `frontend`).
- Reemplazar publicacion host de servicios internos por comunicacion interna en red Docker.
- Mantener `depends_on` y variables necesarias para continuidad del flujo actual.

### 5) Compatibilidad con flujo actual

- Mantener funcionalidad existente de frontend/backend/auth.
- Evitar cambios de logica de negocio.
- Si aplica, ajustar configuracion minima de URL API en contexto Docker para consumo via `/api` a traves del mismo entrypoint.

### 6) Validacion y evidencia

- Verificar servicios levantados con compose y estado healthy.
- Validar acceso a UI via entrypoint unico.
- Validar enrutamiento de API via `/api`.
- Ejecutar validacion automatizada repetible para SC-002 (acceso `/`, acceso `/api`, bloqueo de acceso host directo a frontend/backend y reporte automatizado).
- Medir SC-003 con metodo reproducible de tiempo total de arranque desde `docker compose up -d --build` hasta validacion funcional minima exitosa.
- Validar explicitamente guards de rutas privadas y mapeo de errores UI 400/401/409 tras integrar el proxy.
- Ejecutar smoke/regresion funcional critica para confirmar no regresiones.

## Post-Design Constitution Check

- [x] Stack gate re-check: backend y frontend conservan stack vigente.
- [x] Security gate re-check: autenticacion/autorizacion no se altera; proxy solo enruta.
- [x] Data gate re-check: PostgreSQL sin cambios de esquema ni migraciones nuevas.
- [x] Container gate re-check: compose incorpora proxy con arquitectura reproducible.
- [x] API contract gate re-check: sin cambios de contrato OpenAPI; se documenta explicitamente no-impacto (solo capa de entrada/red).
- [x] Quality gate re-check: incluye validacion de enrutamiento, acceso y regresion critica.
- [x] Frontend gate re-check: Angular se mantiene como cliente oficial.
- [x] Frontend security gate re-check: consumo de API oficial y manejo de auth se preservan; se verifica comportamiento de guards y errores UI 400/401/409.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ninguna | N/A | N/A |
