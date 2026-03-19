ALTER TABLE empleados
    ADD COLUMN IF NOT EXISTS departamento_clave VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_empleados_departamento_clave ON empleados (departamento_clave);
