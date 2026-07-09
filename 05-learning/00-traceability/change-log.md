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
- `06-code/db/README.md`
- `06-code/db/modelo-logico-3nf.md`
- `06-code/db/schema-logico.sql`
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
- `06-code/db/README.md`
- `06-code/db/modelo-logico-3nf.md`
- `06-code/db/schema-logico.sql`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** Singular model validation passed: all SQL table declarations use singular names, plural table names are absent, `app_user` avoids PostgreSQL reserved-word collision, and naming policies now require singular table names.
**Pending follow-up:** Future migrations, ORM models and repositories must use the singular table names from `06-code/db/schema-logico.sql`.

## 2026-07-06 — Incorporate external DB model review

**Change type:** database | architecture | documentation
**Reason:** Evaluate an external review of the logical DB model and incorporate the recommendations that improve PostgreSQL readiness, SECOP traceability and saved-search flexibility without breaking 3NF or MVP scope.
**Layers affected:** database / backend / integrations / tests / documentation / traceability
**Files changed:**
- `06-code/db/README.md`
- `06-code/db/modelo-logico-3nf.md`
- `06-code/db/schema-logico.sql`
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
**Reason:** The user defined a new operational rule: Hermes must not commit or push unless explicitly instructed and authorized. The user also requested a PostgreSQL container in `06-code/db/` using the logical model and local credentials `admin` / `abcd1234`.
**Layers affected:** database / planning / traceability / documentation
**Files changed:**
- `.gitignore`
- `05-learning/01-planning/governance.md`
- `05-learning/01-planning/conventional-commits.md`
- `06-code/db/README.md`
- `06-code/db/docker-compose.yml`
- `06-code/db/.env.example`
- `06-code/db/.env` (local only, ignored by Git)
- `06-code/db/init/01-schema.sql`
- `06-code/db/init/02-seed-catalogs.sql`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Verification:** Docker PostgreSQL container started successfully through Docker Desktop, schema and seed scripts were applied, 10 tables were created, and catalog seed counts were verified: 1 source, 1 dataset, 4 statuses, 9 search filter keys.
**Pending follow-up:** Do not commit or push these changes unless Ariel explicitly authorizes it. Future backend settings should use the local PostgreSQL credentials defined in `06-code/db/.env` (`admin` / requested local password) for local development.

## 2026-07-08 — Clarify explicit challenge requirements vs internal stack decisions

**Change type:** planning | documentation | governance
**Reason:** Prevent the stack document from implying that FastAPI, React, PostgreSQL-only, Docker or pytest/httpx are mandated by the challenge. The challenge explicitly requires JWT auth, REST backend, functional frontend, SQLite or PostgreSQL, and datos.gov.co/SECOP integration; the rest are internal implementation decisions.
**Layers affected:** backend / frontend / database / tests / documentation
**Files changed:**
- `05-learning/01-planning/ai-first-challenge-tech-stack.md`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Clarification:**
- Explicit challenge requirements: JWT auth, REST backend, functional frontend, SQLite or PostgreSQL, live datos.gov.co/SECOP integration, local runnable app.
- Internal decisions for this implementation: FastAPI/Python, PostgreSQL, React, pytest + httpx, Docker Compose for local DB, no E2E initially.

**Verification:** The stack document title, introduction, requirement table, decision table and checklist now distinguish challenge requirements from project decisions.
**Pending follow-up:** Continue with backend only after Ariel gives instructions for step 2.

## 2026-07-08 — Architecture readiness review before backend

**Change type:** architecture | requirements | database | documentation
**Reason:** Perform an end-to-end architect review across challenge requirements, architecture, user stories and database model before starting backend implementation.
**Layers affected:** database / backend / frontend / integrations / tests / documentation / traceability
**Files changed:**
- `05-learning/02-architecture/architecture-readiness-review.md`
- `05-learning/03-requirements/project-understanding.md`
- `05-learning/03-requirements/scope-coverage.md`
- `05-learning/README.md`
- `06-code/db/modelo-logico-3nf.md`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Findings:** No blocking structural issues were found. The architecture is ready to proceed with guardrails: start backend with a minimal contract, FastAPI health endpoint and PostgreSQL connection check before implementing auth, SECOP or frontend flows.
**Corrections applied:** Clarified requirement-vs-decision language in requirements docs, fixed minor DB model documentation inconsistencies, and added an architecture readiness review document.
**Verification:** Mechanical review passed: 14 HUs, no HU missing from priority summary, acceptance map or scope coverage; 10 DB tables; critical unique/check constraints present; blocking readiness issues: none.
**Pending follow-up:** Wait for Ariel's instructions for step 2. Recommended next step: `GET /api/health` plus DB connectivity check.

