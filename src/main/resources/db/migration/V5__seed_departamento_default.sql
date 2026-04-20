INSERT INTO departamentos (clave, nombre)
SELECT 'DEP-DEFAULT', 'Sin Departamento'
WHERE NOT EXISTS (
    SELECT 1 FROM departamentos WHERE clave = 'DEP-DEFAULT'
);
