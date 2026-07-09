# Opportunities API contract

Fuente de verdad usada:

- `05-learning/04-code/integrations/SECOP II - Contratos Electrónicos.postman_collection.json`
- Consulta real de solo lectura: `https://www.datos.gov.co/resource/p6dx-8zbt.json?$limit=1`

## A. Contrato externo — SECOP → backend

### API base

```text
https://www.datos.gov.co
```

### Endpoint real de consulta

```http
GET /resource/p6dx-8zbt.json
```

URL completa:

```text
https://www.datos.gov.co/resource/p6dx-8zbt.json
```

No requiere autenticación según la colección Postman.

### Endpoints y consultas disponibles en la colección

| Nombre en colección | Método | Endpoint | Parámetros |
|---|---|---|---|
| Endpoint base | GET | `/resource/p6dx-8zbt.json` | `$limit` |
| Filtro por entidad | GET | `/resource/p6dx-8zbt.json` | `$limit`, `$where=upper(entidad) like '%TEXTO%'` |
| Filtro por fecha | GET | `/resource/p6dx-8zbt.json` | `$limit`, `$where=fecha_de_publicacion_del between 'YYYY-MM-DDT00:00:00' and 'YYYY-MM-DDT23:59:59'` |
| Filtro por estado | GET | `/resource/p6dx-8zbt.json` | `$limit`, `estado_del_procedimiento` |
| Paginación | GET | `/resource/p6dx-8zbt.json` | `$limit`, `$offset` |
| Contar estados disponibles | GET | `/resource/p6dx-8zbt.json` | `$select=estado_del_procedimiento,count(*)`, `$group=estado_del_procedimiento`, `$order=count(*) DESC`, `$limit`, `$offset` |
| Entidad + estado | GET | `/resource/p6dx-8zbt.json` | `$limit`, `$offset`, `$where=upper(entidad) like '%TEXTO%' AND estado_del_procedimiento='ESTADO'` |
| Entidad + fecha | GET | `/resource/p6dx-8zbt.json` | `$limit`, `$offset`, `$where=upper(entidad) like '%TEXTO%' AND fecha_de_publicacion_del between ...` |
| Estado + fecha | GET | `/resource/p6dx-8zbt.json` | `$limit`, `$offset`, `estado_del_procedimiento`, `$where=fecha_de_publicacion_del between ...` |
| Entidad + estado + fecha | GET | `/resource/p6dx-8zbt.json` | `$limit`, `$offset`, `$where=upper(entidad) like '%TEXTO%' AND estado_del_procedimiento='ESTADO' AND fecha_de_publicacion_del between ...` |

### Parámetros externos disponibles

| Parámetro externo | Uso |
|---|---|
| `$limit` | Tamaño de página |
| `$offset` | Desplazamiento para paginación |
| `$where` | Filtros combinados con SoQL |
| `$select` | Selección/agregación de columnas |
| `$group` | Agrupación para agregaciones |
| `$order` | Ordenamiento |
| `estado_del_procedimiento` | Filtro exacto por estado |
| `entidad` dentro de `$where` | Filtro textual por entidad con `upper(entidad) like '%TEXTO%'` |
| `fecha_de_publicacion_del` dentro de `$where` | Filtro por rango de fecha de publicación |

### Estructura real de respuesta observada

La API retorna un arreglo JSON. Cada elemento contiene campos como:

