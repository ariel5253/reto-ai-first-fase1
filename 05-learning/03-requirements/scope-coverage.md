# Scope coverage

> Revisión end-to-end de cobertura entre alcance del Track DEV y Historias de Usuario.

## Source scope

El Track DEV requiere construir el Portal de Convocatorias Públicas con estos requisitos explícitos:

- Auth JWT.
- Backend REST.
- Frontend web funcional.
- Base de datos SQLite o PostgreSQL.
- Integración backend con datos.gov.co / SECOP.
- App runnable localmente.
- README.
- SOUL.md.
- Demo de 5–7 minutos.

Para nuestra implementación se adoptan como decisiones internas:

- Frontend React.
- PostgreSQL.
- Tests API con pytest + httpx.

## Coverage matrix

| Requirement | Covered by | Status |
|---|---|---|
| Registro de usuarios | HU-001 | Covered |
| Login/JWT | HU-002 | Covered |
| Rutas privadas / autorización | HU-002, HU-014 | Covered |
| Búsqueda de convocatorias | HU-003 | Covered |
| Integración backend con SECOP / SECOP integration | HU-003, HU-008 | Covered |
| Normalización de datos SECOP | HU-003, HU-004, HU-013 | Covered |
| Detalle de convocatoria | HU-004 | Covered |
| Guardar convocatoria/bookmark | HU-005 | Covered |
| Listar bookmarks | HU-006 | Covered |
| Búsquedas guardadas | HU-007 | Covered |
| Manejo de fallos externos | HU-008 | Covered |
| PostgreSQL schema/migrations/3NF | HU-009 | Covered |
| Contrato REST y health endpoint | HU-010 | Covered |
| Suite pytest + httpx | HU-011 | Covered |
| README / ejecución local | HU-012 | Covered |
| SOUL.md / evidencia / demo | HU-013 | Covered |
| Aislamiento de datos por usuario | HU-014 | Covered |

## Verdict

Después de agregar HU-009 a HU-014, las HU cubren el alcance funcional, técnico y de entrega del Track DEV para pasar a diseño de API/modelo de datos.

## Remaining decisions before implementation

Estas no bloquean cobertura, pero deben cerrarse antes de codificar:

- Campos mínimos de búsqueda SECOP.
- Campos mínimos persistidos para bookmarks.
- Decidir si convocatorias externas se cachean o solo se consultan bajo demanda.
- Alcance exacto de búsquedas guardadas para la primera demo.
