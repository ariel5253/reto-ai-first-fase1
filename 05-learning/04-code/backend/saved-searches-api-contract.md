# Saved searches API contract

Fuente de verdad usada:

- `06-code/db/init/01-schema.sql` — tablas `saved_search`, `search_filter_key` y `saved_search_filter_value`.
- `05-learning/03-requirements/user-stories.md` — HU-007 y HU-014.

## Contexto de datos

Tablas base:

```sql
saved_search (
  id bigint generated always as identity primary key,
  user_id bigint not null references app_user(id) on delete cascade,
  name varchar(120) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name),
  check (btrim(name) <> '')
)

search_filter_key (
  id bigint generated always as identity primary key,
  code varchar(60) not null unique,
  name varchar(120) not null,
  value_type varchar(30) not null check (value_type in ('text', 'date', 'number', 'boolean')),
  is_active boolean not null default true
)

saved_search_filter_value (
  id bigint generated always as identity primary key,
  saved_search_id bigint not null references saved_search(id) on delete cascade,
  filter_key_id bigint not null references search_filter_key(id) on delete restrict,
  filter_value text not null,
  value_order integer not null default 1,
  unique (saved_search_id, filter_key_id, filter_value),
  check (value_order > 0),
  check (btrim(filter_value) <> '')
)
```

Reglas derivadas:

- Una búsqueda guardada pertenece siempre a un usuario autenticado (`saved_search.user_id`).
- `saved_search.name` es obligatorio, máximo 120 caracteres, no puede estar vacío ni contener solo espacios.
- El nombre es único por usuario: dos usuarios distintos sí pueden usar el mismo nombre.
- Los filtros se persisten como pares `key`/`value`.
- `key` referencia `search_filter_key.code`.
- `value` se persiste como `saved_search_filter_value.filter_value`.
- Múltiples values para el mismo key son válidos si el valor no se repite para la misma búsqueda.

## POST /api/v1/saved-searches

Crea una búsqueda guardada para el usuario autenticado.

### Headers requeridos

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request body

```json
{
  "name": "Convocatorias DANE abiertas",
  "filters": [
    { "key": "entity", "value": "DANE" },
    { "key": "status", "value": "Abierto" }
  ]
}
```

| Campo | Tipo | Reglas |
|---|---|---|
| `name` | string | Requerido. Máximo 120 caracteres. No puede estar vacío ni contener solo espacios. |
| `filters` | array | Requerido. Debe contener al menos 1 filtro. |
| `filters[].key` | string | Requerido. Debe existir como `search_filter_key.code` activo. |
| `filters[].value` | string | Requerido. No puede estar vacío ni contener solo espacios. |

### Response 201

```json
{
  "id": 1,
  "name": "Convocatorias DANE abiertas",
  "filters": [
    { "key": "entity", "value": "DANE" },
    { "key": "status", "value": "Abierto" }
  ],
  "created_at": "2026-07-09T18:30:00Z"
}
```

| Campo | Origen |
|---|---|
| `id` | `saved_search.id` |
| `name` | `saved_search.name` |
| `filters[].key` | `search_filter_key.code` |
| `filters[].value` | `saved_search_filter_value.filter_value` |
| `created_at` | `saved_search.created_at` |

### Errores

| Status | Caso |
|---|---|
| 401 | Token ausente, inválido o expirado. |
| 409 | Ya existe una búsqueda con el mismo `name` para el usuario autenticado. |
| 422 | Payload inválido: `name` vacío, `name` mayor a 120 caracteres, `filters` vacío, filtro sin `key`, filtro sin `value`, `value` vacío o `key` inexistente/inactivo. |

### Regla HU-014

- El `user_id` se extrae exclusivamente del JWT (`sub`).
- El request body no acepta `user_id`.
- Un usuario solo crea búsquedas asociadas a su propio `user_id` autenticado.
- Si el cliente envía un `user_id`, nunca debe usarse para ownership.

## GET /api/v1/saved-searches

Lista búsquedas guardadas del usuario autenticado.

### Headers requeridos

```http
Authorization: Bearer <token>
```

### Request body

No aplica.

### Response 200

```json
{
  "items": [
    {
      "id": 1,
      "name": "Convocatorias DANE abiertas",
      "filters": [
        { "key": "entity", "value": "DANE" },
        { "key": "status", "value": "Abierto" }
      ],
      "created_at": "2026-07-09T18:30:00Z"
    }
  ],
  "total": 1
}
```

| Campo | Origen |
|---|---|
| `items[].id` | `saved_search.id` |
| `items[].name` | `saved_search.name` |
| `items[].filters[].key` | `search_filter_key.code` |
| `items[].filters[].value` | `saved_search_filter_value.filter_value` |
| `items[].created_at` | `saved_search.created_at` |
| `total` | Cantidad de búsquedas guardadas retornadas para el usuario autenticado |

### Errores

| Status | Caso |
|---|---|
| 401 | Token ausente, inválido o expirado. |

### Regla HU-014

- El backend filtra por `saved_search.user_id = JWT.sub`.
- La respuesta retorna solo búsquedas guardadas del usuario autenticado.
- No existe parámetro `user_id` en query string ni body.
- Un usuario no puede listar búsquedas guardadas de otro usuario.

## DELETE /api/v1/saved-searches/{id}

Elimina una búsqueda guardada del usuario autenticado.

### Headers requeridos

```http
Authorization: Bearer <token>
```

### Path params

| Parámetro | Tipo | Reglas |
|---|---|---|
| `id` | int | ID de la búsqueda guardada a eliminar. |

### Response 204

Sin body.

### Errores

| Status | Caso |
|---|---|
| 401 | Token ausente, inválido o expirado. |
| 404 | La búsqueda guardada no existe o no pertenece al usuario autenticado. |

### Regla HU-014

- La eliminación debe ejecutar la condición equivalente a `where id = :saved_search_id and user_id = :authenticated_user_id`.
- Si la búsqueda existe pero pertenece a otro usuario, la respuesta debe ser `404` para no revelar existencia de datos ajenos.
- El `user_id` nunca se recibe desde el cliente.

## Reglas de persistencia derivadas del schema DB

- `saved_search` almacena `name` + `user_id` con constraint de unicidad por usuario.
- `saved_search_filter_value` almacena pares key/value referenciando `search_filter_key`.
- Si el `key` del filtro no existe en `search_filter_key` o está inactivo, el backend debe retornar `422`.
- Múltiples values por key son válidos y están soportados por el schema.
- No se debe persistir `filter_value` vacío ni compuesto solo por espacios.
- Al eliminar una búsqueda guardada, sus filtros se eliminan por cascade desde `saved_search_filter_value`.

## Resumen de HU cubiertas

| HU | Cobertura del contrato |
|---|---|
| HU-007 | Crear y listar búsquedas guardadas con nombre y filtros persistentes. |
| HU-014 | Aislamiento por JWT: crear, listar y eliminar siempre filtrando por `user_id` extraído del token. |
