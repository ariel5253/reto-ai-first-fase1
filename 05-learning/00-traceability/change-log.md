# Change log

> Trazabilidad técnica de cambios del reto. Este archivo registra impacto entre capas y archivos afectados. No reemplaza `SOUL.md`; lo complementa.

## 2026-07-04 — Add change guardian and traceability log

**Change type:** architecture | documentation
**Reason:** Ensure every system change updates impacted files and leaves a technical trace across database, backend, frontend, tests and documentation.
**Layers affected:** docs / architecture / planning
**Files changed:**
- `05-learning/00-traceability/change-guardian.md`
- `05-learning/00-traceability/change-log.md`
- `05-learning/README.md`
- `05-learning/01-planning/governance.md`
- `05-learning/01-planning/delivery-checklist.md`
- `05-learning/01-planning/canonical-ai-first-phase1-challenge-plan.md`
- `05-learning/02-architecture/project-tree.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** End-to-end consistency check for `05-learning/` executed after references were updated.
**Pending follow-up:** none

## 2026-07-04 — Reorder traceability and add requirements/code structure

**Change type:** architecture | planning | documentation
**Reason:** Move traceability to the first position, reserve requirements for HU derived from project understanding, and define a code organization area by layer.
**Layers affected:** docs / architecture / planning / requirements / code guidance
**Files changed:**
- `05-learning/00-traceability/change-guardian.md`
- `05-learning/00-traceability/change-log.md`
- `05-learning/README.md`
- `05-learning/01-planning/governance.md`
- `05-learning/01-planning/canonical-ai-first-phase1-challenge-plan.md`
- `05-learning/02-architecture/project-tree.md`
- `05-learning/03-requirements/README.md`
- `05-learning/03-requirements/project-understanding.md`
- `05-learning/03-requirements/user-stories.md`
- `05-learning/03-requirements/acceptance-criteria.md`
- `05-learning/04-code/README.md`
- `05-learning/04-code/db/README.md`
- `05-learning/04-code/backend/README.md`
- `05-learning/04-code/frontend/README.md`
- `05-learning/04-code/integrations/README.md`
- `05-learning/04-code/testing/README.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** End-to-end consistency check for `05-learning/` executed after references were updated.
**Pending follow-up:** none

## 2026-07-04 — Rename learning folder and define initial user stories

**Change type:** documentation | requirements | architecture
**Reason:** Rename the learning folder to `05-learning/` and complete the initial requirements backlog for the Portal de Convocatorias Públicas.
**Layers affected:** docs / requirements / architecture / traceability
**Files changed:**
- `05-learning/README.md`
- `05-learning/00-traceability/change-log.md`
- `05-learning/03-requirements/user-stories.md`
- `05-learning/03-requirements/acceptance-criteria.md`
- all Markdown references to the previous learning-folder name were updated to `05-learning/`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** End-to-end quality check for `05-learning/` executed after folder rename and HU updates.
**Pending follow-up:** none

## 2026-07-04 — Complete end-to-end HU scope coverage

**Change type:** requirements | documentation | traceability
**Reason:** Add missing technical and delivery user stories so HU coverage matches the full Track DEV scope end-to-end.
**Layers affected:** requirements / database / backend / frontend / integrations / tests / documentation
**Files changed:**
- `05-learning/03-requirements/user-stories.md`
- `05-learning/03-requirements/acceptance-criteria.md`
- `05-learning/03-requirements/scope-coverage.md`
- `05-learning/03-requirements/README.md`
- `05-learning/README.md`
- `05-learning/02-architecture/project-tree.md`
- `05-learning/01-planning/canonical-ai-first-phase1-challenge-plan.md`
- `05-learning/00-traceability/change-log.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** Automated HU scope coverage check passed: 14/14 HU present and no blocking issues.
**Pending follow-up:** none

## 2026-07-06 — Close HU scope coverage review

**Change type:** requirements | traceability | documentation
**Reason:** Document the closure of the end-to-end HU coverage review after confirming the Track DEV scope is fully covered by HU-001 through HU-014.
**Layers affected:** requirements / traceability / documentation
**Files changed:**
- `05-learning/00-traceability/change-log.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** Final E2E HU scope coverage check returned COMPLETE: 14/14 HU present, no blocking issues, no stale references, no broken references.
**Pending follow-up:** Before implementation, close the non-blocking product decisions listed in `05-learning/03-requirements/scope-coverage.md`: SECOP search fields, bookmark persisted fields, cache vs on-demand external opportunities, and first-demo saved-search scope.

## 2026-07-06 — Add conventional commit rules

