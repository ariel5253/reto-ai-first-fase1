# Backend HU Development Plan

Fecha: 2026-07-08

## Objetivo

Arrancar el desarrollo de historias de usuario del backend después de tener el esqueleto FastAPI mínimo verificado con PostgreSQL.

## Contexto actual

Ya existe:

- PostgreSQL local en Docker Compose.
- Modelo lógico 3NF aplicado.
- Datos sintéticos DEV únicamente en `06-code/db/init/`.
- Backend FastAPI base en `06-code/backend/`.
- Endpoint `GET /api/health` con verificación DB.
- Tests API iniciales con `pytest` + `httpx`.

Reglas obligatorias:

- No hardcodear datos sintéticos en backend, frontend, rutas, servicios, repositorios ni tests de aplicación.
- El backend debe leer datos desde PostgreSQL.
- Mantener separación por capas: API -> services -> repositories -> DB.
- No hacer commit/push sin autorización explícita de Ariel.

## Autorización de alcance actual

Ariel autoriza únicamente:

- Bloque 0 — Contrato y base técnica.
- Bloque 1 — Usuarios y autenticación.

Los bloques 2 en adelante no se deben implementar todavía. Antes de trabajar oportunidades, SECOP, bookmarks o búsquedas guardadas, se debe revisar como fuente de verdad:

```text
05-learning/04-code/integrations/SECOP II - Contratos Electrónicos.postman_collection.json
```

Esa colección ya contiene una forma funcional de consumir servicios SECOP. Está permitido ajustarla, pero el backend debe partir de esa fuente y no inventar la integración desde cero.

## Orden recomendado de HU backend

### Bloque 0 — Contrato y base técnica

HU relacionadas: HU-010, HU-011, HU-012, HU-013.

Objetivo: dejar contrato, pruebas y documentación antes de lógica funcional.

Tareas:

1. Definir convenciones de respuesta y error API.
2. Agregar estructura de schemas base.
3. Agregar helper común para conexión DB/repositories.
4. Mantener `GET /api/health` como verificación base.
5. Documentar comandos locales.

Validación:

```bash
cd 06-code/backend
uv run pytest -q
curl http://127.0.0.1:8000/api/health
```

### Bloque 1 — Usuarios y autenticación

HU relacionadas: HU-001, HU-002, HU-014.

Objetivo: registrar usuarios, autenticar y emitir JWT.

Tareas TDD:

1. Test RED para registro exitoso.
2. Implementar schema `UserCreate` y `UserRead`.
3. Crear repositorio de `app_user`.
4. Hash de contraseña, nunca plaintext.
5. Endpoint `POST /api/v1/auth/register`.
6. Test RED para email duplicado.
7. Endpoint `POST /api/v1/auth/login`.
8. Emisión JWT.
9. Dependencia `get_current_user`.
10. Tests de aislamiento por usuario.

No hacer todavía:

- Roles avanzados.
- Recuperación de contraseña.
- Persistencia de tokens.

### Bloque 2 — Consulta de oportunidades locales

HU relacionadas: HU-003, HU-004, HU-011.

Objetivo: exponer oportunidades ya existentes en PostgreSQL, usando los datos sintéticos DB-only como validación inicial.

Tareas TDD:

1. Test RED para listar oportunidades desde DB.
2. Crear schema `OpportunityRead`.
3. Crear repositorio `public_opportunity`.
4. Endpoint `GET /api/v1/opportunities`.
5. Filtros mínimos: texto, estado, entidad.
6. Endpoint `GET /api/v1/opportunities/{id}`.
7. Tests sin hardcodear dataset sintético en código; las expectativas deben consultar/crear datos vía DB fixture o usar conteos controlados.

### Bloque 3 — Integración SECOP/datos.gov.co

HU relacionadas: HU-003, HU-004, HU-008.

Objetivo: consultar SECOP desde backend, normalizar respuesta y manejar fallos.

Tareas TDD:

1. Definir DTO interno de oportunidad externa.
2. Crear cliente SECOP con timeout configurable.
3. Test con mock HTTP controlado del cliente, no del endpoint completo.
4. Endpoint de búsqueda que delega a servicio.
5. Manejo de errores SECOP con respuesta clara.
6. Decidir persistencia/cache: búsqueda no persiste todo; detalle/bookmark puede persistir.

### Bloque 4 — Bookmarks

HU relacionadas: HU-005, HU-006, HU-014.

Objetivo: usuario autenticado puede guardar y listar favoritos.

Tareas TDD:

1. Test RED para crear bookmark autenticado.
2. Repositorio de `bookmark`.
3. Servicio que asegura existencia de oportunidad antes de guardar.
4. Endpoint `POST /api/v1/bookmarks`.
5. Endpoint `GET /api/v1/bookmarks`.
6. Test de duplicado idempotente o error definido.
7. Test de aislamiento: usuario A no ve bookmarks de usuario B.

### Bloque 5 — Búsquedas guardadas

HU relacionadas: HU-007, HU-014.

Objetivo: guardar criterios de búsqueda por usuario.

Tareas TDD:

1. Test RED para crear búsqueda guardada.
2. Repositorio `saved_search` y `saved_search_filter_value`.
3. Endpoint `POST /api/v1/saved-searches`.
4. Endpoint `GET /api/v1/saved-searches`.
5. Soportar múltiples valores por filtro.
6. Test de nombre duplicado por usuario.
7. Test de aislamiento por usuario.

## Definition of Done por bloque

Cada bloque debe cerrar con:

- Tests RED/GREEN evidenciados.
- `uv run pytest -q` pasando.
- Sin datos sintéticos hardcodeados en backend.
- README o guía actualizada si cambia forma de ejecutar.
- `SOUL.md` actualizado.
- `05-learning/00-traceability/change-log.md` actualizado.
- Commit/push solo si Ariel lo autoriza explícitamente.

## Commit sugerido para el bloque actual

Cuando Ariel autorice:

```text
feat(backend): add FastAPI health and database check
```

## Siguiente paso inmediato

Antes de implementar HU-001/HU-002, cerrar el bloque actual con revisión y, si Ariel autoriza, commit/push. Luego iniciar Bloque 1 con TDD.
