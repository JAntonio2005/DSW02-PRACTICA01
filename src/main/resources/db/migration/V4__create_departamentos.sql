CREATE SEQUENCE IF NOT EXISTS departamentos_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS departamentos (
    clave VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_departamentos_clave ON departamentos (clave);
CREATE UNIQUE INDEX IF NOT EXISTS uk_departamentos_nombre_lower ON departamentos (LOWER(nombre));
