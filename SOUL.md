# SOUL.md

## Proyecto

Portal de Convocatorias Públicas — Track DEV. Participante: Ariel.
Repo: https://github.com/ariel5253/reto-ai-first-fase1

Bitácora de ejecución del Reto AI-First Fase 1.

Este archivo registra el proceso real seguido durante el reto: decisiones, pasos ejecutados, evidencia, bloqueos y próximos pasos. No reemplaza los documentos de planificación en `05-learning/`; resume el avance verificable y deja trazabilidad del trabajo realizado.

## Stack

| Qué exige el reto | Qué se decidió internamente y por qué |
|---|---|
| Auth con JWT. | JWT se mantiene como mecanismo de autenticación del backend porque es parte del contrato funcional esperado y permite proteger rutas privadas sin estado de sesión en servidor. |
| Backend REST. | FastAPI / Python porque permite construir API REST con validación de datos, OpenAPI automático, pruebas con `httpx` y una estructura clara por capas. |
| Frontend web funcional. | React porque facilita componentes, manejo de estado y separación entre cliente API, páginas y UI. |
| Base de datos SQLite o PostgreSQL. | PostgreSQL porque ofrece constraints, integridad referencial, tipos robustos, 3NF verificable y una defensa más sólida para usuarios, bookmarks y búsquedas guardadas. |
| Integración en vivo con datos.gov.co / SECOP. | Cliente HTTP desde backend hacia datos.gov.co / SECOP para encapsular la integración externa y evitar que el frontend dependa directamente de SECOP. |
| App ejecutable localmente. | Docker Compose para PostgreSQL local y `uv` para backend Python porque hacen reproducible el entorno de desarrollo. |
| README, SOUL.md y demo. | Documentación incremental en `05-learning/`, trazabilidad en `change-log.md` y bitácora en este `SOUL.md`, con evidencia real por checkpoint. |

## Uso de Hermes y LLMs

Hermes fue el ejecutor principal del proceso, no un asistente ocasional. Cada bloque se trabajó desde la terminal del repositorio, leyendo archivos fuente, modificando documentos o código, ejecutando comandos de verificación y dejando evidencia en `SOUL.md` y `05-learning/00-traceability/change-log.md`.

| Fase | Cómo ejecutó Hermes | LLM/modelo usado |
|---|---|---|
| Planificación inicial | Organizó la estructura `05-learning/`, separó planificación, arquitectura, requisitos/HU, guías por capa y trazabilidad. | Modelo activo de Hermes en las sesiones del reto; el entorno del usuario está configurado habitualmente con DeepSeek v4 Pro. |
| Revisión de requisitos y arquitectura | Cruzó documentos del reto, HU, criterios de aceptación, modelo de datos y readiness review antes de iniciar backend. | Modelo activo de Hermes para análisis documental y revisión de coherencia. |
| Modelo de datos | Construyó el modelo lógico 3NF, ajustó nombres singulares, agregó trazabilidad SECOP y produjo scripts SQL verificables. | Modelo activo de Hermes para modelado y generación controlada de SQL/documentación. |
| Base de datos local | Creó `docker-compose.yml`, `.env.example`, scripts `init/`, aplicó schema/seeds con PostgreSQL y verificó conteos. | Modelo activo de Hermes para ejecución CLI, diagnóstico y documentación de evidencia. |
| Esqueleto backend | Creó app FastAPI mínima, router versionado, configuración por entorno, health DB y tests `pytest + httpx`. | Modelo activo de Hermes para implementación backend y TDD. |
| Refactor de este SOUL.md | Reorganizó el entregable oficial preservando la bitácora existente y agregando secciones faltantes. | gpt-5.5 en la sesión actual de Hermes. |

El enfoque de implementación quedó definido HU-por-HU con TDD. Para cada bloque funcional, el flujo esperado es primero RED y luego GREEN: escribir o ejecutar una prueba que falle, implementar lo mínimo necesario y registrar evidencia cuando pase. El primer ejemplo quedó documentado en el checkpoint del esqueleto backend: el test falló inicialmente por `ModuleNotFoundError: No module named 'app'` y luego pasó con `uv run pytest -q`.

