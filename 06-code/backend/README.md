# Backend FastAPI — Portal de Convocatorias Públicas

Esqueleto inicial del backend para el reto AI-First Fase 1.

## Alcance actual

Este bloque solo implementa la base técnica mínima:

- Aplicación FastAPI.
- Configuración por variables de entorno.
- Conexión PostgreSQL mediante `psycopg`.
- Endpoint `GET /api/health`.
- Pruebas API con `pytest` + `httpx`.

No implementa todavía:

- Registro/login.
- JWT.
- SECOP/datos.gov.co.
- Bookmarks.
- Búsquedas guardadas.
- Frontend.

## Estructura

```text
app/
  main.py                              # Factory FastAPI e inclusión de routers
  core/config.py                       # Configuración desde entorno
  domain/                              # Dominio puro, vacío por ahora
  application/ports/                   # Puertos de entrada/salida, vacío por ahora
  application/use_cases/               # Casos de uso, vacío por ahora
  infrastructure/database/health.py    # Verificación de conexión PostgreSQL
  infrastructure/external/             # Futuro cliente SECOP
  infrastructure/security/             # Futuro JWT/security
  interfaces/api/v1/                   # Rutas HTTP versionadas
tests/
  test_health.py           # Tests del health endpoint
```

## Variables de entorno

Crear `.env` local a partir de `.env.example` o exportar:

```bash
export DATABASE_URL='postgresql://admin:<password>@localhost:5432/portal_convocatorias'
```

La contraseña local definida para el contenedor PostgreSQL del proyecto está en `06-code/db/.env`.

## Instalación

```bash
cd 06-code/backend
uv sync --dev
```

## Tests

```bash
cd 06-code/backend
uv run pytest -q
```

Resultado esperado actual:

```text
.. [100%]
```

## Ejecutar API local

Con la base de datos PostgreSQL levantada:

```bash
cd 06-code/backend
set -a
. ../db/.env
set +a
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}"
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Verificar:

```bash
curl http://127.0.0.1:8000/api/health
```

Respuesta esperada:

```json
{"status":"ok","database":"ok"}
```

## Reglas de arquitectura

- El backend no contiene datos sintéticos hardcodeados.
- Los datos sintéticos DEV viven exclusivamente en `06-code/db/init/`.
- Los routers FastAPI no deben mezclar lógica compleja; deben delegar a casos de uso, puertos e infraestructura cuando se implementen HU.
- El frontend no debe conectarse a PostgreSQL ni a SECOP directamente.
