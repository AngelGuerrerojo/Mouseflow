-- Datos iniciales para que la app funcione de inmediato

-- Logros usados por los triggers (IDs 1 y 2)
INSERT INTO logros (id_logro, nombre, descripcion, icono_url)
VALUES
  (1, 'Primera lección', 'Completa tu primera lección', '🎯'),
  (2, 'Racha inicial', 'Completa 5 lecciones', '🏅')
ON CONFLICT (id_logro) DO NOTHING;

SELECT setval(pg_get_serial_sequence('logros', 'id_logro'), (SELECT MAX(id_logro) FROM logros));

-- Lecciones de ejemplo
INSERT INTO lecciones (titulo, contenido, orden)
VALUES
  ('Introducción a la programación', 'Contenido introductorio (HTML/Markdown permitido)', 1),
  ('Variables y tipos de datos', 'Repasa enteros, flotantes, strings y casting.', 2),
  ('Condicionales y bucles', 'Ejemplos con if/else, while y for.', 3)
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('lecciones', 'id_leccion'), (SELECT MAX(id_leccion) FROM lecciones));

-- Diccionario mínimo
INSERT INTO diccionario (palabra, definicion, ejemplo_codigo)
VALUES
  ('variable', 'Espacio nombrado en memoria para guardar un valor', 'let contador = 0;'),
  ('función', 'Bloque reutilizable de instrucciones', 'function saluda(nombre) { return `Hola ${nombre}`; }')
ON CONFLICT DO NOTHING;