## Decisiones técnicas

| Decisión | Motivo técnico | Fecha |
|---|---|---|
| Usar PostgreSQL sobre SQLite. | El reto permite ambas opciones; PostgreSQL da mejor integridad referencial, constraints, tipos, 3NF verificable y reproducibilidad con contenedor local. | 2026-07-06 |
| Mantener tablas y entidades en singular. | Reduce ambigüedad entre entidad conceptual y tabla, estandariza el modelo y evita pluralizaciones inconsistentes; `app_user` evita colisión con palabra reservada/problemática `user`. | 2026-07-06 |
| Guardar datos sintéticos DEV solo en la capa DB. | Evita contaminar backend, frontend, servicios, repositorios, rutas y tests con datos demo hardcodeados; obliga a validar contra PostgreSQL. | 2026-07-08 |
| Usar arquitectura hexagonal/por capas para el backend. | Separar API, servicios/casos de uso, repositorios, DB y futuros clientes externos permite probar por HU y cambiar infraestructura sin mezclar lógica de negocio en handlers FastAPI. | 2026-07-08 |
| No hacer commit ni push sin autorización explícita de Ariel. | Evita publicar cambios incompletos, respeta control del participante y obliga a revisar diff/status antes de versionar. | 2026-07-06 |
| Mantener `05-learning/04-code/` como guía y `06-code/` como código ejecutable. | Separa material de aprendizaje/referencia del producto real y evita confundir documentación con artefactos ejecutables. | 2026-07-08 |
| No iniciar Bloque 2+ sin revisar la colección Postman SECOP. | La colección local contiene una forma funcional de consumo SECOP; usarla reduce riesgo de inventar endpoints o parámetros incorrectos. | 2026-07-08 |

## Blockers y resolución

| Blocker | Resolución |
|---|---|
| Docker Desktop desde WSL no permitió montar `./init` directamente como bind mount. | Se aplicaron scripts SQL con `docker compose exec -T postgres psql ... < init/*.sql` y se dejó evidencia del contenedor, tablas y seeds. |
| Divergencia de rama local frente a `origin/main`. | Se documentó el riesgo en `SOUL.md`, se evitó push directo y se dejó como regla revisar diff/status antes de publicar nuevos cambios. |
| Permisos GitHub `403` al intentar publicar en el repo upstream `diegotrujillo-jikko/reto-ai-first-fase1`. | Se verificó permiso `ADMIN` sobre `ariel5253/reto-ai-first-fase1`, se configuró `origin` al repo propio y `upstream` al repo base de solo lectura. |
| Archivos `*:Zone.Identifier*` generados por Windows/WSL. | Se eliminaron 80 archivos de metadata y se agregó la regla `*:Zone.Identifier*` a `.gitignore`. |
| `.venv` del backend quedó apuntando a la ruta anterior tras renombrar `06-codigo` a `06-code`. | Detectado en revalidación: `pytest` apuntaba a `/06-codigo/backend/.venv/bin/python`. Queda pendiente reconstruir la `.venv` antes de continuar con Bloque 1. |
| Docker no estaba disponible en la WSL actual durante la revalidación posterior. | Detectado con `docker compose ps`; queda pendiente activar integración Docker Desktop con WSL antes de repetir la verificación DB local. |

## Aprendizajes

