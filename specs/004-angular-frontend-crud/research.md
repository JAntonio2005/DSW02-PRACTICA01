# Phase 0 Research - Frontend Angular CRUD

## Decision 1: Frontend aislado en `frontend/` (SPA Angular)
- Decision: Implementar un proyecto Angular independiente en `frontend/`, consumiendo backend existente por HTTP.
- Rationale: Evita alterar backend Java actual, mantiene separación de responsabilidades y facilita pruebas frontend.
- Alternatives considered:
  - Integrar UI en recursos estáticos de Spring Boot: acopla despliegue y complica ciclos rápidos de frontend.
  - Crear BFF/proxy backend nuevo: viola alcance (sin backend nuevo).

## Decision 2: Manejo de sesión con `sessionStorage` + `SessionStore`
- Decision: Guardar JWT en `sessionStorage` y encapsular acceso/limpieza en `SessionStore`.
- Rationale: Persistencia por pestaña para entorno académico, menor exposición que almacenamiento indefinido; centraliza reglas de sesión.
- Alternatives considered:
  - `localStorage`: mayor persistencia pero más riesgo de permanencia de sesión no deseada.
  - Cookies httpOnly: requiere backend/cambios de contrato fuera de alcance.

## Decision 3: Autorización cliente con `AuthGuard` + `JwtInterceptor`
- Decision: Proteger rutas privadas con guard y adjuntar Bearer token vía interceptor global.
- Rationale: Implementación idiomática en Angular, reduce duplicación y garantiza consistencia en todas las peticiones.
- Alternatives considered:
  - Inyectar token manual en cada servicio: propenso a omisiones.
  - Validación de auth solo en componentes: no previene navegación no autorizada de forma central.

## Decision 4: Formularios reactivos para login y CRUD
- Decision: Usar Reactive Forms con validaciones mínimas locales + mapeo de errores backend.
- Rationale: Facilita validación por campo, testabilidad y sincronización con errores `400` del backend.
- Alternatives considered:
  - Template-driven forms: menor control en validaciones complejas y test unitario.

## Decision 5: Mapeo centralizado de errores HTTP (`ApiErrorMapper`)
- Decision: Implementar mapper unificado para `400`, `401`, `409` y fallback genérico.
- Rationale: Cumple constitución y evita manejo divergente por componente.
- Alternatives considered:
  - Manejo ad hoc por página: inconsistencias de mensajes y mantenimiento costoso.

## Decision 6: DTOs frontend alineados a OpenAPI/backend real
- Decision: Definir tipos TypeScript espejo de contratos actuales (`/api/auth/login`, `/api/v2/empleados`, `/api/v2/departamentos`) sin agregar campos.
- Rationale: Evita desalineación de payloads y respeta restricción de no cambiar contrato backend.
- Alternatives considered:
  - ViewModels libres no alineados: aumenta riesgo de errores de integración.

## Decision 7: Cobertura de pruebas por capas (unit + integration + E2E)
- Decision: Priorizar pruebas unitarias de core (auth/guard/interceptor/error mapper), luego integración HTTP y E2E de flujos críticos.
- Rationale: Detecta fallas temprano y valida de extremo a extremo login/CRUD/paginación/errores.
- Alternatives considered:
  - Solo E2E: feedback más lento y diagnósticos menos precisos.
  - Solo unitarias: no garantiza integración real con contratos backend.

## Decision 8: Orden de entrega incremental por riesgo
- Decision: Implementar primero base de seguridad (auth + guard + interceptor), después departamentos y luego empleados.
- Rationale: Empleados depende de `departamentoClave`; construir departamentos primero reduce bloqueos funcionales.
- Alternatives considered:
  - Empleados primero: introduce dependencia prematura sobre catálogo de departamentos.
