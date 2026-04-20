# Tasks: Feature 006 - Reverse Proxy en Entorno Docker

**Input**: Design documents from `/specs/006-nginx-proxy-compose/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Se incluyen tareas de validacion operativa, automatizacion repetible de SC-002, medicion reproducible de SC-003 y regresion funcional critica existente.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: [US1], [US2], [US3] para trazabilidad por historia
- Cada tarea incluye ruta exacta de archivo

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar artefactos base para integrar Nginx en el stack actual sin romper nombres de servicios.

- [x] T001 Crear directorio de configuracion Nginx para compose en docker/nginx/
- [x] T002 Crear archivo base de proxy Nginx en docker/nginx/default.conf
- [x] T003 Agregar servicio `nginx` inicial en docker/docker-compose.yml
- [x] T004 [P] Documentar objetivo de entrypoint unico y alcance de cambios en specs/006-nginx-proxy-compose/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir red interna y politica de exposicion host/interna que bloquea toda implementacion por historia.

**⚠️ CRITICAL**: Ninguna historia inicia antes de cerrar esta fase

- [x] T005 Declarar red interna explicita para aplicacion en docker/docker-compose.yml
- [x] T006 Conectar servicios `nginx`, `frontend`, `app`, `postgres` a red interna en docker/docker-compose.yml
- [x] T007 Eliminar publicacion host directa de `app` y mantener puerto interno en docker/docker-compose.yml
- [x] T008 Eliminar publicacion host directa de `frontend` y mantener puerto interno en docker/docker-compose.yml
- [x] T009 Eliminar publicacion host directa de `postgres` y mantener puerto interno en docker/docker-compose.yml
- [x] T010 Definir a `nginx` como unico servicio con `ports` publicados al host en docker/docker-compose.yml
- [x] T011 Asegurar orden de arranque del proxy respecto a upstreams en docker/docker-compose.yml
- [x] T012 Registrar explicitamente politica host vs interna en specs/006-nginx-proxy-compose/contracts/nginx-routing-contract.md

**Checkpoint**: Red y exposicion establecidas; listo para implementar historias

---

## Phase 3: User Story 1 - Acceso Unificado por Proxy (Priority: P1) 🎯 MVP

**Goal**: Nginx como unico punto de entrada para UI y API usando una sola URL publica.

**Independent Test**: Levantar compose y validar que `http://localhost/` carga frontend y `http://localhost/api/...` alcanza backend, sin acceso host directo a `app`/`frontend`.

### Validation for User Story 1

- [x] T013 [P] [US1] Crear verificacion de disponibilidad de UI via proxy en specs/006-nginx-proxy-compose/quickstart.md
- [x] T014 [P] [US1] Crear verificacion de disponibilidad API via proxy en specs/006-nginx-proxy-compose/quickstart.md
- [x] T015 [US1] Definir validacion explicita de guards de rutas privadas y mapeo UI de errores 400/401/409 via proxy en specs/006-nginx-proxy-compose/quickstart.md

### Implementation for User Story 1

- [x] T016 [US1] Configurar `server` y bloque base HTTP de Nginx en docker/nginx/default.conf
- [x] T017 [US1] Configurar `location /` hacia upstream `frontend:4200` en docker/nginx/default.conf
- [x] T018 [US1] Configurar `location /api` hacia upstream `app:8080` en docker/nginx/default.conf
- [x] T019 [US1] Montar archivo de configuracion Nginx en servicio proxy en docker/docker-compose.yml
- [x] T020 [US1] Ajustar entorno frontend para consumo API via ruta relativa `/api` en frontend/src/environments/environment.ts
- [x] T021 [US1] Ajustar entorno frontend para consumo API via ruta relativa `/api` en frontend/src/environments/environment.prod.ts
- [x] T022 [US1] Documentar comando MVP de arranque/validacion de entrypoint unico en specs/006-nginx-proxy-compose/quickstart.md

**Checkpoint**: US1 funcional e independiente

---