- Funcionó trabajar por bloques pequeños y verificables: primero documentación/arquitectura, luego modelo de datos, después DB local y finalmente backend mínimo.
- Funcionó separar requisitos explícitos del reto y decisiones internas. Eso evitó presentar FastAPI, React, PostgreSQL, Docker o pytest/httpx como mandatos del reto.
- Funcionó usar `SOUL.md` como bitácora de hechos y `change-log.md` como trazabilidad técnica; ambos documentos se complementan.
- Funcionó mantener los datos sintéticos solo en SQL de DB. Esto protege la aplicación de datos demo escondidos en código.
- El enfoque HU-a-HU reduce saltos de alcance: permite cerrar Bloque 0 antes de auth y evita entrar a SECOP/bookmarks antes de revisar la fuente Postman.
- Haría diferente la gestión de renombres de carpeta: después de mover `codigo/` a `06-code/`, reconstruiría inmediatamente la `.venv` y correría tests antes de seguir documentando.
- Haría una verificación temprana de Docker/WSL al inicio de cada jornada para detectar antes si la integración de Docker Desktop está activa.

## Bitácora de ejecución

## Reglas de documentación

- Documentar solo hechos ejecutados o verificados; no inventar avances.
- Registrar cada iteración relevante con: avance, pasos realizados, evidencia, bloqueos/riesgos y siguiente paso.
- Mantener trazabilidad hacia archivos, comandos, commits o resultados concretos.
- Las decisiones de stack, arquitectura o alcance viven en `05-learning/01-planning/` y `05-learning/02-architecture/`; aquí se referencia su aplicación.
- La trazabilidad técnica detallada vive en `05-learning/00-traceability/change-log.md`; aquí se resume el impacto operativo.
- Todo commit debe seguir Conventional Commits.
- Todo cambio relevante debe pasar por Hermes y quedar reflejado en el repo.

## Fuentes de verdad usadas

- Planificación: `05-learning/01-planning/`
- Arquitectura: `05-learning/02-architecture/`
- Requisitos/HU: `05-learning/03-requirements/`
- Guía por capas: `05-learning/04-code/`
- Trazabilidad técnica: `05-learning/00-traceability/change-log.md`
- Bitácora de ejecución: `SOUL.md`

## Checkpoint diario — 2026-07-01

- Avance: Se revisaron skills relevantes para el reto AI-First y se generó un plan operativo día a día en `planning/`.
- Pasos realizados:
  - Revisión inicial del enfoque AI-first para el reto.
  - Definición de una ruta de preparación y planificación.
  - Identificación de la necesidad de documentar avance, riesgos y próximos pasos.
- Riesgos/Bloqueos: Aún no quedó confirmado el track de ejecución; tampoco se registró evidencia de pruebas, app corriendo o entregables ejecutados.
- Próximo paso: Confirmar track y comenzar con la preparación verificable del entorno y el primer bloque formal de `SOUL.md`.
- Evidencia: Primer checkpoint creado en `SOUL.md`.

## Checkpoint diario — 2026-07-04

- Avance: Se consolidó la estructura de preparación `05-learning/` con trazabilidad, planificación, arquitectura, requisitos/HU y guías de código por capa.
- Pasos realizados:
  - Se organizó la carpeta de preparación como `05-learning/`.
  - Se priorizó trazabilidad en `05-learning/00-traceability/`.
  - Se documentó planificación en `05-learning/01-planning/`.
  - Se documentaron árboles de arquitectura en `05-learning/02-architecture/`.
  - Se documentaron requisitos, HU y criterios de aceptación en `05-learning/03-requirements/`.
  - Se agregaron guías iniciales por capa en `05-learning/04-code/`.
- Riesgos/Bloqueos: La estructura documental quedó lista, pero faltaba publicarla en el repositorio remoto del usuario.
- Próximo paso: Autenticar GitHub, versionar los cambios y empujar los commits correspondientes.
- Evidencia:
  - `05-learning/README.md`
  - `05-learning/00-traceability/change-log.md`
  - `05-learning/01-planning/governance.md`
  - `05-learning/03-requirements/user-stories.md`

## Checkpoint diario — 2026-07-06

