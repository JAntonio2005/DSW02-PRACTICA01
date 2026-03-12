ALTER TABLE empleados
    ADD COLUMN IF NOT EXISTS correo VARCHAR(255),
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(64);

CREATE UNIQUE INDEX IF NOT EXISTS uk_empleados_correo_lower
    ON empleados (LOWER(correo))
    WHERE correo IS NOT NULL;

CREATE TABLE IF NOT EXISTS evento_autenticacion (
    id BIGSERIAL PRIMARY KEY,
    clave_empleado VARCHAR(100),
    correo VARCHAR(255),
    exitoso BOOLEAN NOT NULL,
    detalle VARCHAR(255),
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evento_autenticacion_fecha ON evento_autenticacion (fecha_hora DESC);
CREATE INDEX IF NOT EXISTS idx_evento_autenticacion_clave ON evento_autenticacion (clave_empleado);
