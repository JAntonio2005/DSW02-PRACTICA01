UPDATE empleados
SET departamento_clave = 'DEP-DEFAULT'
WHERE departamento_clave IS NULL;

ALTER TABLE empleados
    ALTER COLUMN departamento_clave SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_empleados_departamento'
          AND table_name = 'empleados'
    ) THEN
        ALTER TABLE empleados
            ADD CONSTRAINT fk_empleados_departamento
                FOREIGN KEY (departamento_clave)
                REFERENCES departamentos (clave);
    END IF;
END $$;
