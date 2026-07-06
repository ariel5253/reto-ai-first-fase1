# Code workspace guide

> Guía de organización para la implementación. Esta carpeta documenta cómo debe separarse el código por responsabilidad; la creación de código real debe respetar esta estructura o mapearse claramente contra ella.

## Proposed implementation areas

- `05-learning/04-code/db/` — guías de migrations, schemas, seeds, test-data e integridad.
- `05-learning/04-code/backend/` — guías de API, auth, use cases, repositories y tests backend.
- `05-learning/04-code/frontend/` — guías de UI, pages, components, services, hooks y state.
- `05-learning/04-code/integrations/` — guías de clientes externos, especialmente datos.gov.co / SECOP.
- `05-learning/04-code/testing/` — guías de estrategia de pruebas unitarias, integración y API.

## Architect rule

El código se organiza por capa y responsabilidad:

```text
db -> persistence and integrity
backend -> API, auth, use cases, external integration orchestration
frontend -> presentation and API consumption
integrations -> external API contracts, clients and normalization rules
testing -> verification assets and strategy
```

Toda implementación debe revisar `05-learning/00-traceability/change-guardian.md` antes de cerrarse.