## Phase 4: User Story 2 - Enrutamiento Consistente de Trafico (Priority: P2)

**Goal**: Reglas claras y robustas de enrutamiento para evitar ambiguedades entre `/` y `/api`.

**Independent Test**: Ejecutar solicitudes a rutas web y API, confirmando destino correcto y manejo coherente de rutas invalidas.

### Validation for User Story 2

- [x] T023 [P] [US2] Definir prueba manual de precedencia `/api` sobre `/` en specs/006-nginx-proxy-compose/quickstart.md
- [x] T024 [P] [US2] Definir prueba manual de ruta invalida y respuesta esperada en specs/006-nginx-proxy-compose/quickstart.md

### Implementation for User Story 2

- [x] T025 [US2] Agregar headers de proxy recomendados (`Host`, `X-Forwarded-*`) en docker/nginx/default.conf
- [x] T026 [US2] Configurar timeouts basicos de proxy para estabilidad local en docker/nginx/default.conf
- [x] T027 [US2] Ajustar regla de reenvio de `/api` para preservar ruta backend esperada en docker/nginx/default.conf
- [x] T028 [US2] Definir comportamiento consistente para rutas no encontradas en docker/nginx/default.conf
- [x] T029 [US2] Actualizar contrato de enrutamiento final reconciliado en specs/006-nginx-proxy-compose/contracts/nginx-routing-contract.md

**Checkpoint**: US2 funcional e independiente

---

## Phase 5: User Story 3 - Operacion Reproducible para Equipo (Priority: P3)

**Goal**: Flujo reproducible para levantar, validar y operar el stack con proxy en cualquier entorno local.

**Independent Test**: Ejecutar quickstart en ambiente limpio y verificar arranque + validaciones sin pasos ocultos.

### Validation for User Story 3

- [x] T030 [P] [US3] Registrar evidencia de `docker compose ps` con estado esperado en specs/006-nginx-proxy-compose/quickstart.md
- [x] T031 [P] [US3] Registrar evidencia de validacion funcional basica via entrypoint unico en specs/006-nginx-proxy-compose/quickstart.md

### Implementation for User Story 3

- [x] T032 [US3] Documentar flujo reproducible de arranque y verificacion en specs/006-nginx-proxy-compose/quickstart.md
- [x] T033 [US3] Documentar diferenciacion final de puertos host vs puertos internos por servicio en specs/006-nginx-proxy-compose/quickstart.md
- [x] T034 [US3] Documentar explicitamente matriz de no-impacto para OpenAPI/Auth/Flyway en specs/006-nginx-proxy-compose/contracts/nginx-routing-contract.md
- [x] T035 [US3] Añadir checklist operativa de troubleshooting para proxy/upstreams en specs/006-nginx-proxy-compose/quickstart.md

**Checkpoint**: US3 funcional e independiente

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de calidad, regresion y trazabilidad global

- [x] T036 [P] Crear script automatizado de validacion repetible SC-002 (/, /api, bloqueo host directo frontend/backend) en scripts/qa/nginx-proxy-sc002.ps1
- [x] T037 [P] Ejecutar validacion automatizada SC-002 por 20 iteraciones y guardar evidencia estructurada en specs/006-nginx-proxy-compose/evidence/sc-002-results.json
- [x] T038 [P] Crear script reproducible de medicion SC-003 desde compose up hasta validacion minima en scripts/qa/nginx-proxy-sc003.ps1
- [x] T039 [P] Ejecutar medicion SC-003 en 3 corridas consecutivas y guardar evidencia en specs/006-nginx-proxy-compose/evidence/sc-003-timing.json
- [x] T040 [P] Ejecutar validacion integral de compose y registrar resultados finales en specs/006-nginx-proxy-compose/quickstart.md
- [x] T041 [P] Ejecutar regresion critica existente (auth + flujo principal) sobre entrypoint Nginx y registrar evidencia en specs/006-nginx-proxy-compose/quickstart.md
- [x] T042 [P] Actualizar resumen de cumplimiento SC-001..SC-005 con evidencia automatizada en specs/006-nginx-proxy-compose/quickstart.md
- [x] T043 Verificar consistencia final entre spec, plan, contrato y quickstart en specs/006-nginx-proxy-compose/spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Phase 1
- **User Stories (Phase 3-5)**: Dependen de Phase 2
- **Polish (Phase 6)**: Depende de completar US1, US2 y US3

