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
- Cada bloque funcional implementado cierra con un checkpoint en SOUL.md antes del commit. No se comitea código sin evidencia de tests y checkpoint.

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

## Refactor a arquitectura hexagonal — 2026-07-08

- Avance: Se migró el backend de arquitectura por capas a arquitectura hexagonal.
- Decisión: la estructura documental en `05-learning/` describía hexagonal pero el código real en `06-code/backend/` era layered. Se eligió migrar el código para alinearlo con la documentación (Opción B).
- Pasos realizados:
  - Se movieron los módulos al esquema `domain/` → `application/ports/` → `application/use_cases/` → `infrastructure/` → `interfaces/api/v1/`.
  - Se actualizaron imports de la app y tests existentes.
  - Se verificó que los 2 tests existentes seguían en GREEN.
- Evidencia: `uv run pytest -q` → `2 passed`.
- Riesgos/Bloqueos: El cambio de arquitectura podía romper imports o rutas; se mitigó ejecutando tests antes de continuar.
- Próximo paso: implementar HU-001 y HU-002 (auth) con ciclo RED→GREEN.

## Checkpoint backend — Auth HU-001 y HU-002 — 2026-07-08

- Avance: Se implementaron registro y login con JWT siguiendo TDD.
- Pasos realizados:
  - SDD: se definió contrato REST en `05-learning/04-code/backend/auth-api-contract.md` para auth.
  - RED: se escribieron tests para register (201, 409, 422) y login (200, 401, claims JWT y normalización de email).
  - GREEN: se implementaron `RegisterUserUseCase`, `LoginUserUseCase`, `PostgreSQLUserRepository`, JWT encode/decode y handlers FastAPI con DI.
  - Se corrigió violación de DI: los handlers delegan repositorios mediante `Depends()`.
- Evidencia: `uv run pytest -q` → `14 passed`.
- Rama: `feat/auth`. Commits publicados en origin y mergeados a `main` vía PR #1.
- HU cubiertas: HU-001 (registro), HU-002 (login).
- Riesgos/Bloqueos: Se protegió `.env`; las credenciales reales no se versionan.
- Próximo paso: implementar oportunidades SECOP (HU-003, HU-004, HU-008).

## Checkpoint backend — Oportunidades SECOP HU-003, HU-004, HU-008 — 2026-07-08

- Avance: Se implementó la integración con datos.gov.co / SECOP y los endpoints de búsqueda y detalle de convocatorias.
- Pasos realizados:
  - Se consultó la colección Postman SECOP y se verificó la API real en vivo con una consulta de solo lectura.
  - Se documentó el contrato y los campos reales de respuesta en `05-learning/04-code/backend/opportunities-api-contract.md`.
  - RED: se escribieron tests para search (200, lista vacía y 503) y detail (200 y 404).
  - GREEN: se implementó `HttpSecopClient` con `httpx`, normalización de campos, persistencia normalizada y manejo de timeout/error/JSON inválido → `SecopUnavailableError` → 503.
  - Decisión: `closing_at = null` cuando no hay campo confiable en la API SECOP real.
- Evidencia: `uv run pytest -q` → `22 passed` en `feat/opportunities`.
- Rama: `feat/opportunities`. Commits publicados en origin.
- HU cubiertas: HU-003 (búsqueda), HU-004 (detalle), HU-008 (fallos integración).
- Riesgos/Bloqueos: La API externa puede cambiar o fallar; se encapsuló detrás de un puerto y se testearon fallos controlados.
- Próximo paso: implementar bookmarks (HU-005, HU-006, HU-014).

## Checkpoint backend — Bookmarks HU-005, HU-006, HU-014 — 2026-07-09

- Avance: Se implementó CRUD de bookmarks con aislamiento por usuario.
- Pasos realizados:
  - Se documentó el contrato en `05-learning/04-code/backend/bookmarks-api-contract.md` alineado con la tabla `bookmark`.
  - RED: se escribieron tests para crear bookmark (201, 409, 404, 401), listar (200, vacío, 401, aislamiento por usuario) y eliminar (204, 404 por ownership).
  - GREEN: se implementaron `CreateBookmarkUseCase`, `ListBookmarksUseCase`, `DeleteBookmarkUseCase`, `PostgreSQLBookmarkRepository` y handler FastAPI.
  - HU-014: el `user_id` se extrae siempre del JWT, nunca de parámetros manipulables. El test de aislamiento verifica que usuario B no ve ni elimina datos de usuario A.
