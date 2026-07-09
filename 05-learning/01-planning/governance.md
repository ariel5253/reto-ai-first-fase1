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

## 9. Estrategia de ramas

### Regla general

No se usa una rama por HU. Se usa una rama por bloque funcional vertical.
Cada rama agrupa las HUs relacionadas y cubre backend + tests completos
antes de hacer merge a main. El frontend se construye en una rama propia
después de que el backend esté estable.

### Ramas definidas

| Rama | HUs que cubre | Contenido |
|---|---|---|
| `feat/auth` | HU-001, HU-002, HU-014 | Register, login JWT, aislamiento por usuario — backend + tests |
| `feat/opportunities` | HU-003, HU-004, HU-008 | Búsqueda, detalle, manejo de errores SECOP — backend + integración + tests |
| `feat/bookmarks` | HU-005, HU-006 | Guardar y listar favoritos — backend + tests |
| `feat/saved-searches` | HU-007 | Búsquedas guardadas — backend + tests |
| `feat/frontend` | HU-001 a HU-008, HU-014 | Toda la capa UI — construida después de que backend esté estable |
| `feat/readme` | HU-012 | Instrucciones de ejecución local — documentación final |

### Ciclo de vida de cada rama

1. Crear rama desde main actualizado
2. Hermes implementa en la rama — TDD: RED → GREEN por cada endpoint
3. Todos los tests pasan antes de merge
4. Ariel autoriza el merge a main
5. Hermes hace merge y elimina la rama remota
6. Hermes actualiza SOUL.md y change-log.md con el cierre del bloque

### Tipos de commit dentro de una rama

Una rama de dominio no es exclusiva de feat. Dentro de la misma rama
pueden coexistir commits de cualquier tipo convencional:

- feat(HU-###): nueva funcionalidad del bloque
- fix(HU-###): corrección dentro del mismo bloque
- test(HU-###): tests agregados o corregidos
- docs(HU-###): documentación del endpoint o flujo
- refactor(HU-###): limpieza sin cambio de comportamiento

El tipo describe qué cambió. La rama describe en qué dominio.
No se crea una rama nueva para un fix — el fix va en la rama del dominio
que lo originó.

### Nomenclatura

- Prefijo: `feat/`
- Nombre: describe el bloque funcional, no la HU individual
- Ejemplos válidos: `feat/auth`, `feat/bookmarks`, `feat/frontend`
- Ejemplos inválidos: `feat/HU-001`, `feature/registro`, `auth-branch`

### Orden de ejecución
