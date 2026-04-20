# Data Model - Feature 005 Cypress E2E Base Suite

## Entity: E2ETestScenario
- **Description**: Caso de prueba ejecutable de extremo a extremo.
- **Fields**:
  - `id` (string, único)
  - `name` (string)
  - `priority` (enum: P1, P2, P3)
  - `preconditions` (string[])
  - `steps` (string[])
  - `expectedResults` (string[])
  - `tags` (string[])
- **Validation Rules**:
  - Debe tener al menos un resultado esperado.
  - Debe mapearse a una historia de usuario del spec.

## Entity: E2ERunReport
- **Description**: Resultado consolidado de una corrida E2E.
- **Fields**:
  - `runId` (string)
  - `startedAt` (datetime)
  - `endedAt` (datetime)
  - `environment` (string)
  - `executed` (number)
  - `passed` (number)
  - `failed` (number)
  - `artifacts` (string[])
- **Validation Rules**:
  - `executed = passed + failed`.
  - Debe existir timestamp de inicio y fin.

## Entity: TestDataProfile
- **Description**: Conjunto de datos mínimos para habilitar escenarios críticos.
- **Fields**:
  - `profileName` (string)
  - `authUser` (string)
  - `requiredEntities` (string[])
  - `datasetPrefix` (string)
- **Validation Rules**:
  - Debe incluir usuario autenticable válido.
  - El prefijo de datos no debe colisionar con datos de negocio reales.

## Relationships
- Un `E2ERunReport` agrega múltiples `E2ETestScenario` ejecutados.
- Un `E2ETestScenario` puede depender de un `TestDataProfile`.

## State Transitions
1. `E2ETestScenario`: Defined -> Automated -> Executed -> Stable.
2. `E2ERunReport`: Started -> Completed -> Archived.