- Avance: Se autenticó GitHub, se configuró el remoto correcto del usuario y se publicaron dos commits separados: estructura y avance.
- Pasos realizados:
  - Se verificó que `gh` estaba instalado y que no había sesión activa de GitHub.
  - Se inició autenticación con `gh auth login` mediante código de dispositivo.
  - Se confirmó autenticación como `ariel5253`.
  - Se configuró identidad global de git:
    - `Jesús González`
    - `ariel5253@misena.edu.co`
  - Se intentó push al remoto original `diegotrujillo-jikko/reto-ai-first-fase1`, pero falló por permisos `403`.
  - Se verificó que el repo propio `ariel5253/reto-ai-first-fase1` tenía permiso `ADMIN`.
  - Se ajustaron remotos:
    - `origin`: `https://github.com/ariel5253/reto-ai-first-fase1.git`
    - `upstream`: `https://github.com/diegotrujillo-jikko/reto-ai-first-fase1`
  - Se creó y empujó el commit de estructura.
  - Se creó y empujó el commit de avance inicial.
  - Se verificó que el repo quedó limpio y sincronizado con `origin/main` en la ruta usada para esos push.
- Commits publicados:
  - `14ace8a docs(learning): add ai-first preparation structure`
  - `43da793 docs(progress): add initial challenge checkpoint`
- Riesgos/Bloqueos:
  - El repo original solo permite lectura para `ariel5253`; los pushes deben hacerse al repo propio en `origin`.
  - El `SOUL.md` inicial era demasiado corto y no reflejaba suficientemente las reglas ni los pasos ejecutados.
  - La ruta local actual `/home/jikkosoft/academy/reto-ai-first-fase1` está divergida respecto a `origin/main` y debe sincronizarse con cuidado antes de nuevos push.
- Próximo paso: Corregir `SOUL.md` en la ruta local actual y revisar el diff antes de versionar.
- Evidencia:
  - `gh auth status` confirmó sesión activa como `ariel5253`.
  - `git status --short --branch` mostró divergencia local: `ahead 2, behind 110`.
  - `git log --oneline` mostró commits locales distintos a los commits publicados previamente.

## Corrección de bitácora — 2026-07-06

- Avance: Se corrigió `SOUL.md` para incluir explícitamente las reglas de documentación y los pasos reales ejecutados.
- Pasos realizados:
  - Se revisó el contenido actual de `SOUL.md` en `/home/jikkosoft/academy/reto-ai-first-fase1`.
  - Se detectó que el documento local seguía con solo el checkpoint mínimo inicial.
  - Se actualizó el documento para reflejar reglas, fuentes de verdad, checkpoints y evidencia.
  - Se dejó pendiente la decisión de commit/push porque la rama local está divergida respecto a `origin/main`.
- Riesgos/Bloqueos:
  - No conviene hacer push directo sin resolver primero la divergencia entre rama local y remoto.
- Próximo paso: Revisar `git diff SOUL.md`; luego decidir si se integra esta corrección en la rama actual o se sincroniza primero con `origin/main`.
- Evidencia:
  - `SOUL.md`
  - `git status --short --branch`

## Checkpoint de publicación — 2026-07-06

- Avance: Se limpió metadata Windows/WSL y se publicó primero la estructura base del reto en el remoto propio.
- Pasos realizados:
  - Se eliminaron 80 archivos `*:Zone.Identifier*` generados como metadatos de Windows/WSL.
  - Se agregó la regla `*:Zone.Identifier*` a `.gitignore` para evitar que vuelvan a entrar al control de versiones.
  - Se verificó permiso `ADMIN` sobre `ariel5253/reto-ai-first-fase1`.
  - Se creó el commit de estructura base del reto: `02752d2 chore(repo): add initial challenge structure`.
  - Se empujó el commit de estructura a `origin/main`.
- Riesgos/Bloqueos:
  - Los archivos internos cifrados se mantienen como parte de la estructura base del reto; no deben editarse sin necesidad.
- Próximo paso: Publicar el segundo commit con los avances documentales (`05-learning/` y `SOUL.md`).
- Evidencia:
  - `git push origin main` completado correctamente para `02752d2`.
  - `git status --short --branch` dejó pendiente únicamente `05-learning/` y `SOUL.md` antes del segundo commit.

