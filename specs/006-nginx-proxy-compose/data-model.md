# Data Model - Feature 006 Nginx Reverse Proxy Compose

## Entity: ComposeService
- **Description**: Servicio definido en `docker-compose.yml`.
- **Fields**:
  - `name` (string) - nombre logico del servicio (`nginx`, `frontend`, `app`, `postgres`).
  - `containerName` (string) - nombre de contenedor efectivo.
  - `internalPort` (number) - puerto de escucha dentro del contenedor.
  - `hostPublishedPorts` (string[]) - puertos publicados al host (puede ser vacio).
  - `networks` (string[]) - redes Docker asociadas.
- **Validation Rules**:
  - Solo `nginx` puede tener `hostPublishedPorts` no vacio.
  - `app`, `frontend` y `postgres` deben ser alcanzables por nombre de servicio dentro de red interna.

## Entity: RoutingRule
- **Description**: Regla de enrutamiento reverse proxy administrada por Nginx.
- **Fields**:
  - `pathPrefix` (string) - prefijo entrante (`/api`, `/`).
  - `upstreamService` (string) - servicio destino (`app`, `frontend`).
  - `upstreamPort` (number) - puerto destino interno.
  - `stripPrefix` (boolean) - indica si reescribe ruta antes de forward.
  - `timeoutPolicy` (object) - timeouts de proxy.
- **Validation Rules**:
  - Debe existir regla para `/api` y para `/`.
  - No debe haber ambiguedad de precedencia entre reglas.

## Entity: ExposurePolicy
- **Description**: Politica de exposicion de puertos host vs red interna.
- **Fields**:
  - `entrypointService` (string) - servicio unico expuesto al host.
  - `allowedHostPorts` (string[]) - mapeos permitidos.
  - `internalOnlyServices` (string[]) - servicios no publicados.
- **Validation Rules**:
  - `entrypointService` debe ser `nginx`.
  - `internalOnlyServices` debe incluir `app`, `frontend`, `postgres`.

## Relationships
- Un `ComposeService` de tipo `nginx` aplica multiples `RoutingRule`.
- `ExposurePolicy` gobierna todos los `ComposeService`.

## State Transitions
1. `ComposeService`: Defined -> Built/Pulled -> Running -> Healthy.
2. `RoutingRule`: Draft -> Configured -> Validated.
3. `ExposurePolicy`: Draft -> Enforced -> Verified.
