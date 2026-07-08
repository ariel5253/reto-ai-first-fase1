# Project understanding

> Documento base para capturar el entendimiento del Portal de Convocatorias Públicas antes de derivar Historias de Usuario.

## Product goal

Construir un portal que permita a usuarios autenticados consultar convocatorias públicas, guardar oportunidades relevantes y administrar búsquedas guardadas usando una integración backend con datos.gov.co / SECOP.

## Primary users

- Usuario visitante: puede conocer el portal y registrarse.
- Usuario autenticado: puede buscar convocatorias, guardar oportunidades y gestionar búsquedas.
- Sistema backend: integra datos externos, normaliza respuestas y protege reglas de negocio.

## Core assumptions

### Requisitos explícitos del reto

- La integración con datos.gov.co / SECOP se hace desde backend.
- La autenticación usa JWT.
- El producto requiere backend REST, frontend web funcional y base de datos SQLite o PostgreSQL.
- Las reglas críticas de negocio viven en backend y/o database, no en frontend.

### Decisiones internas de implementación

- PostgreSQL es la base de datos elegida para nuestra implementación.
- React es el frontend elegido para nuestra implementación.
- FastAPI / Python es el backend elegido para nuestra implementación.

## Open questions

- Campos mínimos de búsqueda de convocatorias.
- Campos mínimos a persistir para bookmarks.
- Si las convocatorias externas se cachean o solo se consultan bajo demanda.
- Alcance exacto de búsquedas guardadas para la primera demo.
