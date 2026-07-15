# Portal de Convocatorias Públicas — ejecución local

Aplicación del Track DEV del Reto AI-First Fase 1.

Stack ejecutable:

- Backend: FastAPI + Python + PostgreSQL + JWT.
- Frontend: React + TypeScript + Vite + Tailwind CSS v4 + React Router v6 + Zustand.
- Integración externa: datos reales de SECOP II desde `https://www.datos.gov.co/resource/p6dx-8zbt.json`.

## 1. Prerrequisitos

Instalar en la máquina local:

- Docker y Docker Compose.
- Python >= 3.11.
- `uv` para gestión de entorno Python.
- Node.js >= 18 y npm.


## Arranque rápido con Docker Compose

Desde `06-code/` se puede levantar el sistema completo con un solo comando:

```bash
cd 06-code
docker compose up -d
```

El orquestador raíz levanta los servicios en este orden:

1. `db`: PostgreSQL 16 con health check. En la primera ejecución aplica automáticamente `db/init/01-schema.sql`, `db/init/02-seed-catalogs.sql` y `db/init/03-seed-dev-synthetic.sql` mediante `docker-entrypoint-initdb.d/`. En ejecuciones posteriores no repite esos scripts si el volumen ya existe.
2. `backend`: FastAPI en `http://localhost:8000`, esperando a que PostgreSQL esté healthy.
3. `frontend`: build React/TypeScript servido por nginx en `http://localhost:3000`, con proxy `/api/` hacia el backend.

Verificación rápida:

```bash
curl http://localhost:8000/api/health
curl -I http://localhost:3000
```

Respuesta esperada del backend:

```json
{"status":"ok","database":"ok"}
```

Para detener todo el sistema:

```bash
cd 06-code
docker compose down
```

Notas:

- Variables de DB por defecto: `POSTGRES_DB=portal_convocatorias`, `POSTGRES_USER=admin`, `POSTGRES_PASSWORD=abcd1234`.
- El backend puede usar `06-code/backend/.env`; si no se definen variables externas, el compose raíz inyecta valores locales seguros para contenedor.
- Si un puerto local (`5432`, `8000` o `3000`) ya está ocupado, Docker Compose reportará el conflicto en logs sin terminar el proceso externo que usa ese puerto. Libera el puerto o cambia el mapeo antes de reintentar el servicio afectado.

## 2. Base de datos PostgreSQL

Existe configuración Docker Compose en `06-code/db/docker-compose.yml`.

Crear `06-code/db/.env` a partir de `06-code/db/.env.example` si no existe. Variables esperadas por el compose:

```env
POSTGRES_DB=portal_convocatorias
POSTGRES_USER=admin
POSTGRES_PASSWORD=<password-local>
```

Levantar PostgreSQL. En la primera ejecución, la imagen oficial de PostgreSQL aplica automáticamente `init/01-schema.sql`, `init/02-seed-catalogs.sql` e `init/03-seed-dev-synthetic.sql` desde `docker-entrypoint-initdb.d/`. Si el volumen ya existe, no repite esos scripts.

```bash
cd 06-code/db
docker compose up -d
```

Verificación rápida:

```bash
docker compose exec db psql -U admin -d portal_convocatorias -c "select count(*) from search_filter_key;"
```

## 3. Backend FastAPI

Crear `06-code/backend/.env` a partir de `06-code/backend/.env.example`.

Variables necesarias:

```env
DATABASE_URL=postgresql://admin:<password-local>@localhost:5432/portal_convocatorias
JWT_SECRET=change-me-in-local-env-minimum-32-chars
JWT_ALGORITHM=HS256
SECOP_BASE_URL=https://www.datos.gov.co/resource/p6dx-8zbt.json
SECOP_TIMEOUT_SECONDS=10
```

Instalar dependencias y levantar API:

```bash
cd 06-code/backend
uv sync --dev
uv run python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://localhost:8000/api/health
```

Respuesta esperada:

```json
{"status":"ok","database":"ok"}
```

## 4. Frontend React

El frontend llama a `/api/v1/...`; Vite redirige esas llamadas al backend por proxy (`localhost:8000`). No se debe hardcodear la URL del backend en los servicios frontend.

Instalar dependencias y levantar servidor de desarrollo:

```bash
cd 06-code/frontend
npm install
npm run dev
```

Abrir:

```text
http://localhost:3000
```

Credenciales para demo:

- Usar cualquier email válido.
- Usar cualquier password de 8 o más caracteres.
- El registro crea el usuario; luego se inicia sesión explícitamente.

## 5. Tests, build y notas funcionales

Correr tests del backend:

```bash
cd 06-code/backend
uv run pytest
```

Build del frontend:

```bash
cd 06-code/frontend
npm run build
```

Notas de dominio e integración:

- SECOP se consume con datos reales desde `datos.gov.co/resource/p6dx-8zbt.json`.
- `closing_at = null` es esperado: SECOP II no provee una fecha de cierre confiable en la fuente usada. La UI muestra `No disponible en SECOP II` y no intenta inferirla.
- Los montos públicos se manejan como `estimated_amount_cents` (`pesos * 100`) y se muestran como millones de COP en el frontend.
- El mockup ubicado en `05-learning/04-code/frontend/ui-mockup/` es solo referencia visual. El código ejecutable real está en `06-code/frontend/`.