```json
{
  "entidad": "DEPARTAMENTO ADMINISTRATIVO NACIONAL DE ESTADISTICA (DANE)",
  "nit_entidad": "899999027",
  "departamento_entidad": "Distrito Capital de Bogotá",
  "ciudad_entidad": "Bogotá",
  "ordenentidad": "Nacional",
  "codigo_pci": "Centralizada",
  "id_del_proceso": "CO1.REQ.2577563",
  "referencia_del_proceso": "EDP-545-2022",
  "ppi": "700474109",
  "id_del_portafolio": "CO1.BDOS.2503732",
  "nombre_del_procedimiento": "TS_MERCADO_2022_GEIH_TH Prestación de servicios profesionales para procesar la información de la GEIH para el análisis de resultados y generación de nuevos indicadores de migración laboral y series de",
  "descripci_n_del_procedimiento": "TS_MERCADO_2022_GEIH_TH Prestación de servicios profesionales para procesar la información de la GEIH para el análisis de resultados y generación de nuevos indicadores de migración laboral y series de mercado laboral desestacionalizadas.",
  "fase": "Presentación de oferta",
  "fecha_de_publicacion_del": "2022-01-18T00:00:00.000",
  "fecha_de_ultima_publicaci": "2022-01-18T00:00:00.000",
  "fecha_de_publicacion_fase_3": "2022-01-18T00:00:00.000",
  "precio_base": "57333333",
  "modalidad_de_contratacion": "Contratación directa",
  "justificaci_n_modalidad_de": "Servicios profesionales y apoyo a la gestión",
  "duracion": "344",
  "unidad_de_duracion": "día(s)",
  "ciudad_de_la_unidad_de": "Bogotá",
  "nombre_de_la_unidad_de": "SECRETARIA GENERAL - DANE CENTRAL",
  "proveedores_invitados": "0",
  "proveedores_con_invitacion": "0",
  "visualizaciones_del": "0",
  "proveedores_que_manifestaron": "0",
  "respuestas_al_procedimiento": "0",
  "respuestas_externas": "0",
  "conteo_de_respuestas_a_ofertas": "0",
  "proveedores_unicos_con": "0",
  "numero_de_lotes": "0",
  "estado_del_procedimiento": "Seleccionado",
  "id_estado_del_procedimiento": "70",
  "adjudicado": "No",
  "id_adjudicacion": "No Adjudicado",
  "codigoproveedor": "No Definido",
  "departamento_proveedor": "No Definido",
  "ciudad_proveedor": "No Definido",
  "valor_total_adjudicacion": "0",
  "nombre_del_adjudicador": "No Adjudicado",
  "nombre_del_proveedor": "No Definido",
  "nit_del_proveedor_adjudicado": "No Definido",
  "codigo_principal_de_categoria": "V1.80111500",
  "estado_de_apertura_del_proceso": "Abierto",
  "tipo_de_contrato": "Prestación de servicios",
  "subtipo_de_contrato": "No Definido",
  "categorias_adicionales": "No definido",
  "urlproceso": {
    "url": "https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=CO1.NTC.2597221"
  },
  "codigo_entidad": "700474109",
  "estado_resumen": "Presentación de oferta"
}
```

### Campos SECOP que se van a normalizar

| Campo SECOP | Uso backend |
|---|---|
| `id_del_proceso` | Identificador externo principal de oportunidad |
| `referencia_del_proceso` | Identificador/referencia externa complementaria |
| `entidad` | Nombre de entidad contratante |
| `nit_entidad` | Identificador externo de entidad cuando aplique |
| `codigo_entidad` | Identificador/código de entidad cuando aplique |
| `estado_del_procedimiento` | Estado normalizado de oportunidad |
| `nombre_del_procedimiento` | Título |
| `descripci_n_del_procedimiento` | Descripción |
| `precio_base` | Monto estimado en pesos COP, convertido a centavos |
| `fecha_de_publicacion_del` | Fecha de publicación |
| `urlproceso.url` | URL de detalle externo |
| `estado_resumen` | Campo informativo de detalle si se requiere en respuesta extendida |
| `fase` | Campo informativo de detalle si se requiere en respuesta extendida |
| `modalidad_de_contratacion` | Campo informativo de detalle si se requiere en respuesta extendida |
| `tipo_de_contrato` | Campo informativo de detalle si se requiere en respuesta extendida |

### Campos descartados inicialmente

Se descartan del modelo normalizado base porque no son necesarios para búsqueda, detalle básico, bookmarks o trazabilidad mínima:

- `departamento_entidad`
- `ciudad_entidad`
- `ordenentidad`
- `codigo_pci`
- `ppi`
- `id_del_portafolio`
- `fecha_de_ultima_publicaci`
- `fecha_de_publicacion_fase_3`
- `justificaci_n_modalidad_de`
- `duracion`
- `unidad_de_duracion`
- `ciudad_de_la_unidad_de`
- `nombre_de_la_unidad_de`
- métricas de proveedores/respuestas/visualizaciones
- campos de adjudicación/proveedor
- `codigo_principal_de_categoria`
- `estado_de_apertura_del_proceso`
- `subtipo_de_contrato`
- `categorias_adicionales`

Estos campos pueden añadirse después si una HU de detalle los exige explícitamente.

## B. Contrato interno — backend → frontend

El backend expone rutas propias y normaliza la respuesta externa para no acoplar el frontend a SECOP/datos.gov.co.

### GET /api/v1/opportunities

Parámetros:

| Parámetro | Tipo | Reglas |
|---|---|---|
| `query` | string opcional | Texto libre; se aplicará sobre título/descripción cuando se implemente el cliente SECOP |
| `entity` | string opcional | Se traduce a filtro SECOP `upper(entidad) like '%ENTITY%'` |
| `status` | string opcional | Se traduce a `estado_del_procedimiento` o condición equivalente en `$where` |
| `page` | int opcional | Default 1; se convierte a `$offset=(page - 1) * limit` |
| `limit` | int opcional | Default 10; se traduce a `$limit` |

Response 200:

```json
{
  "items": [
    {
      "id": 1,
      "title": "string",
      "entity_name": "string",
      "status": "string | null",
      "estimated_amount_cents": 5733333300,
      "published_at": "2022-01-18T00:00:00.000",
      "closing_at": null,
      "detail_url": "https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=..."
    }
  ],
  "total": 1
}
```

Errores:

- 503: SECOP/datos.gov.co no responde o retorna una respuesta no utilizable.

### GET /api/v1/opportunities/{id}

Response 200:

```json
{
  "id": 1,
  "title": "string",
  "description": "string | null",
  "entity_name": "string",
  "status": "string | null",
  "estimated_amount_cents": 5733333300,
  "published_at": "2022-01-18T00:00:00.000",
  "closing_at": null,
  "detail_url": "https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=...",
  "external_id": "CO1.REQ.2577563",
  "external_process_id": "EDP-545-2022",
  "source": "SECOP"
}
```

Errores:

- 404: no existe una oportunidad con ese `id` local.
- 503: falla la fuente externa cuando el detalle requiere consultar SECOP/datos.gov.co.

## C. Reglas de normalización

### Mapeo SECOP → DB

| SECOP | Tabla/campo DB | Regla |
|---|---|---|
| constante `SECOP` | `opportunity_source.code` | Crear/usar fuente SECOP |
| endpoint `p6dx-8zbt` | `opportunity_dataset.code` | Crear/usar dataset `SECOP_II_CONTRATOS_ELECTRONICOS` |
| `entidad` | `contracting_entity.name` | Requerido si la oportunidad se persiste |
| `lower/unaccent(entidad)` aproximado | `contracting_entity.normalized_name` | Normalizar para unicidad interna |
| `nit_entidad` o `codigo_entidad` | `contracting_entity.external_id` | Usar el identificador disponible más estable |
| `id_del_proceso` | `public_opportunity.external_id` | Requerido; clave externa de oportunidad |
| `referencia_del_proceso` | `public_opportunity.external_process_id` | Opcional |
| `estado_del_procedimiento` | `opportunity_status.code/name` y `public_opportunity.status_id` | Normalizar estado; crear catálogo si no existe |
| `nombre_del_procedimiento` | `public_opportunity.title` | Requerido; descartar registros sin título útil |
| `descripci_n_del_procedimiento` | `public_opportunity.description` | Opcional |
| `precio_base` | `public_opportunity.estimated_amount_cents` | Convertir pesos COP a centavos: `int(precio_base) * 100` |
| `fecha_de_publicacion_del` | `public_opportunity.published_at` | Parsear como timestamp; si no parsea, dejar null |
| sin campo confiable en muestra | `public_opportunity.closing_at` | Dejar null hasta identificar campo real de cierre |
| `urlproceso.url` | `public_opportunity.detail_url` | Opcional |
| momento de sincronización | `public_opportunity.source_synced_at` | `now()` al persistir |
| momento de observación | `public_opportunity.source_last_seen_at` | `now()` cuando se observa en SECOP |

### Montos

- `precio_base` llega como string numérico en pesos COP.
- Si viene presente y es entero válido: `estimated_amount_cents = int(precio_base) * 100`.
- Si viene ausente, vacío, `No Definido` o no numérico: `estimated_amount_cents = null`.
- No se persisten montos negativos; el schema DB exige `estimated_amount_cents >= 0` cuando no es null.

### Fechas

- `fecha_de_publicacion_del` llega como string ISO sin zona, por ejemplo `2022-01-18T00:00:00.000`.
- El backend debe parsear a `timestamptz` antes de persistir o serializar a ISO 8601 en respuesta.
- Si el campo viene ausente o no parseable: usar `null` y no bloquear toda la búsqueda.
- `closing_at` queda `null` hasta confirmar un campo SECOP estable de cierre en la fuente real.

### Nulos y ausentes

- El cliente SECOP debe tratar todos los campos externos como opcionales salvo `id_del_proceso` y `nombre_del_procedimiento` para persistencia local.
- Registros sin `id_del_proceso` no se persisten porque no hay clave externa confiable.
- Registros sin `nombre_del_procedimiento` no se persisten porque el schema exige `title not null`.
- Campos textuales faltantes se devuelven como `null` o string vacío solo si el contrato interno lo permite; preferencia: `null`.
- Campos anidados como `urlproceso.url` deben leerse defensivamente; si `urlproceso` no es objeto o no trae `url`, `detail_url = null`.

### Errores de integración

- Timeout, error de red, status HTTP externo no exitoso o JSON inválido se traducen a 503 en el backend.
- El frontend nunca consume directamente `datos.gov.co`; solo consume `/api/v1/opportunities` y `/api/v1/opportunities/{id}`.
