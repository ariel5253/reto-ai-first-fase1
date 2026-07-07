# Governance — Reto AI-First Fase 1

## 1. Propósito

Definir cómo se toman, aprueban y documentan decisiones del reto para mantener una sola fuente de verdad y evitar contradicciones entre planificación, arquitectura, stack y ejecución.

## 2. Roles

| Rol | Responsabilidad |
|---|---|
| Ariel | Decide alcance, track, stack, arquitectura y cambios relevantes. Aprueba o rechaza decisiones propuestas. |
| Hermes | Ejecuta cambios en el repo, actualiza documentos y verifica consistencia. No debe cambiar decisiones de stack/arquitectura sin aprobación explícita de Ariel. |
| Claude | Asesora, revisa y propone. No ejecuta cambios en el repo fuera de Hermes. Sus sugerencias deben pasar por Ariel antes de volverse decisión. |

Regla operativa: ningún cambio de repo fuera de Hermes se considera parte del flujo AI-first oficial del reto.

## 3. Proceso de aprobación de decisiones

Aplica a cambios de stack, arquitectura, estructura de carpetas, alcance funcional, estrategia de pruebas o herramienta principal.

1. Propuesta: Hermes o Claude puede proponer el cambio con motivo, impacto y riesgo.
2. Revisión: Ariel decide si se acepta, se rechaza o se aplaza.
3. Registro: Hermes documenta la decisión en la fuente de verdad correspondiente.
4. Propagación: Hermes actualiza referencias cruzadas para eliminar contradicciones.
5. Verificación: Hermes busca referencias obsoletas antes de cerrar la tarea.

Formato mínimo de decisión:

```markdown
## Decisión

**Tema:**
**Cambio aprobado:**
**Motivo:**
**Impacto:**
**Riesgos:**
**Aprobado por:** Ariel
**Fecha:** YYYY-MM-DD
**Fuente de verdad actualizada:**
```

## 4. Una sola fuente de verdad por decisión

| Tipo de decisión | Fuente de verdad |
|---|---|
| Stack tecnológico | `05-learning/01-planning/ai-first-challenge-tech-stack.md` |
| Gobierno y roles | `05-learning/01-planning/governance.md` |
| Plan operativo | `05-learning/01-planning/canonical-ai-first-phase1-challenge-plan.md` |
| Buenas prácticas | `05-learning/01-planning/ai-first-challenge-best-practices.md` |
| Reglas de commits | `05-learning/01-planning/conventional-commits.md` |
| Árbol de arquitectura | `05-learning/02-architecture/project-tree.md` |
| Checklist de entrega | `05-learning/01-planning/delivery-checklist.md` |
| Checkpoints diarios | `05-learning/01-planning/daily-checkpoints.md` |
| Guardián de cambios | `05-learning/00-traceability/change-guardian.md` |
| Trazabilidad técnica | `05-learning/00-traceability/change-log.md` |
| Requisitos y HU | `05-learning/03-requirements/user-stories.md` |
| Guía de implementación | `05-learning/04-code/README.md` |
| Bitácora de ejecución | `SOUL.md` |

Regla: los documentos secundarios pueden resumir, pero no redefinir, una decisión.

## 5. Guardián de cambios

Todo cambio relevante debe aplicar el guardián definido en `05-learning/00-traceability/change-guardian.md`.

Antes de cerrar una tarea, Hermes debe:

- Revisar impacto en database, backend, frontend, tests y documentación.
- Actualizar los archivos involucrados, no solo el archivo inicialmente solicitado.
- Registrar la trazabilidad técnica en `05-learning/00-traceability/change-log.md`.
- Actualizar `SOUL.md` solo si el cambio representa avance, decisión, bloqueo o evidencia relevante del reto.

Ejemplo: si cambia DB, se revisan backend y frontend; si cambia backend, se revisa contrato API y frontend; si cambia frontend, se revisa si el backend ya soporta el contrato esperado.

## 6. Política de nomenclatura

### Documentos Markdown de planificación

Usar nombres en inglés, kebab-case y sin prefijo de fecha:

```text
canonical-ai-first-phase1-challenge-plan.md
ai-first-challenge-tech-stack.md
ai-first-challenge-best-practices.md
governance.md
delivery-checklist.md
daily-checkpoints.md
```

No usar:

```text
2026-07-01_plan-dia-a-dia-reto-ai-first.md
plan-canonico-reto-ai-first-fase1.md
stack-tecnologico-reto-ai-first.md
buenas-practicas-reto-ai-first.md
checklist-entrega.md
PlanReto.md
plan_reto.md
```

### Carpetas

Usar kebab-case para carpetas documentales. La carpeta existente `05-learning/` conserva su nombre actual porque está fuera del alcance de esta limpieza.

### Referencias internas

Usar rutas completas relativas a la raíz del repo cuando el documento pueda leerse desde otro contexto:

```text
05-learning/01-planning/ai-first-challenge-tech-stack.md
05-learning/02-architecture/project-tree.md
```

Evitar referencias ambiguas como:

```text
planning/ai-first-challenge-tech-stack.md
```

## 7. Cambios fuera de política

Si una nueva decisión requiere romper esta política:

- Debe aprobarla Ariel explícitamente.
- Debe registrarse en este documento o en `SOUL.md`.
- Deben actualizarse todas las referencias afectadas.

## 8. Política de commits y push

Hermes no debe crear commits ni ejecutar push por iniciativa propia. Solo puede hacerlo cuando Ariel lo indique y autorice explícitamente para la tarea actual.

Cuando Ariel autorice commit/push, todo commit publicado durante el reto debe seguir `05-learning/01-planning/conventional-commits.md`.

Regla base:

```text
<type>(<scope>): <short description>
```

Para trabajo asociado a una Historia de Usuario, el scope debe ser la HU:

```text
feat(HU-003): add secop opportunity search client
```

Para cambios transversales sin HU específica, usar scopes definidos en la guía, por ejemplo `planning`, `architecture`, `requirements`, `traceability`, `repo` o `soul`.

No publicar commits con mensajes genéricos como `update`, `changes`, `fix stuff` o `wip`.
