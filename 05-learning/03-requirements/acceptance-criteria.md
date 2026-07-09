# Acceptance criteria

> Criterios de aceptación para validar que una HU está lista para implementación y cierre.

## Definition of Ready

Una HU está lista para implementación cuando:

- [ ] Tiene actor, objetivo y resultado esperado.
- [ ] Define capas afectadas.
- [ ] Tiene criterios de aceptación verificables.
- [ ] Tiene impacto revisado con el change guardian.
- [ ] No contradice stack, arquitectura ni responsabilidades por capa.

## Definition of Done

Una HU está terminada cuando:

- [ ] Código o documentación requerida fue actualizado.
- [ ] Tests relevantes fueron ejecutados o se documentó por qué no aplican.
- [ ] `05-learning/00-traceability/change-log.md` fue actualizado.
- [ ] `SOUL.md` fue actualizado si hay evidencia relevante del reto.
- [ ] No quedan impactos pendientes en database, backend, frontend, integrations o tests.

## Cross-cutting acceptance criteria

Aplican a todas las HU del Track DEV:

- [ ] Frontend consume únicamente la API del backend.
- [ ] Backend encapsula datos.gov.co / SECOP mediante cliente HTTP.
- [ ] Database mantiene integridad con constraints cuando aplique.
- [ ] Seeds y datos de prueba persistentes viven en `06-code/db/`, no en backend ni frontend.
- [ ] Reglas críticas de negocio no viven en frontend.
- [ ] Tests relevantes usan pytest + httpx para API.
- [ ] Errores externos se manejan sin filtrar detalles internos.
- [ ] Cada cambio relevante deja entrada en `05-learning/00-traceability/change-log.md`.

## User-story acceptance map

| HU | Acceptance focus |
|---|---|
| HU-001 | Registro, validación, password hasheado, email único. |
| HU-002 | Login, JWT, rutas protegidas, errores 401. |
| HU-003 | Búsqueda, integración SECOP desde backend, normalización. |
| HU-004 | Detalle de convocatoria, contrato estable, errores controlados. |
| HU-005 | Bookmark asociado a usuario, no duplicados, constraints. |
| HU-006 | Listado de bookmarks, aislamiento por usuario. |
| HU-007 | Búsquedas guardadas, validación de criterios, persistencia. |
| HU-008 | Fallos SECOP: timeout, HTTP error, vacío, formato inesperado. |
| HU-009 | PostgreSQL schema, migraciones, 3NF, constraints y seeds/test-data. |
| HU-010 | Contrato REST formal, status codes y health endpoint. |
| HU-011 | Suite pytest + httpx, fixtures y mocks de integración. |
| HU-012 | README con ejecución local reproducible. |
| HU-013 | SOUL.md, checkpoints, evidencia y demo. |
| HU-014 | Aislamiento de datos por usuario autenticado. |