- Evidencia: `uv run pytest -q` → `24 passed` en `feat/bookmarks`.
- Rama: `feat/bookmarks`. Commits publicados en origin.
- HU cubiertas: HU-005 (crear), HU-006 (listar), HU-014 (aislamiento).
- Riesgos/Bloqueos: `feat/bookmarks` fue creada desde `main` antes del merge de `feat/opportunities`; por eso la validación de esa rama no incluía aún los tests de opportunities.
- Próximo paso: implementar búsquedas guardadas (HU-007).

## Checkpoint backend — Búsquedas guardadas HU-007 — 2026-07-09

- Avance: Se implementó CRUD de búsquedas guardadas con aislamiento por usuario.
- Pasos realizados:
  - Se documentó el contrato en `05-learning/04-code/backend/saved-searches-api-contract.md` alineado con las tablas `saved_search`, `search_filter_key` y `saved_search_filter_value` del schema.
  - RED: 11 tests escritos para crear (201, 409, 422, 401), listar (200, aislamiento, 401) y eliminar (204, 404, 401). Todos fallaron en 404 por ruta inexistente.
  - GREEN: se implementaron `CreateSavedSearchUseCase`, `ListSavedSearchesUseCase`, `DeleteSavedSearchUseCase`, `PostgreSQLSavedSearchRepository` y handler FastAPI.
  - La persistencia usa JOIN entre `saved_search` y `saved_search_filter_value` a través de `search_filter_key.code` para resolver `filter_key_id`.
- Evidencia: `uv run pytest tests/ -v` → `25 passed` en `feat/saved-searches`.
  - `test_saved_searches.py`: 11 passed.
  - `test_auth_login.py`: 6 passed.
  - `test_auth_register.py`: 6 passed.
  - `test_health.py`: 2 passed.
- Rama: `feat/saved-searches`. Commits publicados en origin.
- HU cubiertas: HU-007 (búsquedas guardadas), HU-014 (aislamiento reforzado).
- Riesgos/Bloqueos: La rama fue creada desde `main`; aún debe coordinarse la integración con ramas `feat/opportunities` y `feat/bookmarks` para resolver posibles solapes de router/puertos antes del frontend.
- Próximo paso: actualizar `SOUL.md` como regla de cierre y arrancar `feat/frontend` cuando Ariel lo autorice.

## Checkpoint frontend — Scaffold React+TS+Vite — 2026-07-10

- Avance: Se creó el scaffold real del frontend en `06-code/frontend/` siguiendo la arquitectura definida en `frontend-tree.md` y `layer-responsibilities.md`.
- Pasos realizados:
  - Se creó proyecto React 18 + TypeScript + Vite desde cero en `06-code/frontend/`.
  - Se configuró Tailwind CSS v4 con `@tailwindcss/vite`.
  - Se configuró React Router v6 con rutas públicas y privadas mediante `PrivateRoute`.
  - Se eligió Zustand para estado global de autenticación (`token` + `user`).
  - Se eligió `fetch` nativo para servicios HTTP explícitos por dominio, sin React Query ni SWR.
  - Se definieron tipos en `src/types/api.ts` derivados de contratos REST del backend, no del mockup visual.
  - Se creó proxy Vite `/api` → `http://localhost:8000` para evitar CORS en desarrollo.
  - Se agregó `.gitignore` para `node_modules/` y `dist/`.
- Evidencia:
  - `npm run build` → build exitoso con TypeScript y Vite.
  - `npm run dev` → servidor disponible en `http://127.0.0.1:3000` y verificado con `curl -I` → `HTTP/1.1 200 OK`.
- Decisiones:
  - Zustand para estado global simple y explícito.
  - `fetch` nativo para control directo de llamadas a `/api/v1/*`.
  - React Router v6 para rutas declarativas públicas/privadas.
- HU parciales: HU-001 a HU-008 y HU-014 quedan iniciadas en capa frontend mediante estructura, rutas, tipos y servicios; las páginas funcionales quedan para el siguiente bloque.
- Riesgos/Bloqueos: El mockup en `05-learning/04-code/frontend/ui-mockup/` se mantiene como referencia visual únicamente; no se copió ni importó código desde esa carpeta.
- Próximo paso: implementar páginas reales y flujos frontend en `feat/frontend`, empezando por auth y navegación privada.

