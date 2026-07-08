# Base de datos — Portal de Convocatorias Públicas

Esta carpeta contiene el modelo lógico de base de datos del producto DEV del reto AI-First Fase 1.

## Archivos

- `modelo-logico-3nf.md`: definición lógica normalizada a Tercera Forma Normal (3NF), entidades, atributos, relaciones, constraints y trazabilidad a HU.
- `schema-logico.sql`: DDL PostgreSQL de referencia para validar el modelo lógico antes de implementar migraciones.
- `docker-compose.yml`: contenedor PostgreSQL local para montar la base de datos del reto.
- `.env`: credenciales locales solicitadas para el contenedor. Está ignorado por Git.
- `.env.example`: ejemplo de variables para reproducir el contenedor.
- `init/01-schema.sql`: schema para inicializar PostgreSQL.
- `init/02-seed-catalogs.sql`: catálogos mínimos de fuente SECOP, dataset, estados y filtros.
- `init/03-seed-dev-synthetic.sql`: datos sintéticos DEV para validar relaciones en PostgreSQL. Estos datos viven solo en DB; está prohibido copiarlos al backend o frontend.

Nota WSL/Docker Desktop: el compose usa volumen nombrado para datos. En este entorno no monta `./init` directamente porque Docker Desktop puede fallar accediendo a mounts de la distro WSL; por eso los scripts se aplican con `docker compose exec -T postgres psql ... < init/*.sql`.

## Ejecución local con Docker

Desde esta carpeta:

```bash
cd codigo/db
docker compose up -d
docker compose exec -T postgres psql -U admin -d portal_convocatorias < init/01-schema.sql
docker compose exec -T postgres psql -U admin -d portal_convocatorias < init/02-seed-catalogs.sql
docker compose exec -T postgres psql -U admin -d portal_convocatorias < init/03-seed-dev-synthetic.sql
```

Credenciales locales configuradas para PostgreSQL:

```text
host: localhost
port: 5432
database: portal_convocatorias
user: admin
password: abcd1234
```

Verificación sugerida:

```bash
docker compose exec postgres psql -U admin -d portal_convocatorias -c "\dt"
docker compose exec postgres psql -U admin -d portal_convocatorias -c "select count(*) from search_filter_key;"
```

Si se necesita reconstruir la base desde cero:

```bash
docker compose down -v
docker compose up -d
docker compose exec -T postgres psql -U admin -d portal_convocatorias < init/01-schema.sql
docker compose exec -T postgres psql -U admin -d portal_convocatorias < init/02-seed-catalogs.sql
docker compose exec -T postgres psql -U admin -d portal_convocatorias < init/03-seed-dev-synthetic.sql
```

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