## 2026-07-08 — Add DB-only synthetic DEV seed data

**Change type:** database | documentation | governance | traceability
**Reason:** Add initial synthetic data for local PostgreSQL validation while explicitly preventing the common vibecoding mistake of hardcoding demo/synthetic data inside backend code.
**Layers affected:** database / backend / tests / documentation / traceability
**Files changed:**
- `06-code/db/init/03-seed-dev-synthetic.sql`
- `06-code/db/README.md`
- `05-learning/01-planning/delivery-checklist.md`
- `05-learning/04-code/backend/README.md`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Propagation checked:**
- [x] Database impact reviewed
- [x] Backend impact reviewed
- [x] Frontend impact reviewed
- [x] Tests impact reviewed
- [x] Documentation impact reviewed

**Rule:** Synthetic DEV data must live only in DB SQL scripts under `06-code/db/init/`. It must not be copied into backend routes, services, repositories, tests or frontend code.
**Seed contents:** 2 synthetic users, 3 contracting entities, 3 public opportunities, 3 bookmarks, 2 saved searches and 5 saved-search filter values.
**Verification:** Seed script applied successfully to the running PostgreSQL container; joined bookmark/opportunity query returned the expected synthetic rows.
**Pending follow-up:** Backend implementation must read real DB state through repositories and must not recreate these synthetic records in code.

## 2026-07-08 — Add initial FastAPI backend skeleton

**Change type:** backend | tests | documentation | traceability
**Reason:** Start backend implementation with the smallest architecture-respecting skeleton before implementing user stories.
**Layers affected:** backend / database / tests / documentation / traceability
**Files changed:**
- `06-code/backend/README.md`
- `06-code/backend/pyproject.toml`
- `06-code/backend/uv.lock`
- `06-code/backend/.env.example`
- `06-code/backend/app/main.py`
- `06-code/backend/app/api/v1/router.py`
- `06-code/backend/app/api/v1/health.py`
- `06-code/backend/app/core/config.py`
- `06-code/backend/app/db/health.py`
- `06-code/backend/tests/test_health.py`
- `05-learning/04-code/backend/README.md`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`
- `.gitignore`

**Propagation checked:**
- [x] Backend architecture reviewed
- [x] Database connectivity reviewed
- [x] API tests added
- [x] Synthetic-data rule preserved
- [x] Documentation updated

**TDD evidence:** First test run failed with `ModuleNotFoundError: No module named 'app'`, confirming the RED step before implementation. After implementation, `uv run pytest -q` passed with `.. [100%]`.
**Runtime verification:** With PostgreSQL container healthy, `curl http://127.0.0.1:8000/api/health` returned `{"status":"ok","database":"ok"}`.
**Pending follow-up:** Build the HU development plan before implementing auth, SECOP, bookmarks or frontend flows.

## 2026-07-08 — Add backend HU development plan

**Change type:** planning | backend | requirements | traceability
**Reason:** After validating the initial backend skeleton, define the ordered plan for implementing backend user stories without jumping directly into features.
**Layers affected:** backend / database / tests / documentation / traceability
**Files changed:**
- `05-learning/01-planning/backend-hu-development-plan.md`
- `05-learning/README.md`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Plan order:** contract/base technical layer, auth/users, local opportunity reads, SECOP integration, bookmarks, saved searches.
**Guardrails:** keep TDD per block, preserve DB-only synthetic data, maintain API -> services -> repositories -> DB boundaries, and require explicit authorization before commit/push.
**Pending follow-up:** Review the current backend skeleton and plan; if approved, commit/push, then start HU-001/HU-002 auth block.

## 2026-07-08 — Rename executable code folder and lock backend scope

**Change type:** architecture | repository structure | planning | integrations | traceability
**Reason:** Ariel clarified that `05-learning/04-code/` is the learning/reference area, not the executable code folder. The executable code folder must keep English naming and numeric continuity with the repo structure.
**Layers affected:** database / backend / integrations / documentation / traceability
**Files changed:**
- `codigo/` renamed to `06-code/`.
- `05-learning/02-architecture/project-tree.md`
- `05-learning/04-code/README.md`
- `05-learning/04-code/integrations/README.md`
- `05-learning/01-planning/backend-hu-development-plan.md`
- `05-learning/README.md`
- `05-learning/00-traceability/change-log.md`
- `SOUL.md`

