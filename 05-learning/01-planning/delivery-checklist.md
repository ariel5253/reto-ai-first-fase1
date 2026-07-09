# Checklist de entrega — Reto AI-First Fase 1

## Propósito

Checklist único para validar la entrega final del track elegido. Este archivo no define stack ni arquitectura; solo verifica que los entregables estén completos y respaldados por evidencia.

## Común a cualquier track

- [ ] `SOUL.md` existe y contiene decisiones, avances, bloqueos y evidencia.
- [ ] `README.md` explica cómo ejecutar y validar la entrega.
- [ ] El repo no contiene secretos, tokens ni credenciales.
- [ ] Los comandos principales de validación fueron ejecutados y documentados.
- [ ] La demo de 5–7 minutos tiene guion y flujo reproducible.
- [ ] Los riesgos o limitaciones están documentados honestamente.
- [ ] El guardián de cambios fue aplicado según `05-learning/00-traceability/change-guardian.md`.
- [ ] `05-learning/00-traceability/change-log.md` contiene trazabilidad de los cambios relevantes.
- [ ] `git status --short` fue revisado antes de entregar.

## Track DEV

- [ ] Backend FastAPI/Python funcional.
- [ ] PostgreSQL configurado como base de datos del producto.
- [ ] Autenticación JWT implementada.
- [ ] Frontend React funcional.
- [ ] Integración backend hacia datos.gov.co / SECOP documentada y validada.
- [ ] Tests API con pytest + httpx ejecutables.
- [ ] E2E se mantiene fuera de alcance salvo nueva decisión explícita aprobada.
- [ ] Arquitectura alineada con `05-learning/02-architecture/project-tree.md`.
- [ ] Responsabilidades por capa alineadas con `05-learning/02-architecture/layer-responsibilities.md`.
- [ ] Base de datos normalizada al menos a 3NF o excepción documentada.
- [ ] Seeds y datos de prueba persistentes están en `06-code/db/`, no en backend ni frontend.
- [ ] Los datos sintéticos DEV deben cargarse exclusivamente desde scripts SQL de la capa DB; está prohibido hardcodearlos en backend, frontend o tests de aplicación.
- [ ] Frontend no contiene reglas de negocio críticas ni consume SECOP directamente.

## Track QA

- [ ] Plan de pruebas completo.
- [ ] Casos de prueba documentados.
- [ ] Suite API ejecutable con pytest + httpx.
- [ ] Validación de contrato API cubierta.
- [ ] Validación de integridad de datos cubierta.
- [ ] Escenario `ALERTS_FAIL=1` cubierto.
- [ ] Defect report con severidad, pasos de reproducción y evidencia.
- [ ] SUT `3-challenge/gestor-inventario/` no fue modificado.

## Cierre

Antes de declarar listo, anexar un checkpoint final usando `05-learning/01-planning/daily-checkpoints.md`.
