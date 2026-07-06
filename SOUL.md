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