**Decision:** `05-learning/04-code/` remains for learning, technical guides and integration reference artifacts. Real executable product code lives under `06-code/`.
**Scope authorization:** Only backend Block 0 and Block 1 are authorized now. Blocks 2+ must not start until the SECOP Postman collection is reviewed.
**SECOP source of truth:** `05-learning/04-code/integrations/SECOP II - Contratos Electrónicos.postman_collection.json` exists and must be reviewed before implementing opportunities/SECOP integration flows. It can be adjusted, but backend integration must start from this working artifact.
**Pending follow-up:** Re-run backend and DB verification from `06-code/` after the rename.

## 2026-07-08 — Trace HU-009 database schema coverage

**Change type:** requirements | database | traceability
**Reason:** Close traceability for HU-009 against work already completed in the PostgreSQL data layer.
**Layers affected:** database / requirements / traceability
**HU covered:** HU-009.
**Coverage:** HU-009 is covered by the PostgreSQL 3NF schema in `06-code/db/init/01-schema.sql`, the logical model in `06-code/db/modelo-logico-3nf.md`, and controlled seeds in `06-code/db/init/`.
**Status:** covered.

## 2026-07-08 — Trace HU-010 backend contract coverage

**Change type:** requirements | backend | tests | traceability
**Reason:** Close traceability for HU-010 against the backend skeleton already implemented.
**Layers affected:** backend / database / tests / traceability
**HU covered:** HU-010.
**Coverage:** HU-010 is covered by the FastAPI skeleton, `GET /api/health`, database connectivity check, and health tests in `06-code/backend/tests/test_health.py`.
**Status:** covered.

## 2026-07-08 — Trace HU-012 local execution documentation progress

**Change type:** requirements | documentation | traceability
**Reason:** Record partial progress for HU-012 without claiming completion before the backend is fully stabilized.
**Layers affected:** backend / documentation / traceability
**HU covered:** HU-012.
**Coverage:** HU-012 is partially covered by backend and database execution notes in `06-code/backend/README.md` and `06-code/db/README.md`.
**Status:** in progress; README de ejecución local queda pendiente hasta que backend esté completo.

## 2026-07-08 — Trace HU-013 SOUL evidence coverage

**Change type:** requirements | documentation | traceability
**Reason:** Close traceability for HU-013 against the updated execution log and evidence checkpoints.
**Layers affected:** documentation / traceability
**HU covered:** HU-013.
**Coverage:** HU-013 is covered by `SOUL.md`, which now contains project, stack, Hermes/LLM usage, technical decisions, blockers, learnings, chronological checkpoints, and repository reference.
**Status:** covered.

## 2026-07-09 — Migrate backend skeleton to hexagonal package structure

**Change type:** backend | architecture | tests | documentation | traceability
**Reason:** Align the executable FastAPI skeleton with the hexagonal backend structure documented in `05-learning/02-architecture/backend-tree.md`.
**Layers affected:** backend / tests / architecture / documentation / traceability
**Files changed:**
- `06-code/backend/app/main.py`
- `06-code/backend/app/infrastructure/database/health.py`
- `06-code/backend/app/interfaces/api/v1/health.py`
- `06-code/backend/app/interfaces/api/v1/router.py`
- `06-code/backend/app/domain/__init__.py`
- `06-code/backend/app/application/ports/__init__.py`
- `06-code/backend/app/application/use_cases/__init__.py`
- `06-code/backend/app/infrastructure/external/__init__.py`
- `06-code/backend/app/infrastructure/security/__init__.py`
- `06-code/backend/app/interfaces/api/v1/__init__.py`
- `06-code/backend/tests/test_health.py`
- `06-code/backend/README.md`
- `05-learning/02-architecture/backend-tree.md`
- `05-learning/04-code/backend/README.md`
- `05-learning/00-traceability/change-log.md`

**Migration:** moved the health check from `app/db/` to `app/infrastructure/database/`, moved the versioned API router from `app/api/v1/` to `app/interfaces/api/v1/`, and removed obsolete layered skeleton folders.
**Verification:** `uv run pytest -q` passed with 2 health endpoint tests after the move.
**Pending follow-up:** Future HU blocks must add domain logic through `domain/`, `application/ports/`, `application/use_cases/`, `infrastructure/`, and `interfaces/` instead of recreating layered `services` or `repositories` folders.
