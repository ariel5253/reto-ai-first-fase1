# Modelo lógico 3NF — Portal de Convocatorias Públicas

## 1. Objetivo

Definir el modelo lógico inicial de la base de datos para el Track DEV del reto AI-First Fase 1. El producto es un Portal de Convocatorias Públicas con:

- Registro y login de usuarios.
- Autenticación JWT implementada en backend.
- Búsqueda de convocatorias públicas consultadas desde datos.gov.co / SECOP por medio del backend.
- Bookmarks de convocatorias por usuario.
- Búsquedas guardadas por usuario.
- Aislamiento de datos por usuario autenticado.

Este modelo cumple las reglas del proyecto:

- Motor objetivo: PostgreSQL.
- Normalización mínima: Tercera Forma Normal (3NF).
- Integridad protegida en base de datos con PK, FK, UNIQUE y CHECK.
- Tablas y columnas en `snake_case`.
- Sin acceso directo desde frontend.
- Sin persistir datos de prueba fuera de `db/` cuando se creen seeds/test-data.

## 2. Alcance del modelo

Incluido en esta versión:

- Usuarios.
- Fuentes externas de oportunidades.
- Entidades contratantes normalizadas.
- Estados de oportunidad normalizados.
- Oportunidades públicas persistidas como referencia normalizada cuando el sistema necesite asociarlas a bookmark o detalle.
- Bookmarks por usuario.
- Búsquedas guardadas.
- Catálogo de filtros de búsqueda.
- Valores de filtros por búsqueda guardada.

Fuera de alcance por ahora:

- Auditoría avanzada.
- Roles/permisos múltiples.
- Histórico de cambios de oportunidades SECOP.
- Cache completo de respuestas externas.
- Métricas de uso.

## 3. Decisión de normalización

El modelo está diseñado en 3NF sin excepción de desnormalización.

Criterios aplicados:

- 1NF: atributos atómicos; no listas repetidas en una columna.
- 2NF: todas las tablas con PK surrogate; atributos no clave dependen de la entidad completa representada por la tabla.
- 3NF: atributos no clave no dependen transitivamente de otros atributos no clave.

Ejemplos:

- El nombre de la entidad contratante vive en `contracting_entity`, no duplicado en cada bookmark.
- El estado de la oportunidad vive en `opportunity_status`, no como texto libre duplicado en `public_opportunity`.
- Los criterios de búsquedas guardadas no se guardan como JSON opaco principal; se separan en `saved_search_filter_value` y `search_filter_key`.
- Un bookmark no copia datos de la convocatoria; referencia `public_opportunity`.

## 4. Entidades y atributos

### 4.1 `app_user`

Representa usuarios registrados del portal.

| Atributo | Tipo lógico | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `email` | varchar(320) | requerido, único, formato validado por backend |
| `password_hash` | text | requerido, nunca password plano |
| `full_name` | varchar(160) | opcional |
| `is_active` | boolean | requerido, default true |
| `created_at` | timestamptz | requerido |
| `updated_at` | timestamptz | requerido |

Relaciones:

- 1 usuario tiene 0..N bookmark.
- 1 usuario tiene 0..N búsquedas guardadas.

Constraints principales:

- `unique(email)`.
- `check (email = lower(email))` para mantener unicidad consistente.
- `check (char_length(password_hash) >= 20)`.

HU relacionadas: HU-001, HU-002, HU-014.

### 4.2 `opportunity_source`

Catálogo de fuentes externas de convocatorias.

| Atributo | Tipo lógico | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `code` | varchar(50) | requerido, único. Ej: `SECOP` |
| `name` | varchar(160) | requerido |
| `base_url` | text | opcional |
| `created_at` | timestamptz | requerido |

Relaciones:

- 1 fuente tiene 0..N oportunidades públicas.

HU relacionadas: HU-003, HU-004, HU-008, HU-009.

### 4.3 `contracting_entity`

Entidades contratantes normalizadas.

| Atributo | Tipo lógico | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `source_id` | bigint | FK a `opportunity_source` |
| `external_id` | varchar(120) | opcional, identificador externo si SECOP lo provee |
| `name` | varchar(260) | requerido |
| `normalized_name` | varchar(260) | requerido para búsquedas/únicos consistentes |
| `created_at` | timestamptz | requerido |
| `updated_at` | timestamptz | requerido |

Relaciones:

