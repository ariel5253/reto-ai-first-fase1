# Auth API contract

## POST /api/v1/auth/register

Request body:

```json
{
  "email": "string (max 320 chars, se normaliza a lowercase en backend)",
  "password": "string (min 8 chars, nunca se persiste en texto plano)",
  "full_name": "string opcional (max 160 chars)"
}
```

Response 201:

```json
{
  "id": "integer",
  "email": "string",
  "full_name": "string | null",
  "created_at": "string (ISO 8601)"
}
```

Errores:

- 409: email ya registrado
- 422: payload inválido (campo requerido ausente o formato incorrecto)

Reglas de backend derivadas del schema:

- Normalizar email a lowercase antes de persistir (constraint DB)
- Hashear password con bcrypt antes de persistir (campo password_hash)
- Nunca retornar password_hash en ninguna respuesta

## POST /api/v1/auth/login

Request body:

```json
{
  "email": "string",
  "password": "string"
}
```

Response 200:

```json
{
  "access_token": "string (JWT)",
  "token_type": "bearer"
}
```

JWT payload:

```json
{
  "sub": "string (user id como string)",
  "email": "string",
  "exp": "timestamp (24 horas desde emisión)"
}
```

Errores:

- 401: credenciales inválidas (no revelar cuál campo falló)
- 422: payload inválido

## Rutas privadas futuras

Todas las rutas que requieran usuario autenticado deben recibir:

```http
Authorization: Bearer <access_token>
```

El backend extrae el user_id desde el JWT (campo sub), nunca
desde un parámetro manipulable del request.
