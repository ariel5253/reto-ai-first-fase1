# Base de datos — Portal de Convocatorias Públicas

Esta carpeta contiene el modelo lógico de base de datos del producto DEV del reto AI-First Fase 1.

## Archivos

- `modelo-logico-3nf.md`: definición lógica normalizada a Tercera Forma Normal (3NF), entidades, atributos, relaciones, constraints y trazabilidad a HU.
- `schema-logico.sql`: DDL PostgreSQL de referencia para validar el modelo lógico antes de implementar migraciones.

## Convención de nombres

- Entidades y tablas del modelo de datos van en singular.
- La tabla de usuarios se llama `app_user`, no `user`, para mantener singular y evitar colisión con nombres reservados de PostgreSQL.

## Reglas aplicadas

- PostgreSQL como motor objetivo.
- Modelo en 3NF sin excepciones de desnormalización en esta versión.
- Tablas y columnas en `snake_case`.
- Llaves primarias surrogate con `bigint generated always as identity`.
- Integridad persistente protegida por foreign keys, unique constraints y check constraints.
- Datos SECOP/datos.gov.co encapsulados como fuente externa; solo se persisten campos normalizados necesarios para bookmark/detalle si el backend decide guardar una oportunidad.
- Trazabilidad externa mínima mediante `opportunity_source`, `opportunity_dataset`, `external_id`, `external_process_id`, `source_synced_at`, `source_last_seen_at` y `detail_url`.
- No se persiste payload bruto SECOP en el modelo 3NF base; si se requiere auditoría avanzada, debe documentarse como excepción o extensión futura.
- Búsquedas guardadas modeladas como filtros normalizados clave/valor, evitando JSON opaco como fuente principal de verdad.
- Un mismo filtro puede tener varios valores en `saved_search_filter_value` para soportar estados, entidades o rangos modelados como claves separadas.
- Fechas de oportunidad como `timestamptz` para no perder precisión si SECOP entrega fecha/hora.
- Montos públicos en `estimated_amount_cents`; si SECOP entrega pesos COP enteros, convertir a centavos (`pesos * 100`) antes de persistir.
