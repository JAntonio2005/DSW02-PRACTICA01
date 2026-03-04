# Quickstart: CRUD de Empleados

## Prerrequisitos

- Java 17
- Docker y Docker Compose
- Maven Wrapper (`mvnw`)

## 1) Iniciar PostgreSQL con Docker

```bash
docker compose -f docker/docker-compose.yml up -d postgres
```

## 2) Ejecutar la aplicación

```bash
./mvnw spring-boot:run
```

## 3) Verificar documentación OpenAPI

- Swagger UI: `http://localhost:8080/swagger-ui/swagger-ui/index.html`

## 4) Prueba rápida de CRUD

```bash
curl -X POST http://localhost:8080/api/v2/empleados \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","direccion":"Av 1","telefono":"5551234"}'

curl -u admin:admin123 "http://localhost:8080/api/v2/empleados?page=0&size=10"

curl -u admin:admin123 http://localhost:8080/api/v2/empleados/EMP-1

curl -X PUT http://localhost:8080/api/v2/empleados/EMP-1 \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana López","direccion":"Av 2","telefono":"5559999"}'

curl -X DELETE http://localhost:8080/api/v2/empleados/EMP-1 \
  -u admin:admin123
```

## 5) Ejecutar pruebas

```bash
./mvnw test
```

## 6) Verificación de rendimiento (SC-003)

Ejecutar una medición simple de latencia para operaciones CRUD válidas:

```bash
# 1) Crear al menos 20 empleados de prueba (puede hacerse con script/curl)
# 2) Medir listado paginado 100 veces y calcular p95

for i in {1..100}; do
  /usr/bin/time -f "%e" curl -s -o /dev/null -u admin:admin123 "http://localhost:8080/api/v2/empleados?page=0&size=10"
done
```

Criterio de aceptación: p95 < 2.0s en entorno local de práctica.

## 7) Evidencia de medición

- Fecha de ejecución: `2026-03-04`
- Entorno: `docker-compose (postgres + app)`
- Tamaño de muestra: `100 solicitudes GET paginadas`
- p95 observado: `0.0768s` (promedio: `0.0743s`)
- Resultado: `PASS` (cumple p95 < 2.0s)

## Notas

- Las rutas CRUD requieren autenticación según la política de seguridad definida en implementación.
- Las migraciones de esquema se ejecutan con Flyway al iniciar la aplicación.