## Checkpoint frontend — Auth pages HU-001 y HU-002 — 2026-07-10

- Avance: Se implementaron las páginas reales de login y registro, junto con layouts base público/privado para el portal.
- Pasos realizados:
  - Se leyeron los handlers y tests backend de auth para confirmar que register y login usan JSON body.
  - Se actualizó `services/auth.ts`: `registerUser()` consume `POST /api/v1/auth/register` y espera `UserResponse`; `loginUser()` consume `POST /api/v1/auth/login` y espera `AuthResponse` con JWT.
  - Se implementó `AppLayout` con navbar, navegación privada y botón de cerrar sesión.
  - Se implementó `PublicLayout` para login/register sin navbar.
  - Se migró el store Zustand a `persist` con localStorage key `auth-token`, `setToken`, `clearToken` e `isAuthenticated`.
  - Se implementó `LoginPage` con validación UX, estados loading/error/success, manejo 401/422 y redirección a `/dashboard`.
  - Se implementó `RegisterPage` con validación UX, manejo 409/422 y redirección a `/login` sin auto-login.
- Decisión: No hay auto-login después del registro; el usuario debe iniciar sesión explícitamente por consistencia UX y seguridad.
- Evidencia:
  - `npm run build` → build exitoso con TypeScript y Vite.
  - Backend levantado en `localhost:8000` con `uv run python -m uvicorn app.main:app --port 8000` y health `200`.
  - Frontend levantado en `localhost:3000` con `npm run dev` y `/register` respondió `200`.
  - Flujo verificado contra backend vía proxy Vite: register `201`, login `200`, JWT presente, `/dashboard` servido por SPA `200`.
- HUs completadas en frontend: HU-001 (registro), HU-002 (login JWT).
- Riesgos/Bloqueos: No hay navegador gráfico disponible en la sesión CLI; la verificación funcional se hizo con servidor real, proxy Vite y llamadas HTTP reales al backend.
- Próximo paso: Bloque 3 — Buscador + Detalle de convocatoria.

## Checkpoint frontend — Buscador + Detalle HU-003, HU-004 y HU-008 — 2026-07-10

- Avance: Se implementaron la página de búsqueda de convocatorias y la ficha de detalle con manejo de bookmarks y errores SECOP.
- Pasos realizados:
  - Se leyeron los handlers y tests backend de opportunities/bookmarks para confirmar query params, responses y códigos de error reales.
  - Se ajustó `services/opportunities.ts` para mapear filtros frontend a los parámetros backend reales (`query`, `entity`, `status`, `page`, `limit`).
  - Se ajustó `services/bookmarks.ts` para crear/listar/eliminar bookmarks con JWT.
  - Se creó `src/utils/formatters.ts` con `formatMillionsCOP` y `formatDate` reutilizables.
  - Se implementó `SearchPage` con filtros, búsqueda manual, skeleton, empty state, banner 503 SECOP, tabla y toggle de bookmark por fila.
  - Se implementó `OpportunityDetailPage` con carga por `id`, ficha de detalle, link SECOP, retry y toggle de bookmark sin recargar.
  - Se actualizó el routing para usar `/search` y `/opportunities/:id` con las páginas reales.
- Decisión: `closing_at = null` se presenta como “No disponible en SECOP II”; no se calcula ni se infiere la fecha porque es una decisión de arquitectura documentada.
- Evidencia:
  - `npm run build` → build exitoso con TypeScript y Vite.
  - Backend real en `localhost:8000` y frontend real en `localhost:3000`.
  - Flujo verificado vía proxy Vite contra backend real: register `201`, login `200`, búsqueda `200`, bookmark create `201`, detail `200`, `closing_at null` mostrado como “No disponible en SECOP II”, bookmark delete `204`.
- HUs completadas en frontend: HU-003 (búsqueda), HU-004 (detalle), HU-008 (manejo de error de integración en UI).
- Riesgos/Bloqueos: La verificación de interacción visual completa se hizo en sesión CLI mediante endpoints reales y rutas SPA; no hay navegador gráfico disponible en esta sesión.
- Próximo paso: Bloque 4 — Dashboard + Bookmarks + Búsquedas Guardadas.
