# SOUL.md

Bitácora de ejecución del Reto AI-First Fase 1.

Este archivo registra el proceso real seguido durante el reto: decisiones, pasos ejecutados, evidencia, bloqueos y próximos pasos. No reemplaza los documentos de planificación en `05-learning/`; resume el avance verificable y deja trazabilidad del trabajo realizado.

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

- Avance: Se inició la construcción del producto por la capa de datos, creando el modelo lógico PostgreSQL normalizado a 3NF en `codigo/db/`.
- Pasos realizados:
  - Se revisaron requisitos HU-001 a HU-014 y reglas de arquitectura/base de datos.
  - Se creó `codigo/db/modelo-logico-3nf.md` con entidades, atributos, relaciones, constraints, cardinalidades, índices y trazabilidad a HU.
  - Se creó `codigo/db/schema-logico.sql` como DDL PostgreSQL de referencia para validar el modelo lógico.
  - Se creó `codigo/db/README.md` con reglas aplicadas y propósito de la carpeta.
  - Se actualizó `05-learning/00-traceability/change-log.md`.
  - Se validó automáticamente que el modelo incluye tablas requeridas, constraints, índices clave y trazabilidad HU.
- Riesgos/Bloqueos:
  - El modelo aún no es una migración ejecutable de la app; debe convertirse a migraciones cuando creemos la estructura backend/DB.
  - Falta decidir si las oportunidades SECOP se persistirán solo al guardar bookmark/detalle o si habrá cache controlado.
- Próximo paso: Crear la estructura de producto y convertir el DDL lógico en migración inicial reproducible.
- Evidencia:
  - `codigo/db/modelo-logico-3nf.md`
  - `codigo/db/schema-logico.sql`
  - Validación: `VALIDATION_OK`

## Ajuste de convención de datos — 2026-07-06

- Avance: Se actualizó la política y el modelo lógico para que las entidades y tablas del modelo de datos usen nombres en singular.
- Pasos realizados:
  - Se actualizó `05-learning/01-planning/ai-first-challenge-best-practices.md` para prohibir tablas nuevas en plural.
  - Se actualizó `05-learning/01-planning/ai-first-challenge-tech-stack.md` con la regla de tablas singulares y la excepción segura `app_user` por colisión con palabra reservada `user` en PostgreSQL.
  - Se actualizó `codigo/db/modelo-logico-3nf.md` reemplazando nombres plurales por nombres singulares.
  - Se actualizó `codigo/db/schema-logico.sql` para usar tablas singulares: `app_user`, `opportunity_source`, `contracting_entity`, `opportunity_status`, `public_opportunity`, `bookmark`, `saved_search`, `search_filter_key`, `saved_search_filter_value`.
  - Se actualizó `codigo/db/README.md` con la convención de nombres.
  - Se actualizó `05-learning/00-traceability/change-log.md`.
- Riesgos/Bloqueos:
  - Las futuras migraciones, modelos ORM y repositorios deben respetar exactamente estos nombres singulares.
- Próximo paso: Usar `codigo/db/schema-logico.sql` como base de la migración inicial.
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

- Avance: Se actualizó la regla operativa de Git y se construyó la base de datos PostgreSQL local en `codigo/db/` usando Docker.
- Reglas actualizadas:
  - Hermes no debe realizar commit ni push salvo que Ariel lo indique y autorice explícitamente.
  - La regla quedó documentada en `05-learning/01-planning/governance.md` y `05-learning/01-planning/conventional-commits.md`.
- Pasos realizados:
  - Se creó `codigo/db/docker-compose.yml` con PostgreSQL 16 Alpine.
  - Se creó `codigo/db/.env` local con usuario PostgreSQL `admin`, password solicitado y base `portal_convocatorias`; el archivo está ignorado por Git.
  - Se creó `codigo/db/.env.example`.
  - Se creó `codigo/db/init/01-schema.sql` desde el modelo lógico actualizado.
  - Se creó `codigo/db/init/02-seed-catalogs.sql` con catálogos mínimos SECOP, estados y filtros.
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
  - Se construyó el contenedor PostgreSQL en `codigo/db/`.
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
