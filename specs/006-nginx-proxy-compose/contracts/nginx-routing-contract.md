# Contract - Nginx Routing and Network Exposure (Feature 006)

## 1. Entry Point Contract

- El acceso desde host MUST ocurrir solo por el servicio `nginx`.
- `nginx` MUST publicar un puerto HTTP al host para uso local.
- `app`, `frontend` y `postgres` MUST permanecer sin puertos publicados al host.

## 2. Routing Contract

- `location /api` MUST enrutar al servicio `app` en su puerto interno.
- `location /` MUST enrutar al servicio `frontend` en su puerto interno.
- La precedencia de `/api` MUST ser explicita para evitar captura por `/`.

## 3. Service Name Preservation Contract

- Los servicios existentes MUST conservar sus nombres en compose: `postgres`, `app`, `frontend`.
- La incorporacion de proxy MUST agregar `nginx` sin renombrar servicios actuales.

## 4. Internal Communication Contract

- La comunicacion entre contenedores MUST usar nombres de servicio Docker.
- La conectividad `nginx -> frontend` y `nginx -> app` MUST ser valida en red interna.
- La conectividad `app -> postgres` MUST mantenerse sin cambios funcionales.

## 5. Docker Network Good Practices Contract

- El compose MUST declarar explicitamente red(es) para distinguir exposicion al host de trafico interno.
- Los servicios internos MUST pertenecer a red privada de aplicacion.
- El proxy MUST pertenecer a la red que le permita acceder a `frontend` y `app`.

## 6. Compatibility Contract

- El flujo funcional actual (UI, auth, llamadas API) MUST continuar operando via entrypoint Nginx.
- Esta feature MUST evitar cambios de logica de negocio.
- Esta feature MUST evitar cambios de esquema PostgreSQL y nuevas migraciones Flyway.

## 7. OpenAPI/Auth Matrix Impact

| Area | Impacto esperado | Evidencia requerida |
|------|------------------|---------------------|
| OpenAPI/Swagger | **Sin cambios de contrato** (solo capa de red/proxy) | Verificacion documental en quickstart y cierre de consistencia (T043) |
| Auth/JWT/Authorization | **Sin cambios** en politicas por endpoint; Nginx no altera validacion JWT ni reglas de autorizacion | Regresion critica auth + flujo principal via entrypoint Nginx (T041) |
| PostgreSQL/Flyway | **Sin cambios** de esquema ni nuevas migraciones para esta feature | Nota explicita de no-impacto y validacion operativa del stack (T034/T040) |
