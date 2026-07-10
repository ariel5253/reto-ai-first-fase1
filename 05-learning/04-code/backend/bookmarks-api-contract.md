# Bookmarks API contract

Fuente de verdad usada:

- `06-code/db/init/01-schema.sql` — tabla `bookmark`.
- `05-learning/03-requirements/user-stories.md` — HU-005, HU-006, HU-014.

## Contexto de datos

Tabla base:

```sql
bookmark (
  id bigint generated always as identity primary key,
  user_id bigint not null references app_user(id) on delete cascade,
  opportunity_id bigint not null references public_opportunity(id) on delete restrict,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
)
```

Reglas derivadas:

- Un bookmark pertenece siempre a un usuario autenticado (`user_id`).
- Un bookmark referencia una oportunidad existente (`public_opportunity.id`).
- Un mismo usuario no puede guardar dos veces la misma oportunidad.
- `notes` existe en DB, pero para el MVP de HU-005/HU-006 se crea como `null`.
- El frontend nunca envía `user_id`; el backend lo extrae del JWT.

## POST /api/v1/bookmarks

Crea un bookmark para el usuario autenticado.

### Headers requeridos

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request body

```json
{
  "opportunity_id": 1
}
```

| Campo | Tipo | Reglas |
|---|---|---|
| `opportunity_id` | int | Requerido. Debe existir en `public_opportunity.id`. |

### Response 201

```json
{
  "id": 1,
  "opportunity_id": 1,
  "notes": null,
  "created_at": "2026-07-09T18:30:00Z"
}
```

| Campo | Origen |
|---|---|
| `id` | `bookmark.id` |
| `opportunity_id` | `bookmark.opportunity_id` |
| `notes` | `bookmark.notes`, `null` en esta versión |
| `created_at` | `bookmark.created_at` |

### Errores

| Status | Caso |
|---|---|
| 401 | Token ausente, inválido o expirado. |
| 404 | `opportunity_id` no existe en `public_opportunity`. |
| 409 | Ya existe bookmark para el par `(user_id, opportunity_id)`. |
| 422 | Payload inválido: campo requerido ausente, tipo incorrecto o `opportunity_id` no entero. |

### Regla de aislamiento — HU-014

- El `user_id` se extrae exclusivamente del JWT (`sub`).
- El request body no acepta `user_id`.
- Si el cliente envía un `user_id`, debe ignorarse o rechazarse según la validación Pydantic definida en implementación; nunca debe usarse para ownership.
- Un usuario solo puede crear bookmarks asociados a su propio `user_id` autenticado.

## GET /api/v1/bookmarks

Lista bookmarks del usuario autenticado.

### Headers requeridos

```http
Authorization: Bearer <access_token>
```

### Request body

No aplica.

### Response 200

```json
{
  "items": [
    {
      "id": 1,
      "opportunity_id": 1,
      "title": "Prestación de servicios profesionales para procesar información GEIH",
      "entity_name": "DEPARTAMENTO ADMINISTRATIVO NACIONAL DE ESTADISTICA (DANE)",
      "created_at": "2026-07-09T18:30:00Z"
    }
  ],
  "total": 1
}
```

| Campo | Origen |
|---|---|
| `items[].id` | `bookmark.id` |
| `items[].opportunity_id` | `bookmark.opportunity_id` |
| `items[].title` | `public_opportunity.title` |
| `items[].entity_name` | `contracting_entity.name` vía `public_opportunity.entity_id` |
| `items[].created_at` | `bookmark.created_at` |
| `total` | Cantidad de bookmarks retornados para el usuario autenticado |

### Errores

| Status | Caso |
|---|---|
| 401 | Token ausente, inválido o expirado. |

### Regla de aislamiento — HU-014

- El backend filtra por `bookmark.user_id = JWT.sub`.
- La respuesta retorna solo bookmarks del usuario autenticado.
- No existe parámetro `user_id` en query string ni body.
- Un usuario no puede listar bookmarks de otro usuario aunque conozca IDs de oportunidades o bookmarks.

## DELETE /api/v1/bookmarks/{id}

Elimina un bookmark del usuario autenticado.

### Headers requeridos

```http
Authorization: Bearer <access_token>
```

### Path params

| Parámetro | Tipo | Reglas |
|---|---|---|
| `id` | int | ID del bookmark a eliminar. |

### Response 204

Sin body.

### Errores

| Status | Caso |
|---|---|
| 401 | Token ausente, inválido o expirado. |
| 404 | El bookmark no existe o no pertenece al usuario autenticado. |

### Regla de aislamiento — HU-014

- La eliminación debe ejecutar la condición equivalente a `where id = :bookmark_id and user_id = :authenticated_user_id`.
- Si el bookmark existe pero pertenece a otro usuario, la respuesta debe ser `404` para no revelar existencia de datos ajenos.
- El `user_id` nunca se recibe desde el cliente.

## Resumen de HU cubiertas

| HU | Cobertura del contrato |
|---|---|
| HU-005 | Crear bookmark asociado al usuario autenticado, evitar duplicados y validar existencia de oportunidad. |
| HU-006 | Listar bookmarks guardados del usuario autenticado con datos mínimos de oportunidad. |
| HU-014 | Aislamiento por JWT: crear, listar y eliminar siempre filtrando por `user_id` extraído del token. |