## Checkpoint de base de datos — 2026-07-06

- Avance: Se inició la construcción del producto por la capa de datos, creando el modelo lógico PostgreSQL normalizado a 3NF en `06-code/db/`.
- Pasos realizados:
  - Se revisaron requisitos HU-001 a HU-014 y reglas de arquitectura/base de datos.
  - Se creó `06-code/db/modelo-logico-3nf.md` con entidades, atributos, relaciones, constraints, cardinalidades, índices y trazabilidad a HU.
  - Se creó `06-code/db/schema-logico.sql` como DDL PostgreSQL de referencia para validar el modelo lógico.
  - Se creó `06-code/db/README.md` con reglas aplicadas y propósito de la carpeta.
  - Se actualizó `05-learning/00-traceability/change-log.md`.
  - Se validó automáticamente que el modelo incluye tablas requeridas, constraints, índices clave y trazabilidad HU.
- Riesgos/Bloqueos:
  - El modelo aún no es una migración ejecutable de la app; debe convertirse a migraciones cuando creemos la estructura backend/DB.
  - Falta decidir si las oportunidades SECOP se persistirán solo al guardar bookmark/detalle o si habrá cache controlado.
- Próximo paso: Crear la estructura de producto y convertir el DDL lógico en migración inicial reproducible.
- Evidencia:
  - `06-code/db/modelo-logico-3nf.md`
  - `06-code/db/schema-logico.sql`
  - Validación: `VALIDATION_OK`

## Ajuste de convención de datos — 2026-07-06

- Avance: Se actualizó la política y el modelo lógico para que las entidades y tablas del modelo de datos usen nombres en singular.
- Pasos realizados:
  - Se actualizó `05-learning/01-planning/ai-first-challenge-best-practices.md` para prohibir tablas nuevas en plural.
  - Se actualizó `05-learning/01-planning/ai-first-challenge-tech-stack.md` con la regla de tablas singulares y la excepción segura `app_user` por colisión con palabra reservada `user` en PostgreSQL.
  - Se actualizó `06-code/db/modelo-logico-3nf.md` reemplazando nombres plurales por nombres singulares.
  - Se actualizó `06-code/db/schema-logico.sql` para usar tablas singulares: `app_user`, `opportunity_source`, `contracting_entity`, `opportunity_status`, `public_opportunity`, `bookmark`, `saved_search`, `search_filter_key`, `saved_search_filter_value`.
  - Se actualizó `06-code/db/README.md` con la convención de nombres.
  - Se actualizó `05-learning/00-traceability/change-log.md`.
- Riesgos/Bloqueos:
  - Las futuras migraciones, modelos ORM y repositorios deben respetar exactamente estos nombres singulares.
- Próximo paso: Usar `06-code/db/schema-logico.sql` como base de la migración inicial.
- Evidencia:
  - Validación: `SINGULAR_MODEL_VALIDATION_OK`

## Revisión externa del modelo de datos — 2026-07-06

- Avance: Se evaluaron recomendaciones externas sobre el modelo lógico y se incorporaron las coherentes con el reto, PostgreSQL, 3NF y el alcance MVP.
- Recomendaciones aceptadas:
  - Mantener `app_user` en lugar de `user`; ya estaba aplicado y se conserva.
  - Agregar trazabilidad SECOP/datos.gov.co con `opportunity_dataset`, `external_process_id`, `source_synced_at` y `source_last_seen_at`.
  - Cambiar fechas de convocatoria de `date` a `timestamptz`.
  - Permitir múltiples valores por filtro en `saved_search_filter_value`.
  - Documentar que `estimated_amount_cents` usa centavos y que pesos COP enteros se convierten como `pesos * 100`.
- Recomendaciones descartadas o diferidas:
  - Usar tabla `users`: descartado porque la política vigente exige tablas en singular.
  - Persistir payload bruto completo de SECOP: diferido porque no es necesario para el MVP y requeriría una extensión/decisión de auditoría.
  - Duplicar estado/entidad textual original dentro de `public_opportunity`: descartado en el modelo base porque `opportunity_status` y `contracting_entity` normalizan esos datos.
