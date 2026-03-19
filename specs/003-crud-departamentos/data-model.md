# Data Model - Feature 003 CRUD de Departamentos

## Entity: Departamento
- **Description**: Catálogo organizacional al que pertenecen empleados.
- **Fields**:
  - `clave` (string, PK, no nulo)
  - `nombre` (string, no nulo, único)
- **Validation Rules**:
  - `nombre` obligatorio
  - `nombre` sin duplicados lógicos en catálogo
- **Relationships**:
  - 1:N con `Empleado` (un departamento puede tener muchos empleados)

## Entity: Empleado (impactado)
- **Description**: Entidad existente de personal, ahora con referencia departamental obligatoria.
- **Fields impacted**:
  - `departamentoClave` (string, no nulo en estado final)
- **Validation Rules**:
  - `departamentoClave` obligatorio en create/update
  - `departamentoClave` debe existir en `Departamento`
- **Relationships**:
  - N:1 hacia `Departamento` (cada empleado pertenece a exactamente un departamento)

## Persistence Constraints
- `departamentos.clave` como clave primaria.
- Restricción de unicidad para `departamentos.nombre`.
- `empleados.departamento_clave` con `FOREIGN KEY` a `departamentos.clave`.
- `empleados.departamento_clave` obligatorio (`NOT NULL`) tras backfill.

## Data Migration States
1. **Pre-migration**: `empleados` existe sin referencia obligatoria a departamento.
2. **Transition**:
   - Se crea `departamentos`.
   - Se inserta departamento semilla.
   - Se agrega columna en `empleados` y se rellena con departamento válido.
3. **Final state**:
   - `empleados.departamento_clave` queda `NOT NULL`.
   - FK activa y consistente para toda fila existente y nueva.
