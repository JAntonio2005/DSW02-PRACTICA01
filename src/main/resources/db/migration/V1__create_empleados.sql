CREATE SEQUENCE IF NOT EXISTS empleados_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS empleados (
    clave VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    telefono VARCHAR(100) NOT NULL,
    CONSTRAINT chk_empleados_clave_format CHECK (clave ~ '^EMP-[0-9]+$')
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_empleados_clave ON empleados (clave);