### User Story Dependencies

- **US1 (P1)**: Inicia inmediatamente tras Foundational
- **US2 (P2)**: Depende de US1 para validar rutas sobre proxy funcional
- **US3 (P3)**: Depende de US1+US2 para documentar y validar flujo reproducible completo

### Within Each User Story

- Validaciones de historia primero
- Configuracion de infraestructura despues
- Documentacion y reconciliacion al final

### Parallel Opportunities

- **Phase 1**: T004
- **Phase 2**: T012
- **US1**: T013, T014
- **US2**: T023, T024
- **US3**: T030, T031
- **Phase 6**: T036, T037, T038, T039, T040, T041, T042

---

## Parallel Example: User Story 1

```bash
Task: "T013 [US1] Verificacion UI via proxy"
Task: "T014 [US1] Verificacion API via proxy"
```

## Parallel Example: User Story 2

```bash
Task: "T023 [US2] Prueba precedencia /api"
Task: "T024 [US2] Prueba ruta invalida"
```

## Parallel Example: User Story 3

```bash
Task: "T030 [US3] Evidencia docker compose ps"
Task: "T031 [US3] Evidencia funcional via entrypoint"
```

## Parallel Example: Automation & Timing (SC-002/SC-003)

```bash
Task: "T036 Crear script automatizado SC-002"
Task: "T038 Crear script de medicion SC-003"
```

---

## Implementation Strategy

### MVP First (US1)

1. Completar Phase 1
2. Completar Phase 2
3. Completar US1
4. Validar entrada unificada (`/` y `/api`) como entrega MVP

### Incremental Delivery

1. Entregar US1 (entrypoint unico)
2. Entregar US2 (enrutamiento robusto)
3. Entregar US3 (operacion reproducible)
4. Cerrar con evidencia automatizada SC-002/SC-003 y polish

### Parallel Team Strategy

1. Infra completa Setup + Foundational
2. Luego paralelo:
   - Dev A: US1
   - Dev B: US2
   - Dev C: US3
3. Integracion y evidencia final en Phase 6

---

## Notes

- Todas las tareas siguen formato estricto de checklist ejecutable.
- Se preservan nombres de servicios existentes en compose.
- Se diferencia explicitamente exposicion al host vs comunicacion interna Docker.
- Alcance limitado a infraestructura de proxy y configuracion asociada, sin cambios de logica de negocio.

---

## Requirement Traceability (FR -> Tasks)

- FR-001 -> T003, T010, T016, T019
- FR-002 -> T017, T023
- FR-003 -> T018, T027
- FR-004 -> T015, T020, T021, T041
- FR-005 -> T024, T028
- FR-006 -> T034, T043
- FR-007 -> T015, T034, T041
- FR-008 -> T034
- FR-009 -> T020, T021
- FR-010 -> T015, T041
- FR-011 -> T004, T022, T032, T033, T035
- FR-012 -> T030, T031, T037, T039, T040, T042

## Success Criteria Traceability (SC -> Tasks)

- SC-001 -> T013, T014, T030, T040
- SC-002 -> T036, T037, T042
- SC-003 -> T038, T039, T042
- SC-004 -> T041
- SC-005 -> T032, T035, T042

## Supporting Tasks (Enabling, Non-Direct FR/SC)

- T001, T002 -> Preparacion de artefactos base de configuracion Nginx para habilitar implementacion.
- T005, T006, T007, T008, T009, T011, T012 -> Fundaciones de red interna y politica de exposicion necesarias para cumplir entrypoint unico.
- T025, T026, T029 -> Endurecimiento tecnico y reconciliacion contractual para estabilidad operativa y consistencia de enrutamiento.
