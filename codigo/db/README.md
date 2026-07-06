# Base de datos — Portal de Convocatorias Públicas

Esta carpeta contiene el modelo lógico de base de datos del producto DEV del reto AI-First Fase 1.

## Archivos

- `modelo-logico-3nf.md`: definición lógica normalizada a Tercera Forma Normal (3NF), entidades, atributos, relaciones, constraints y trazabilidad a HU.
- `schema-logico.sql`: DDL PostgreSQL de referencia para validar el modelo lógico antes de implementar migraciones.

## Reglas aplicadas

- PostgreSQL como motor objetivo.
- Modelo en 3NF sin excepciones de desnormalización en esta versión.
- Tablas y columnas en `snake_case`.
- Llaves primarias surrogate con `bigint generated always as identity`.
- Integridad persistente protegida por foreign keys, unique constraints y check constraints.
- Datos SECOP/datos.gov.co encapsulados como fuente externa; solo se persisten campos normalizados necesarios para bookmarks/detalle si el backend decide guardar una oportunidad.
- Búsquedas guardadas modeladas como filtros normalizados clave/valor, evitando JSON opaco como fuente principal de verdad.
