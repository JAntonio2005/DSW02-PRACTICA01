UPDATE empleados
SET departamento_clave = 'DEP-DEFAULT'
WHERE departamento_clave IS NULL;