- Riesgos/Bloqueos:
  - La migración inicial debe reflejar estos cambios; si se agrega payload bruto en el futuro, debe documentarse como excepción.
- Próximo paso: Convertir el modelo lógico actualizado en migración PostgreSQL inicial.
- Evidencia:
  - Validación: `EXTERNAL_REVIEW_RECOMMENDATIONS_VALIDATION_OK`

## Contenedor PostgreSQL local — 2026-07-06

- Avance: Se actualizó la regla operativa de Git y se construyó la base de datos PostgreSQL local en `06-code/db/` usando Docker.
- Reglas actualizadas:
  - Hermes no debe realizar commit ni push salvo que Ariel lo indique y autorice explícitamente.
  - La regla quedó documentada en `05-learning/01-planning/governance.md` y `05-learning/01-planning/conventional-commits.md`.
- Pasos realizados:
  - Se creó `06-code/db/docker-compose.yml` con PostgreSQL 16 Alpine.
  - Se creó `06-code/db/.env` local con usuario PostgreSQL `admin`, password solicitado y base `portal_convocatorias`; el archivo está ignorado por Git.
  - Se creó `06-code/db/.env.example`.
  - Se creó `06-code/db/init/01-schema.sql` desde el modelo lógico actualizado.
  - Se creó `06-code/db/init/02-seed-catalogs.sql` con catálogos mínimos SECOP, estados y filtros.
  - Se actualizó `.gitignore` para ignorar `.env` y `**/.env`.
  - Se levantó el contenedor `portal_convocatorias_postgres`.
  - Se aplicaron schema y seeds con `psql` dentro del contenedor.
- Evidencia:
  - Contenedor: `portal_convocatorias_postgres`.
  - Tablas creadas: 10.
  - Seeds verificados: 1 `opportunity_source`, 1 `opportunity_dataset`, 4 `opportunity_status`, 9 `search_filter_key`.
  - Conexión verificada como usuario `admin` a la base `portal_convocatorias`.
- Riesgos/Bloqueos:
  - Docker Desktop desde WSL no permitió montar `./init` directamente como bind mount; se resolvió aplicando scripts con `docker compose exec -T postgres psql ... < init/*.sql`.
  - No se hizo commit ni push por la nueva regla de autorización.
- Próximo paso: cuando Ariel autorice, revisar diff y decidir si se versionan los archivos de Docker/init; luego conectar backend FastAPI a esta base.

## Cierre de jornada — 2026-07-06

- Avance: La jornada se detiene aquí con la base de datos PostgreSQL local construida, levantada y verificada en Docker.
- Resumen:
  - Se dejó definida la regla operativa: no commit ni push sin autorización explícita de Ariel.
  - Se construyó el contenedor PostgreSQL en `06-code/db/`.
  - Se aplicó el modelo lógico 3NF actualizado como schema real dentro de la base `portal_convocatorias`.
  - Se sembraron catálogos mínimos para SECOP, estados y filtros de búsqueda.
  - Se verificó conexión con usuario `admin` y que existen 10 tablas en el schema público.
- Por qué se para aquí:
  - El objetivo de la jornada era dejar la base de datos del producto construida y verificable.
  - Antes de avanzar al backend, conviene guardar este checkpoint estable en Git.
  - El siguiente bloque ya cambia de capa: conexión FastAPI/PostgreSQL y repositorios.
- Próximo paso de la siguiente jornada: conectar backend FastAPI a PostgreSQL usando este contenedor y validar un primer health/db check.
- Evidencia:
  - Docker health: `healthy`.
  - Schema check: `10` tablas.
  - Seeds: `1` source, `1` dataset, `4` statuses, `9` search filter keys.

## Corrección de documentación del stack — 2026-07-08

