INSERT INTO empleados (
    clave,
    nombre,
    direccion,
    telefono,
    correo,
    password_hash
)
SELECT
    'EMP-1',
    'Administrador',
    'Oficina central',
    '9999999999',
    'admin@empresa.com',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
WHERE NOT EXISTS (
    SELECT 1 FROM empleados WHERE clave = 'EMP-1'
);