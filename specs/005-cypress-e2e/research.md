# Phase 0 Research - Feature 005 Cypress E2E Base Suite

## Decision 1: Framework E2E oficial
- **Decision**: Usar Cypress como herramienta principal de pruebas de extremo a extremo del frontend.
- **Rationale**: Proporciona ejecución real en navegador, depuración visual y API estable para escenarios de UI y red.
- **Alternatives considered**:
  - Playwright: potente, pero fuera del alcance solicitado explícitamente para esta feature.
  - Solo pruebas unitarias/integración frontend: no validan flujo real completo entre UI y backend.

## Decision 2: Enfoque de cobertura por riesgo
- **Decision**: Priorizar escenarios críticos (auth, rutas privadas, CRUD clave, errores 400/401/409).
- **Rationale**: Maximiza valor de detección temprana con menor costo de mantenimiento inicial.
- **Alternatives considered**:
  - Cobertura exhaustiva de todas pantallas desde el inicio: mayor costo y fragilidad en primera iteración.

## Decision 3: Ejecución reproducible con start-server-and-test
- **Decision**: Orquestar frontend + dependencias para ejecución determinística de Cypress usando scripts npm.
- **Rationale**: Reduce flakiness por servicios no listos y simplifica uso en local/CI.
- **Alternatives considered**:
  - Ejecutar Cypress manualmente tras levantar servicios a mano: más propenso a errores operativos.

## Decision 4: Test data con prefijos y limpieza funcional
- **Decision**: Usar convenciones de datos de prueba con prefijos únicos para evitar colisiones entre corridas.
- **Rationale**: Permite repetir escenarios sin depender de estado exacto previo de la base.
- **Alternatives considered**:
  - Reutilizar siempre mismos identificadores: alto riesgo de conflictos 409 no intencionados.

## Decision 5: Alineación estricta al contrato backend existente
- **Decision**: Los escenarios E2E consumen solo `/api/auth/login` y `/api/v2/**` sin rutas alternas.
- **Rationale**: Cumple constitución y evita divergencias entre pruebas y comportamiento productivo.
- **Alternatives considered**:
  - Mock total de backend en E2E: reduce valor de integración real y no valida CORS/auth reales.
