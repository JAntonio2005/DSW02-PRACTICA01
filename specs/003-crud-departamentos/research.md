# Phase 0 Research - Feature 003 CRUD de Departamentos

## Decision 1: Migración en etapas para relación obligatoria empleado-departamento
- **Decision**: Implementar la migración en cuatro pasos: crear `departamentos`, insertar semilla, backfill de empleados, y finalmente aplicar `NOT NULL` + `FOREIGN KEY`.
- **Rationale**: La base ya contiene empleados y aplicar restricciones fuertes desde el inicio puede romper migraciones en producción/local con datos existentes.
- **Alternatives considered**:
  - Aplicar `NOT NULL` y FK en una sola migración: rechazado por riesgo de fallo en bases con datos previos.
  - Migración manual fuera de Flyway: rechazada por falta de trazabilidad/reproducibilidad.

## Decision 2: Mantener API en v2 con cambios mínimos en contrato de empleados
- **Decision**: Conservar `/api/v2` y agregar solamente `departamentoClave` obligatorio a create/update de empleados.
- **Rationale**: El proyecto ya opera en v2 y la solicitud explícita prohíbe crear v3.
- **Alternatives considered**:
  - Versionar a `/api/v3`: rechazado por requerimiento explícito.
  - Crear endpoint paralelo temporal para empleados: rechazado para evitar duplicidad y deuda técnica.

## Decision 3: Regla de eliminación con respuesta de negocio 409
- **Decision**: Validar en capa de servicio si un departamento tiene empleados asociados y responder `409 Conflict`.
- **Rationale**: Permite error semántico claro y consistente con reglas de negocio, independientemente de mensajes de DB subyacente.
- **Alternatives considered**:
  - Depender solo de excepción de FK en DB: rechazado por mensajes menos controlados y dependencia de motor.
  - Soft delete de departamentos: fuera de alcance y no solicitado.

## Decision 4: Paginación de departamentos con el patrón de empleados
- **Decision**: Reusar patrón `page`/`size` y respuesta paginada de Spring Data usado en `/api/v2/empleados`.
- **Rationale**: Consistencia funcional y menor curva de adopción para clientes.
- **Alternatives considered**:
  - Listado sin paginación: rechazado por requerimiento explícito.
  - Cursor pagination: rechazado por sobre-ingeniería para el alcance académico actual.

## Decision 5: Contrato OpenAPI con BearerAuth y errores estándar
- **Decision**: Documentar endpoints `/api/v2/departamentos` y cambios de empleados, manteniendo BearerAuth y respuestas 400/401/404/409.
- **Rationale**: Cumplimiento constitucional y continuidad con Swagger existente.
- **Alternatives considered**:
  - Documentación parcial solo de endpoints nuevos: rechazada por dejar ambiguo impacto en empleados.

## Decision 6: Estrategia de pruebas combinada unit + integración
- **Decision**: Priorizar pruebas unitarias de reglas de negocio y pruebas de integración para flujo completo (JWT, CRUD, validaciones, migración).
- **Rationale**: Reduce riesgo de regresión en seguridad y consistencia de datos.
- **Alternatives considered**:
  - Solo pruebas de integración: rechazado por menor precisión de diagnóstico.
  - Solo pruebas unitarias: rechazado por no validar wiring real con DB/migraciones.