- Avance: Se corrigió `05-learning/01-planning/ai-first-challenge-tech-stack.md` para separar requisitos explícitos del reto y decisiones internas de implementación.
- Corrección aplicada:
  - El documento ya no presenta FastAPI, React, PostgreSQL-only, Docker o pytest/httpx como si fueran exigencias textuales del reto.
  - Se agregó una tabla de requisitos explícitos con fuentes: `README.md` y `CLAUDE.md`.
  - Se agregó una tabla de decisiones internas con motivo técnico.
- Requisitos explícitos del reto documentados:
  - Auth con JWT.
  - Backend REST.
  - Frontend web funcional.
  - Base de datos SQLite o PostgreSQL.
  - Integración en vivo con datos.gov.co / SECOP.
  - App ejecutable localmente.
- Decisiones internas documentadas:
  - FastAPI / Python.
  - PostgreSQL.
  - React.
  - pytest + httpx.
  - Docker Compose para DB local.
  - E2E fuera del alcance inicial.
- Próximo paso: esperar indicaciones de Ariel para trabajar el punto 2.

## Revisión arquitectónica punta a punta — 2026-07-08

- Avance: Se realizó una revisión de arquitectura antes de iniciar backend, cruzando reto, arquitectura por capas, HU y modelo de datos.
- Veredicto:
  - Estado general: `Ready with guardrails`.
  - No hay bloqueos estructurales para avanzar.
  - El siguiente paso debe ser backend base con contrato mínimo, health endpoint y conexión PostgreSQL; no iniciar todavía funcionalidades completas.
- Validación ejecutada:
  - HU revisadas: 14.
  - HU faltantes en priority summary: 0.
  - HU faltantes en acceptance map: 0.
  - HU faltantes en scope coverage: 0.
  - Tablas DB revisadas: 10.
  - Constraints críticas presentes.
  - Blocking readiness issues: 0.
- Correcciones aplicadas:
  - `project-understanding.md`: separa requisitos explícitos del reto y decisiones internas.
  - `scope-coverage.md`: separa alcance explícito y decisiones internas.
  - `modelo-logico-3nf.md`: corrige inconsistencias menores del diagrama/texto lógico.
  - `05-learning/README.md`: actualiza índice del stack y agrega la revisión arquitectónica.
  - Se creó `05-learning/02-architecture/architecture-readiness-review.md`.
- Riesgos controlados antes de backend:
  - Definir contrato REST mínimo.
  - Definir cuándo se persiste/cachea una oportunidad SECOP.
  - Definir DTO mínimo de oportunidad normalizada.
  - Definir variables de entorno para DB, JWT y SECOP.
- Próximo paso recomendado: backend FastAPI mínimo con `GET /api/health` y verificación de conexión DB.

## Datos sintéticos DEV solo en base de datos — 2026-07-08

- Avance: Se agregaron datos sintéticos iniciales únicamente en la capa de base de datos para validar relaciones y consultas antes de iniciar backend.
- Regla explícita:
  - Los datos sintéticos DEV viven solo en scripts SQL de `06-code/db/init/`.
  - Está prohibido hardcodear estos datos en backend, frontend, servicios, repositorios, rutas o tests de aplicación.
  - El backend debe leer estos registros desde PostgreSQL cuando necesite validar flujo local.
- Archivo creado:
  - `06-code/db/init/03-seed-dev-synthetic.sql`.
- Documentación actualizada:
  - `06-code/db/README.md`.
  - `05-learning/01-planning/delivery-checklist.md`.
  - `05-learning/04-code/backend/README.md`.
  - `05-learning/00-traceability/change-log.md`.
- Datos cargados:
  - 2 usuarios sintéticos.
  - 3 entidades contratantes sintéticas.
  - 3 oportunidades públicas sintéticas.
  - 3 bookmarks.
  - 2 búsquedas guardadas.
  - 5 valores de filtros guardados.
