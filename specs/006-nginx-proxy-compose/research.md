# Phase 0 Research - Feature 006 Nginx Reverse Proxy en Docker Compose

## Decision 1: Nginx como unico punto de entrada al host
- **Decision**: Exponer al host solo el servicio `nginx` (puerto HTTP), eliminando publicaciones directas de `app`, `frontend` y `postgres`.
- **Rationale**: Cumple el objetivo de edge unico, reduce superficie de exposicion y evita bypass de proxy.
- **Alternatives considered**:
  - Mantener puertos `8080` y `4200` publicados para debug: contradice el requisito de unico entrypoint.
  - Publicar tambien `5432`: util para clientes DB externos, pero rompe aislamiento interno por defecto.

## Decision 2: Enrutamiento por prefijo
- **Decision**: Configurar Nginx con reglas explicitas: `/api` hacia `app:8080` y `/` hacia `frontend:4200`.
- **Rationale**: Separa claramente trafico backend/frontend con baja complejidad operativa y alta legibilidad.
- **Alternatives considered**:
  - Enrutamiento por subdominio (`api.localhost`, `web.localhost`): requiere DNS/hosts adicionales y aumenta friccion local.
  - Multiples listeners/puertos en Nginx: innecesario para alcance actual.

## Decision 3: Red Docker interna dedicada
- **Decision**: Usar una red definida de compose para comunicacion entre `nginx`, `frontend`, `app` y `postgres`, sin exponer servicios internos al host.
- **Rationale**: Refuerza aislamiento y hace explicita la diferencia entre acceso host y trafico interno.
- **Alternatives considered**:
  - Red implicita por defecto sin declaracion: funcional pero menos clara para mantenimiento y auditoria.
  - Redes separadas por capa con bridge extra: sobreingenieria para alcance de esta feature.

## Decision 4: Conservacion de servicios existentes
- **Decision**: Mantener los nombres de servicio actuales (`postgres`, `app`, `frontend`) y agregar `nginx` como capa de borde.
- **Rationale**: Minimiza impacto en scripts, dependencias y flujo existente.
- **Alternatives considered**:
  - Renombrar servicios para reflejar nuevo modelo (`backend`, `web`): agrega costo de migracion sin valor funcional.

## Decision 5: Configuracion Nginx versionada en repo
- **Decision**: Versionar archivo de configuracion en `docker/nginx/default.conf` y montarlo en el contenedor `nginx`.
- **Rationale**: Trazabilidad completa y reproducibilidad del entorno.
- **Alternatives considered**:
  - Config inline via command/env vars: menos mantenible para reglas de proxy y headers.

## Decision 6: Compatibilidad con flujo actual del proyecto
- **Decision**: Mantener comportamientos funcionales existentes del frontend/backend y ajustar solo lo minimo necesario para consumo via proxy (`/api`) en ejecucion docker.
- **Rationale**: Evita regresiones y mantiene alcance en infraestructura.
- **Alternatives considered**:
  - Refactor amplio de configuracion frontend por entornos: excede alcance de la feature 006.
