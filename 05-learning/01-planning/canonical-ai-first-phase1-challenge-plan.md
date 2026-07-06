# Plan canónico — Reto AI-First Fase 1

> Fuente de verdad para la planificación del reto. Este documento consolida los planes previos y debe leerse junto con `05-learning/01-planning/ai-first-challenge-tech-stack.md`, `05-learning/01-planning/governance.md` y `05-learning/02-architecture/project-tree.md`.

## 1. Propósito

Organizar la planificación del Reto AI-First Fase 1 sin crear código ni carpetas de ejecución todavía. El objetivo de esta carpeta es dejar decisiones, alcance, gobierno, stack y criterios de cierre listos para que la ejecución posterior no duplique ni contradiga información.

## 2. Fuentes de verdad

Cada decisión tiene una sola fuente principal:

| Decisión | Fuente de verdad |
|---|---|
| Stack tecnológico DEV | `05-learning/01-planning/ai-first-challenge-tech-stack.md` |
| Gobierno, aprobación y nomenclatura | `05-learning/01-planning/governance.md` |
| Buenas prácticas de código/docs | `05-learning/01-planning/ai-first-challenge-best-practices.md` |
| Árbol general del proyecto DEV | `05-learning/02-architecture/project-tree.md` |
| Checklist de entrega | `05-learning/01-planning/delivery-checklist.md` |
| Formato de checkpoints diarios | `05-learning/01-planning/daily-checkpoints.md` |
| Proceso operativo del reto | Este documento |

Regla: si dos documentos parecen contradecirse, se actualiza el documento secundario y se conserva la fuente de verdad indicada en esta tabla.

## 3. Alcance de planificación

### Incluido

- Definir el flujo operativo del reto.
- Documentar decisiones y fuentes de verdad.
- Mantener consistencia entre planificación, stack y arquitectura.
- Preparar criterios de aceptación y checklist de cierre.
- Definir cómo se registran checkpoints en `SOUL.md`.

### Fuera de alcance por ahora

- Crear código.
- Crear carpetas de ejecución como `track-dev/` o `track-qa/`.
- Instalar dependencias.
- Ejecutar tests de producto.
- Cambiar el stack sin aprobación explícita.
- Agregar E2E/Playwright como compromiso base.


## 4. Contexto del reto

El repositorio soporta el Programa AI-First Fase 1. Hay dos caminos posibles:

### Track DEV — Portal de Convocatorias Públicas

Construcción de una app con:

- Backend REST en FastAPI/Python.
- Base de datos PostgreSQL.
- Autenticación JWT.
- Frontend React.
- Pruebas API con pytest + httpx.
- Integración desde backend hacia datos.gov.co / SECOP.
- Entregables: app funcional, `SOUL.md`, `README.md` y demo de 5–7 minutos.

### Track QA — Gestor de Inventario

Diseño y ejecución de estrategia de pruebas sobre `3-challenge/gestor-inventario/`.

Regla clave: no modificar el SUT; solo probarlo.

Nota de consistencia: el SUT de QA usa SQLite internamente porque es parte del sistema bajo prueba. Eso no modifica la decisión de stack del Track DEV, cuya base de datos oficial es PostgreSQL.

## 5. Stack oficial para DEV

El stack no se define en este plan. La única fuente de verdad es `05-learning/01-planning/ai-first-challenge-tech-stack.md`.

Resumen no normativo:

- Backend: FastAPI / Python.
- Base de datos: PostgreSQL.
- Autenticación: JWT.
- Frontend: React.
- Testing API: pytest + httpx.
- E2E: no de momento.
- Integración externa: cliente HTTP backend hacia datos.gov.co / SECOP.

Cualquier cambio requiere el proceso de aprobación definido en `05-learning/01-planning/governance.md`.

## 6. Estructura documental canónica

La carpeta `05-learning/` queda organizada así:

```text
05-learning/
├── README.md
├── skills.md
├── 00-traceability/
│   ├── change-guardian.md
│   └── change-log.md
├── 01-planning/
│   ├── canonical-ai-first-phase1-challenge-plan.md
│   ├── ai-first-challenge-tech-stack.md
│   ├── ai-first-challenge-best-practices.md
│   ├── governance.md
│   ├── delivery-checklist.md
│   └── daily-checkpoints.md
├── 02-architecture/
│   ├── project-tree.md
│   ├── layer-responsibilities.md
│   ├── backend-tree.md
│   ├── frontend-tree.md
│   └── db-tree.md
├── 03-requirements/
│   ├── README.md
│   ├── project-understanding.md
│   ├── user-stories.md
│   ├── acceptance-criteria.md
│   └── scope-coverage.md
└── 04-code/
    ├── README.md
    ├── db/
    ├── backend/
    ├── frontend/
    ├── integrations/
    └── testing/
```

Orden arquitectónico:

- `00-traceability/`: primero, porque gobierna cualquier cambio.
- `01-planning/`: plan, stack, gobierno y checklist.
- `02-architecture/`: estructura y responsabilidades por capa.
- `03-requirements/`: entendimiento, HU y criterios de aceptación.
- `04-code/`: guía de implementación por capa.

La carpeta de planificación queda detallada así:

```text
05-learning/01-planning/
├── canonical-ai-first-phase1-challenge-plan.md
├── ai-first-challenge-tech-stack.md
├── ai-first-challenge-best-practices.md
├── governance.md
├── delivery-checklist.md
└── daily-checkpoints.md
```

La arquitectura se documenta en:

```text
05-learning/02-architecture/
├── project-tree.md
├── layer-responsibilities.md
├── backend-tree.md
├── frontend-tree.md
└── db-tree.md
```

La trazabilidad técnica se documenta primero porque gobierna cualquier cambio:

```text
05-learning/00-traceability/
├── change-guardian.md
└── change-log.md
```

Los requisitos y HU se documentan en:

```text
05-learning/03-requirements/
├── README.md
├── project-understanding.md
├── user-stories.md
└── acceptance-criteria.md
```

La guía de implementación se documenta en:

```text
05-learning/04-code/
├── README.md
├── db/
├── backend/
├── frontend/
├── integrations/
└── testing/
```

## 7. Flujo operativo sin priorización por fechas

El reto se ejecuta por fases lógicas, no por fechas ni días fijos:

### Fase 0 — Preparación y decisión de track

Objetivo: dejar claro qué track se ejecutará y qué evidencia se espera.

Checklist:

- Confirmar track elegido: DEV, QA o ambos.
- Revisar `CLAUDE.md` como contrato de trabajo AI-first.
- Revisar stack oficial si el track elegido incluye DEV.
- Revisar restricciones del SUT si el track elegido incluye QA.
- Crear o actualizar `SOUL.md` con decisión de track, herramientas y riesgos iniciales.
- Registrar cualquier decisión de arquitectura mediante el proceso de `governance.md`.

Criterio de salida:

- Track confirmado.
- Fuente de verdad identificada para cada decisión.
- `SOUL.md` inicial actualizado con evidencia real.

### Fase 1 — Especificación y arquitectura

Objetivo: convertir el track elegido en una especificación ejecutable y revisable.

Si el track es DEV:

- Especificar alcance del Portal de Convocatorias Públicas.
- Confirmar entidades principales: usuarios, convocatorias, bookmarks y búsquedas guardadas.
- Derivar HU en `05-learning/03-requirements/user-stories.md` desde el entendimiento del proyecto.
- Definir criterios de aceptación en `05-learning/03-requirements/acceptance-criteria.md` antes de implementar.
- Definir contrato API de alto nivel.
- Alinear estructura general con `05-learning/02-architecture/project-tree.md`.
- Alinear separación de responsabilidades con `05-learning/02-architecture/layer-responsibilities.md`.
- Aplicar el guardián de cambios de `05-learning/00-traceability/change-guardian.md` en cada cambio relevante.
- Mantener PostgreSQL, React, FastAPI, JWT y pytest + httpx según el stack oficial.

Si el track es QA:

- Diseñar plan de pruebas del SUT.
- Documentar casos por endpoint.
- Definir estrategia de evidencia.
- Mantener explícita la regla de no modificar `3-challenge/gestor-inventario/`.