**Change type:** planning | documentation | governance
**Reason:** Establish the official commit-message policy before publishing incremental progress to GitHub.
**Layers affected:** planning / traceability / documentation
**Files changed:**
- `05-learning/01-planning/conventional-commits.md`
- `05-learning/01-planning/governance.md`
- `05-learning/README.md`
- `05-learning/00-traceability/change-log.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** Conventional commits document check passed: required rules, examples, governance link and README link are present; no broken Markdown references found.
**Pending follow-up:** none

## 2026-07-06 — Add 3NF logical database model

**Change type:** database | architecture | documentation
**Reason:** Start product construction with a normalized PostgreSQL logical model that satisfies the challenge requirements for auth, SECOP-backed opportunities, bookmarks, saved searches and user data isolation.
**Layers affected:** database / backend / tests / documentation / traceability
**Files changed:**
- `codigo/db/README.md`
- `codigo/db/modelo-logico-3nf.md`
- `codigo/db/schema-logico.sql`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** Logical model validation passed: required tables, HU traceability, constraints and key indexes are present; model documents 3NF with no denormalization exception.
**Pending follow-up:** Convert `schema-logico.sql` into executable migrations when backend/DB project structure is created.

## 2026-07-06 — Enforce singular data-model naming

**Change type:** database | governance | documentation
**Reason:** The user defined a stricter data-model naming rule: entities and table names must be singular.
**Layers affected:** database / planning / architecture / documentation / traceability
**Files changed:**
- `05-learning/01-planning/ai-first-challenge-best-practices.md`
- `05-learning/01-planning/ai-first-challenge-tech-stack.md`
- `codigo/db/README.md`
- `codigo/db/modelo-logico-3nf.md`
- `codigo/db/schema-logico.sql`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** Singular model validation passed: all SQL table declarations use singular names, plural table names are absent, `app_user` avoids PostgreSQL reserved-word collision, and naming policies now require singular table names.
**Pending follow-up:** Future migrations, ORM models and repositories must use the singular table names from `codigo/db/schema-logico.sql`.

## 2026-07-06 — Incorporate external DB model review

**Change type:** database | architecture | documentation
**Reason:** Evaluate an external review of the logical DB model and incorporate the recommendations that improve PostgreSQL readiness, SECOP traceability and saved-search flexibility without breaking 3NF or MVP scope.
**Layers affected:** database / backend / integrations / tests / documentation / traceability
**Files changed:**
- `codigo/db/README.md`
- `codigo/db/modelo-logico-3nf.md`
- `codigo/db/schema-logico.sql`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Accepted recommendations:**
- Keep `app_user` instead of `user`.
- Add SECOP/datos.gov.co traceability through `opportunity_dataset`, `external_process_id`, `source_synced_at`, `source_last_seen_at` and `detail_url`.
- Use `timestamptz` for opportunity publication/closing fields.
- Allow multiple values per saved-search filter.
- Document COP pesos-to-cents conversion for `estimated_amount_cents`.

**Discarded/deferred recommendations:**
- `users` table name: discarded because data-model policy now requires singular tables.
- Raw SECOP payload persistence: deferred because it is not required for the MVP and would need a documented denormalization/audit extension.
- Duplicating original status/entity text in `public_opportunity`: discarded in the 3NF base because status and entity are normalized.

**Verification:** External-review validation passed: required tables exist, public opportunities carry dataset traceability without transitive `source_id`, saved-search filters allow multiple values, dates use `timestamptz`, and amount conversion is documented.
**Pending follow-up:** Reflect these fields in the first executable migration and later in backend schemas/repositories.

## 2026-07-06 — Add commit authorization rule and local DB container

**Change type:** governance | database | docker | documentation
**Reason:** The user defined a new operational rule: Hermes must not commit or push unless explicitly instructed and authorized. The user also requested a PostgreSQL container in `codigo/db/` using the logical model and local credentials `admin` / `abcd1234`.
**Layers affected:** database / planning / traceability / documentation
**Files changed:**
- `.gitignore`
- `05-learning/01-planning/governance.md`
- `05-learning/01-planning/conventional-commits.md`
- `codigo/db/README.md`
- `codigo/db/docker-compose.yml`
- `codigo/db/.env.example`
- `codigo/db/.env` (local only, ignored by Git)
- `codigo/db/init/01-schema.sql`
- `codigo/db/init/02-seed-catalogs.sql`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** Docker PostgreSQL container started successfully through Docker Desktop, schema and seed scripts were applied, 10 tables were created, and catalog seed counts were verified: 1 source, 1 dataset, 4 statuses, 9 search filter keys.
**Pending follow-up:** Do not commit or push these changes unless Ariel explicitly authorizes it. Future backend settings should use the local PostgreSQL credentials defined in `codigo/db/.env` (`admin` / requested local password) for local development.
