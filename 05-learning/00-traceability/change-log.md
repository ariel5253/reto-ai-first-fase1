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