Criterio de salida:

- Spec o plan de pruebas revisable.
- Riesgos documentados.
- No hay decisiones duplicadas ni stack alternativo en documentos secundarios.

### Fase 2 — Construcción o suite base verificable

Objetivo: producir el primer artefacto ejecutable del track elegido, cuando ya se apruebe pasar de planificación a ejecución.

Si el track es DEV:

- Construir backend, DB, auth, frontend e integración según stack oficial.
- Agregar pruebas API con pytest + httpx.
- No introducir SQLite ni frontend estático como alternativas al stack decidido.

Si el track es QA:

- Crear suite API contra el SUT.
- Cubrir contrato, happy paths e integridad de datos.
- Registrar evidencia reproducible.

Criterio de salida:

- Artefacto ejecutable.
- Comandos documentados.
- Evidencia registrada en `SOUL.md`.

### Fase 3 — Cobertura, riesgos y defectos

Objetivo: profundizar validación antes del cierre.

Si el track es DEV:

- Completar flujos principales.
- Validar seguridad básica de auth/JWT.
- Validar errores de integración SECOP.
- Mantener E2E fuera del compromiso base salvo nueva decisión aprobada.

Si el track es QA:

- Agregar negativos y edge cases.
- Validar escenario `ALERTS_FAIL=1`.
- Documentar defectos con severidad, repro y evidencia.

Criterio de salida:

- Riesgos principales cubiertos o documentados.
- Defectos o limitaciones descritos con evidencia.

### Fase 4 — Cierre y demo

Objetivo: preparar una entrega reproducible y explicable.

Checklist:

- Revisar `README.md`.
- Revisar `SOUL.md`.
- Ejecutar validaciones principales del track.
- Revisar checklist de `05-learning/01-planning/delivery-checklist.md`.
- Preparar demo de 5–7 minutos.

Criterio de salida:

- Entregables existen.
- Validaciones están documentadas.
- Riesgos y limitaciones están explícitos.

## 8. Checkpoint diario

El formato oficial está en `05-learning/01-planning/daily-checkpoints.md`.

Cada checkpoint debe contener, como mínimo:

1. Avance de hoy.
2. Bloqueos o riesgos.
3. Siguiente paso.
4. Bloque breve anexable a `SOUL.md`.

Regla: no inventar avances. Si falta evidencia, declararlo explícitamente.

## 9. Historial de limpieza documental

### Fusión de planes

Se fusionaron dos documentos previos: el plan día a día original y el plan con prefijo de fecha generado el 2026-07-01. Ambos fueron eliminados como archivos activos.

Resultado canónico:

- `05-learning/01-planning/canonical-ai-first-phase1-challenge-plan.md`

Motivo:

- Evitar dos planes con contenido solapado.
- Quitar priorización por fechas.
- Resolver contradicciones de stack a favor del documento oficial de stack.
- Centralizar decisiones y referencias cruzadas.

### Eliminaciones

Se eliminan los planes anteriores porque su contenido quedó consolidado aquí y contenían duplicados o contradicciones.

### Renombrados

- El plan canónico adopta nombre temático en kebab-case: `canonical-ai-first-phase1-challenge-plan.md`.
- Se elimina el patrón con prefijo de fecha para evitar mezclar convenciones.

### Referencias corregidas

- Las referencias genéricas sin ruta raíz se reemplazan por rutas completas como `05-learning/01-planning/...`.
- La estructura DEV se alinea con `05-learning/02-architecture/project-tree.md`.
- Los archivos referenciados `daily-checkpoints.md` y `delivery-checklist.md` se crean como documentos reales.

## 10. Regla de mantenimiento

Antes de agregar un nuevo documento de planificación:

- Crear un documento nuevo solo si no encaja en una fuente de verdad existente.
- Usar nombre en inglés, kebab-case y sin prefijo de fecha.
- Agregarlo a `05-learning/01-planning/governance.md` si introduce una nueva decisión normativa.
- Actualizar referencias cruzadas afectadas.