- Evidencia:
  - Script aplicado correctamente con `psql` dentro del contenedor PostgreSQL.
  - Query join entre `bookmark`, `app_user` y `public_opportunity` retornó 3 filas esperadas.
- Próximo paso: al construir backend, consumir estos datos desde DB y no recrearlos en código.

## Esqueleto inicial backend FastAPI — 2026-07-08

- Avance: Se creó el esqueleto inicial del backend respetando la arquitectura planteada, sin implementar todavía HU completas.
- Alcance técnico:
  - FastAPI app factory en `06-code/backend/app/main.py`.
  - Router versionado en `06-code/backend/app/api/v1/`.
  - Configuración por entorno en `06-code/backend/app/core/config.py`.
  - Health DB en `06-code/backend/app/db/health.py`.
  - Tests API en `06-code/backend/tests/test_health.py`.
- Endpoint inicial:
  - `GET /api/health`.
- Regla preservada:
  - No se agregaron datos sintéticos en backend.
  - El backend solo verifica conectividad PostgreSQL; los datos DEV siguen viviendo en `06-code/db/init/`.
- TDD:
  - RED: `uv run pytest tests/test_health.py -q` falló inicialmente por `ModuleNotFoundError: No module named 'app'`.
  - GREEN: después de implementar el esqueleto, `uv run pytest -q` pasó con `.. [100%]`.
- Verificación runtime:
  - Contenedor PostgreSQL: `healthy`.
  - `curl http://127.0.0.1:8000/api/health` retornó `{"status":"ok","database":"ok"}`.
- Próximo paso: armar plan de desarrollo de HU antes de implementar auth, SECOP, bookmarks o frontend.

## Plan de desarrollo backend por HU — 2026-07-08

- Avance: Se creó el plan para arrancar el desarrollo de las HU backend después del esqueleto inicial.
- Archivo:
  - `05-learning/01-planning/backend-hu-development-plan.md`.
- Orden definido:
  - Bloque 0: contrato/base técnica.
  - Bloque 1: usuarios y autenticación (`HU-001`, `HU-002`, `HU-014`).
  - Bloque 2: consulta de oportunidades locales (`HU-003`, `HU-004`, `HU-011`).
  - Bloque 3: integración SECOP/datos.gov.co (`HU-003`, `HU-004`, `HU-008`).
  - Bloque 4: bookmarks (`HU-005`, `HU-006`, `HU-014`).
  - Bloque 5: búsquedas guardadas (`HU-007`, `HU-014`).
- Guardrails:
  - TDD por bloque.
  - No datos sintéticos en backend.
  - Capas `api -> services -> repositories -> db`.
  - Commit/push solo con autorización explícita.
- Próximo paso recomendado: revisar y autorizar commit/push del esqueleto backend + plan; luego iniciar bloque de auth.

## Ajuste de carpeta de código real y alcance autorizado — 2026-07-08

- Avance: Se corrigió la ubicación semántica del código ejecutable.
- Decisión:
  - `05-learning/04-code/` queda como carpeta de aprendizaje, guías técnicas y fuentes de referencia.
  - `06-code/` queda como carpeta real del código ejecutable del producto.
- Cambio estructural:
  - `codigo/` se renombró a `06-code/` para mantener nombre en inglés y continuidad incremental con el repositorio.
- Alcance autorizado por Ariel:
  - Autorizado ahora: Bloque 0 y Bloque 1 backend.
  - No autorizado todavía: Bloque 2 en adelante.
- Regla SECOP antes de Bloque 2+:
  - Antes de implementar oportunidades, SECOP, bookmarks o búsquedas guardadas, revisar `05-learning/04-code/integrations/SECOP II - Contratos Electrónicos.postman_collection.json`.
  - Esa colección Postman es fuente de verdad funcional para consumo de servicios SECOP y puede ajustarse si hace falta.
- Próximo paso: revalidar DB/backend desde `06-code/` y luego decidir commit/push si Ariel autoriza.

## Repositorio

https://github.com/ariel5253/reto-ai-first-fase1
