# Change guardian

> Regla operativa para que cada cambio del sistema deje trazabilidad y actualice los archivos relacionados. Este documento complementa `SOUL.md`: SOUL registra la historia y decisiones del reto; el guardian registra impacto técnico y propagación entre capas.

## 1. Propósito

Evitar cambios aislados que rompan consistencia entre database, backend, frontend, tests y documentación.

Cada cambio relevante debe responder:

- Qué cambió.
- Por qué cambió.
- Qué capas afecta.
- Qué archivos se actualizaron.
- Qué archivos quedan pendientes.
- Cómo se verificó.

## 2. Regla principal

Ningún cambio técnico se considera cerrado hasta que:

1. Se actualicen los archivos directamente modificados.
2. Se revisen las capas afectadas hacia adelante y hacia atrás.
3. Se actualicen los documentos de arquitectura/planificación relacionados.
4. Se agregue una entrada en `05-learning/00-traceability/change-log.md`.
5. Se registre en `SOUL.md` solo si el cambio representa avance, decisión, bloqueo o evidencia relevante del reto.

## 3. Propagation map

```text
Database change
-> revisar backend repositories/schemas/use cases
-> revisar API contract
-> revisar frontend types/services/forms
-> revisar tests y documentación

Backend change
-> revisar API contract
-> revisar frontend services/types/pages
-> revisar database migrations/seeds si cambia persistencia
-> revisar tests y documentación

Frontend change
-> revisar API assumptions
-> revisar backend contract si la UI necesita datos nuevos
-> revisar reglas de negocio para evitar duplicación en frontend
-> revisar documentación y checklist

External integration change
-> revisar backend client
-> revisar error handling
-> revisar data normalization
-> revisar frontend states
-> revisar tests con mocks/fixtures
```

## 4. Layer-specific guardian rules

### Database

Si cambia DB:

- Revisar si requiere migration.
- Revisar normalización 3NF.
- Revisar constraints, indexes y foreign keys.
- Revisar seeds y `06-code/db/init/`.
- Revisar backend schemas/repositories/use cases.
- Revisar frontend types si cambia el contrato expuesto por backend.

### Backend

Si cambia backend:

- Revisar si cambia contrato API.
- Revisar si afecta frontend services/types/pages.
- Revisar si afecta DB schema, migrations o seeds.
- Revisar tests API con pytest + httpx.
- Confirmar que no se agregan datos demo ni seeds persistentes en backend.

### Frontend

Si cambia frontend:

- Revisar si depende de nuevos campos o endpoints.
- Revisar si backend ya expone esos datos.
- Confirmar que no se agregan reglas críticas de negocio en UI.
- Confirmar que no consume SECOP ni DB directamente.
- Revisar estados loading/error/empty/success.

### Documentation

Si cambia una regla, arquitectura o decisión:

- Actualizar la fuente de verdad correspondiente.
- Actualizar referencias cruzadas.
- Actualizar `05-learning/README.md` si aparece un documento nuevo.
- Actualizar `05-learning/00-traceability/change-log.md`.

## 5. Required log entry

Cada cambio relevante debe agregar una entrada con este formato en `05-learning/00-traceability/change-log.md`:

```markdown
## YYYY-MM-DD — Short change title

**Change type:** planning | architecture | database | backend | frontend | testing | documentation
**Reason:**
**Layers affected:** database / backend / frontend / docs / tests
**Files changed:**
- `path/to/file`

**Propagation checked:**
- [ ] Database impact reviewed
- [ ] Backend impact reviewed
- [ ] Frontend impact reviewed
- [ ] Tests impact reviewed
- [ ] Documentation impact reviewed

**Verification:**
**Pending follow-up:** none | description
```

## 6. Difference between SOUL and change log

| File | Purpose |
|---|---|
| `SOUL.md` | Narrative of challenge process: decisions, blockers, evidence, daily checkpoints. |
| `05-learning/00-traceability/change-log.md` | Technical trace: what changed, affected layers, files updated, propagation checks. |

Rule: do not duplicate long technical details in `SOUL.md`; link or summarize when needed.

## 7. Completion checklist

Before closing any change:

- [ ] I identified the primary changed layer.
- [ ] I reviewed downstream and upstream impact.
- [ ] I updated affected files, not only the first file touched.
- [ ] I updated source-of-truth docs if rules changed.
- [ ] I added a change-log entry.
- [ ] I updated `SOUL.md` only if the change matters for challenge evidence.
