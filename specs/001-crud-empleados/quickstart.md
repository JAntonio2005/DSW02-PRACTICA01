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

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## 4) Prueba rápida de CRUD

```bash
curl -X POST http://localhost:8080/api/v1/empleados \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","direccion":"Av 1","telefono":"5551234"}'

curl -u admin:admin123 http://localhost:8080/api/v1/empleados

curl -u admin:admin123 http://localhost:8080/api/v1/empleados/EMP-1

curl -X PUT http://localhost:8080/api/v1/empleados/EMP-1 \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana López","direccion":"Av 2","telefono":"5559999"}'

curl -X DELETE http://localhost:8080/api/v1/empleados/EMP-1 \
  -u admin:admin123
```

## 5) Ejecutar pruebas

```bash
./mvnw test
```

## Notas

- Las rutas CRUD requieren autenticación según la política de seguridad definida en implementación.
- Las migraciones de esquema se ejecutan con Flyway al iniciar la aplicación.
