# Skills en Hermes: cómo guardarlas con su descripción de uso

Una skill es una instrucción reutilizable para que Hermes recuerde un procedimiento, criterio o flujo de trabajo. No sirve para guardar avances temporales; para eso se usa `SOUL.md` o el historial de sesión.

## Cuándo guardar una skill

Guarda una skill cuando:

- El flujo se va a repetir en futuras sesiones.
- La tarea tuvo 5+ pasos o varias herramientas.
- Se resolvió un error no obvio y conviene no redescubrirlo.
- El usuario corrigió una forma de trabajo y esa corrección debe persistir.
- Hay un checklist, comando o formato que Hermes debe reutilizar.

No guardes una skill para:

- Estado temporal del reto.
- PRs, commits, issues o resultados puntuales.
- Datos que quedarán obsoletos en pocos días.
- Preferencias personales simples; eso va en memoria.

## Formato recomendado

Cada skill debe tener frontmatter YAML y una descripción clara de uso:

```markdown
---
name: nombre-de-la-skill
description: "Use when <situación concreta>. <qué comportamiento activa>."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [tag1, tag2]
    related_skills: []
---

# Nombre de la Skill

## Overview
Qué resuelve esta skill y por qué existe.

## When to Use
- Cuándo cargarla.
- Qué señales indican que aplica.
- Cuándo NO usarla.

## Workflow
1. Paso accionable.
2. Comando, archivo o verificación concreta.
3. Criterio de finalización.

## Common Pitfalls
- Errores frecuentes.
- Cómo evitarlos.

## Verification Checklist
- [ ] Resultado verificable.
- [ ] Archivos/outputs revisados.
- [ ] Pruebas o validación ejecutadas.
```

## Regla clave para la descripción

La descripción debe responder: “¿cuándo debe Hermes cargar esta skill?”.

Buenos ejemplos:

- `Use when creating or maintaining QA deliverables for the AI-First challenge. Defines the required files, test strategy, evidence, and final verification checklist.`
- `Use when debugging FastAPI API failures. Enforces root-cause analysis, endpoint reproduction, log inspection, and regression tests before patching.`
- `Use when writing SOUL.md updates for the AI-First challenge. Keeps entries concise in Advance, Blockers, Next Step format.`

Malos ejemplos:

- `QA skill`
- `Ayuda con pruebas`
- `Instrucciones importantes`
- `Usar siempre`

## Cómo pedirle a Hermes que la guarde

Puedes decir:

```text
Guarda este flujo como skill llamada ai-first-qa-checkpoint.
Debe usarse cuando actualicemos entregables QA del reto.
Incluye checklist, comandos de verificación y formato de salida.
```

Hermes debería crearla con `skill_manage(action='create')` si es una skill personal, o escribir un archivo de definición de skill en el repo si estás construyendo skills versionadas.

## Ubicación normal

Skills personales de Hermes:

```text
~/.hermes/skills/<categoria>/<nombre>/SKILL.md
```

Skills versionadas dentro de un repositorio:

```text
skills/<categoria>/<nombre>/SKILL.md
```

## Checklist antes de guardar

- [ ] El nombre está en minúsculas y con guiones: `ai-first-qa-checkpoint`.
- [ ] Los nombres de archivos nuevos o modificados están en inglés y en kebab-case cuando aplique.
- [ ] La descripción empieza con `Use when ...`.
- [ ] La descripción explica el disparador de uso, no solo el tema.
- [ ] El cuerpo tiene pasos concretos, no consejos genéricos.
- [ ] Incluye errores frecuentes y verificación.
- [ ] No guarda estado temporal ni resultados que caducan.

## Skills para usar en el reto

Estas son las skills relevantes para el Reto AI-First Fase 1. Las demás se omiten porque no aportan directamente a la preparación, desarrollo, QA, documentación o entrega del reto.

Estado de instalación: verificadas en Hermes como skills disponibles e instaladas. No requieren instalación adicional porque vienen como skills `builtin` y están habilitadas.

| Skill name | Descripción |
|---|---|
| `hermes-agent` | Configure, extend, or contribute to Hermes Agent. Útil para configurar Hermes, herramientas, modelos, perfiles y flujos AI-first del reto. |
| `plan` | Plan mode: write an actionable markdown plan to .hermes/plans/, no execution. Útil para partir el reto en tareas pequeñas antes de ejecutar. |
| `test-driven-development` | TDD: enforce RED-GREEN-REFACTOR, tests before code. Útil para el track DEV y para crear pruebas antes de implementar cambios. |
| `systematic-debugging` | 4-phase root cause debugging: understand bugs before fixing. Útil para diagnosticar fallos del backend, frontend, pruebas o entorno. |
| `dogfood` | Exploratory QA of web apps: find bugs, evidence, reports. Útil para el track QA, pruebas exploratorias, evidencia y reporte de defectos. |
| `requesting-code-review` | Pre-commit review: security scan, quality gates, auto-fix. Útil antes de cerrar entregables, revisar calidad y detectar riesgos. |
| `github-pr-workflow` | GitHub PR lifecycle: branch, commit, open, CI, merge. Útil si el reto se entrega mediante ramas, commits, PRs o revisión en GitHub. |
| `github-code-review` | Review PRs: diffs, inline comments via gh or REST. Útil para revisar cambios del reto antes de la entrega final. |
| `codebase-inspection` | Inspect codebases w/ pygount: LOC, languages, ratios. Útil para entender rápidamente la estructura del SUT o del proyecto DEV. |
| `python-debugpy` | Debug Python: pdb REPL + debugpy remote (DAP). Útil si se necesita depurar FastAPI, pytest o scripts Python del reto. |
| `node-inspect-debugger` | Debug Node.js via --inspect + Chrome DevTools Protocol CLI. Útil solo si el track DEV usa Node.js o requiere depurar frontend/backend JS. |
| `hermes-agent-skill-authoring` | Author in-repo SKILL.md: frontmatter, validator, structure, and writing-quality principles. Útil si durante el reto se crean o ajustan skills reutilizables. |