- 1 entidad contratante tiene 0..N oportunidades.

Constraints principales:

- `unique(source_id, external_id)` cuando exista `external_id`.
- `unique(source_id, normalized_name)`.

HU relacionadas: HU-003, HU-004, HU-009.

### 4.4 `opportunity_status`

Catálogo de estados de oportunidades.

| Atributo | Tipo lógico | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `code` | varchar(50) | requerido, único |
| `name` | varchar(120) | requerido |
| `created_at` | timestamptz | requerido |

Relaciones:

- 1 estado tiene 0..N oportunidades.

HU relacionadas: HU-003, HU-004, HU-009.

### 4.5 `public_opportunity`

Convocatorias públicas normalizadas que el sistema decide persistir para bookmark, detalle o seguimiento.

| Atributo | Tipo lógico | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `source_id` | bigint | FK a `opportunity_source` |
| `external_id` | varchar(160) | requerido, identificador en la fuente externa |
| `entity_id` | bigint | FK a `contracting_entity` |
| `status_id` | bigint | FK a `opportunity_status`, opcional si fuente no lo informa |
| `title` | text | requerido |
| `description` | text | opcional |
| `estimated_amount_cents` | bigint | opcional, monto en centavos si existe |
| `published_at` | date | opcional |
| `closing_at` | date | opcional |
| `detail_url` | text | opcional |
| `created_at` | timestamptz | requerido |
| `updated_at` | timestamptz | requerido |

Constraints principales:

- `unique(source_id, external_id)`.
- `check (estimated_amount_cents is null or estimated_amount_cents >= 0)`.
- `check (closing_at is null or published_at is null or closing_at >= published_at)`.

Nota 3NF:

- No se duplica el nombre de entidad ni el nombre del estado.
- La oportunidad conserva solo datos propios de la oportunidad.

HU relacionadas: HU-003, HU-004, HU-005, HU-006, HU-009.

### 4.6 `bookmark`

Convocatorias guardadas por usuario.

| Atributo | Tipo lógico | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `user_id` | bigint | FK a `app_user` |
| `opportunity_id` | bigint | FK a `public_opportunity` |
| `notes` | text | opcional |
| `created_at` | timestamptz | requerido |

Constraints principales:

- `unique(user_id, opportunity_id)` para evitar duplicados por usuario.
- `on delete cascade` desde usuario.
- `on delete restrict` desde oportunidad, para no romper historial de usuario.

HU relacionadas: HU-005, HU-006, HU-014.

### 4.7 `saved_search`

Búsquedas guardadas por usuario.

| Atributo | Tipo lógico | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `user_id` | bigint | FK a `app_user` |
| `name` | varchar(120) | requerido |
| `created_at` | timestamptz | requerido |
| `updated_at` | timestamptz | requerido |

Constraints principales:

- `unique(user_id, name)`.
- `check (btrim(name) <> '')`.

HU relacionadas: HU-007, HU-014.

### 4.8 `search_filter_key`

Catálogo de filtros permitidos para búsquedas guardadas.

| Atributo | Tipo lógico | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `code` | varchar(60) | requerido, único. Ej: `keyword`, `entity`, `status`, `published_from` |
| `name` | varchar(120) | requerido |
| `value_type` | varchar(30) | requerido: `text`, `date`, `number`, `boolean` |
| `is_active` | boolean | requerido, default true |
| `created_at` | timestamptz | requerido |

HU relacionadas: HU-007, HU-009.

### 4.9 `saved_search_filter_value`

Valores de filtros asociados a una búsqueda guardada.

| Atributo | Tipo lógico | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `saved_search_id` | bigint | FK a `saved_search` |
| `filter_key_id` | bigint | FK a `search_filter_key` |
| `filter_value` | text | requerido |
| `created_at` | timestamptz | requerido |

Constraints principales:

- `unique(saved_search_id, filter_key_id)`.
- `check (btrim(filter_value) <> '')`.
- `on delete cascade` desde búsqueda guardada.

Nota 3NF:

- El significado/tipo del filtro vive en `search_filter_key`.
- El valor específico vive en `saved_search_filter_value`.
- No hay columnas repetidas tipo `filter_1`, `filter_2`, etc.

HU relacionadas: HU-007, HU-014.

## 5. Relaciones cardinales

```text
app_user 1 ─── 0..N bookmark
app_user 1 ─── 0..N saved_search

opportunity_source 1 ─── 0..N contracting_entity
opportunity_source 1 ─── 0..N public_opportunity
contracting_entity 1 ─── 0..N public_opportunity
opportunity_status 1 ─── 0..N public_opportunity

public_opportunity 1 ─── 0..N bookmark
saved_search 1 ─── 0..N saved_search_filter_value
search_filter_key 1 ─── 0..N saved_search_filter_value
```

## 6. Diagrama lógico textual

```text
user
  id PK
  email UK
  password_hash
  full_name
  is_active
  created_at
  updated_at

opportunity_source
  id PK
  code UK
  name
  base_url
  created_at

contracting_entity
  id PK
  source_id FK -> opportunity_source.id
  external_id
  name
  normalized_name
  created_at
  updated_at
  UK(source_id, external_id)
  UK(source_id, normalized_name)

opportunity_status
  id PK
  code UK
  name
  created_at

public_opportunity
  id PK
  source_id FK -> opportunity_source.id
  external_id
  entity_id FK -> contracting_entity.id
  status_id FK -> opportunity_status.id
  title
  description
  estimated_amount_cents
  published_at
  closing_at
  detail_url
  created_at
  updated_at
  UK(source_id, external_id)

bookmark
  id PK
  user_id FK -> app_user.id
  opportunity_id FK -> public_opportunity.id
  notes
  created_at
  UK(user_id, opportunity_id)

saved_search
  id PK
  user_id FK -> app_user.id
  name
  created_at
  updated_at
  UK(user_id, name)

search_filter_key
  id PK
  code UK
  name
  value_type
  is_active
  created_at

saved_search_filter_value
  id PK
  saved_search_id FK -> saved_search.id
  filter_key_id FK -> search_filter_key.id
  filter_value
  created_at
  UK(saved_search_id, filter_key_id)
```

## 7. Índices recomendados

| Índice | Motivo |
|---|---|
| `idx_app_user_email` | Login por email |
| `idx_public_opportunity_entity_id` | Filtro por entidad |
| `idx_public_opportunity_status_id` | Filtro por estado |
| `idx_public_opportunity_published_at` | Orden/filtro por fecha de publicación |
| `idx_bookmark_user_id` | Listar bookmark del usuario autenticado |
| `idx_saved_search_user_id` | Listar búsquedas guardadas del usuario autenticado |
| `idx_saved_search_filter_value_saved_search_id` | Cargar filtros de una búsqueda guardada |

## 8. Trazabilidad con requisitos del reto

| HU | Cobertura del modelo |
|---|---|
| HU-001 | `app_user.email`, `app_user.password_hash`, unicidad y checks básicos |
| HU-002 | `app_user` soporta login; JWT vive en backend, no se persiste como token plano |
| HU-003 | `public_opportunity`, `contracting_entity`, `opportunity_status`, `opportunity_source` |
| HU-004 | `public_opportunity.detail_url` y campos normalizados de detalle básico |
| HU-005 | `bookmark` con FK a usuario y oportunidad, unique anti-duplicado |
| HU-006 | `bookmark.user_id` permite listar solo datos del usuario autenticado |
| HU-007 | `saved_search`, `search_filter_key`, `saved_search_filter_value` |
| HU-008 | Fuente externa modelada en `opportunity_source`; fallos se manejan en backend |
| HU-009 | Schema PostgreSQL 3NF con constraints e índices |
| HU-010 | Modelo soporta contrato REST de auth, búsqueda, detalle, bookmark y búsquedas guardadas |
| HU-011 | Constraints verificables desde tests API/DB |
| HU-012 | Modelo documentado para futura ejecución local reproducible |
| HU-013 | Cambio debe quedar en `SOUL.md` y change-log |
| HU-014 | Ownership por `user_id` en bookmark y búsquedas guardadas |

## 9. Reglas para implementación posterior

- Crear migraciones en una carpeta de DB o backend acordada, sin inventar otro stack.
- No guardar passwords en texto plano.
- No guardar JWT emitidos como fuente de sesión en base de datos para esta fase.
- No permitir bookmark sin usuario ni oportunidad.
- No permitir búsquedas guardadas sin usuario.
- No consumir datos.gov.co / SECOP desde frontend.
- Si se decide guardar respuesta cruda de SECOP, documentar una excepción separada; no forma parte del modelo 3NF base.
