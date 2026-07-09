-- Datos sintéticos DEV para validar relaciones y consultas desde la base de datos.
-- Regla obligatoria: estos datos viven únicamente en la capa DB.
-- Prohibido duplicar estos datos en backend, frontend, tests de aplicación o código fuente.
-- Uso esperado: carga local con psql después de 01-schema.sql y 02-seed-catalogs.sql.

insert into app_user (email, password_hash, full_name)
values
  (
    'demo.user@example.test',
    'synthetic-password-hash-not-for-login-001',
    'Demo User'
  ),
  (
    'reviewer@example.test',
    'synthetic-password-hash-not-for-login-002',
    'Architecture Reviewer'
  )
on conflict (email) do update
set full_name = excluded.full_name,
    updated_at = now();

insert into contracting_entity (source_id, external_id, name, normalized_name)
select source.id, entity.external_id, entity.name, entity.normalized_name
from opportunity_source source
cross join (
  values
    ('ENT-BOG-001', 'Alcaldía Mayor de Bogotá D.C.', 'alcaldia mayor de bogota dc'),
    ('ENT-ANT-001', 'Gobernación de Antioquia', 'gobernacion de antioquia'),
    ('ENT-MIN-001', 'Ministerio de Tecnologías de la Información y las Comunicaciones', 'ministerio de tecnologias de la informacion y las comunicaciones')
) as entity(external_id, name, normalized_name)
where source.code = 'SECOP'
on conflict (source_id, external_id) do update
set name = excluded.name,
    normalized_name = excluded.normalized_name,
    updated_at = now();

insert into public_opportunity (
    dataset_id,
    external_id,
    external_process_id,
    entity_id,
    status_id,
    title,
    description,
    estimated_amount_cents,
    published_at,
    closing_at,
    detail_url,
    source_synced_at,
    source_last_seen_at
)
select
    dataset.id,
    opportunity.external_id,
    opportunity.external_process_id,
    entity.id,
    status.id,
    opportunity.title,
    opportunity.description,
    opportunity.estimated_amount_cents,
    opportunity.published_at::timestamptz,
    opportunity.closing_at::timestamptz,
    opportunity.detail_url,
    now(),
    now()
from opportunity_dataset dataset
join opportunity_source source on source.id = dataset.source_id
join (
  values
    (
      'SYN-SECOP-2026-001',
      'PROC-SYN-001',
      'ENT-BOG-001',
      'open',
      'Servicio sintético de mantenimiento de plataforma ciudadana',
      'Registro sintético para validar búsqueda, detalle y bookmark en entorno DEV.',
      15000000000::bigint,
      '2026-07-01 09:00:00+00',
      '2026-07-30 23:59:59+00',
      'https://www.datos.gov.co/resource/synthetic-001'
    ),
    (
      'SYN-SECOP-2026-002',
      'PROC-SYN-002',
      'ENT-ANT-001',
      'published',
      'Suministro sintético de equipos para modernización tecnológica',
      'Registro sintético para validar filtros por entidad, estado y monto.',
      8750000000::bigint,
      '2026-07-03 08:30:00+00',
      '2026-08-05 18:00:00+00',
      'https://www.datos.gov.co/resource/synthetic-002'
    ),
    (
      'SYN-SECOP-2026-003',
      'PROC-SYN-003',
      'ENT-MIN-001',
      'closed',
      'Consultoría sintética para arquitectura de datos públicos',
      'Registro sintético para validar oportunidades cerradas y trazabilidad SECOP.',
      4200000000::bigint,
      '2026-06-10 10:00:00+00',
      '2026-06-28 17:00:00+00',
      'https://www.datos.gov.co/resource/synthetic-003'
    )
) as opportunity(
    external_id,
    external_process_id,
    entity_external_id,
    status_code,
    title,
    description,
    estimated_amount_cents,
    published_at,
    closing_at,
    detail_url
) on true
join contracting_entity entity
  on entity.source_id = source.id
 and entity.external_id = opportunity.entity_external_id
join opportunity_status status
  on status.code = opportunity.status_code
where source.code = 'SECOP'
  and dataset.code = 'SECOP_PUBLIC_OPPORTUNITIES'
on conflict (dataset_id, external_id) do update
set external_process_id = excluded.external_process_id,
    entity_id = excluded.entity_id,
    status_id = excluded.status_id,
    title = excluded.title,
    description = excluded.description,
    estimated_amount_cents = excluded.estimated_amount_cents,
    published_at = excluded.published_at,
    closing_at = excluded.closing_at,
    detail_url = excluded.detail_url,
    source_synced_at = now(),
    source_last_seen_at = now(),
    updated_at = now();

insert into bookmark (user_id, opportunity_id, notes)
select app_user.id, public_opportunity.id, bookmark_seed.notes
from app_user
join (
  values
    ('demo.user@example.test', 'SYN-SECOP-2026-001', 'Synthetic bookmark for DEV validation.'),
    ('demo.user@example.test', 'SYN-SECOP-2026-002', 'Synthetic opportunity with technology-related scope.'),
    ('reviewer@example.test', 'SYN-SECOP-2026-003', 'Synthetic closed opportunity for reviewer checks.')
) as bookmark_seed(email, external_id, notes)
  on bookmark_seed.email = app_user.email
join public_opportunity
  on public_opportunity.external_id = bookmark_seed.external_id
on conflict (user_id, opportunity_id) do update
set notes = excluded.notes;

insert into saved_search (user_id, name)
select app_user.id, saved_search_seed.name
from app_user
join (
  values
    ('demo.user@example.test', 'Open technology opportunities'),
    ('reviewer@example.test', 'Architecture review opportunities')
) as saved_search_seed(email, name)
  on saved_search_seed.email = app_user.email
on conflict (user_id, name) do update
set updated_at = now();

insert into saved_search_filter_value (saved_search_id, filter_key_id, filter_value, value_order)
select saved_search.id, search_filter_key.id, filter_seed.filter_value, filter_seed.value_order
from saved_search
join app_user on app_user.id = saved_search.user_id
join (
  values
    ('demo.user@example.test', 'Open technology opportunities', 'keyword', 'tecnología', 1),
    ('demo.user@example.test', 'Open technology opportunities', 'status', 'open', 1),
    ('demo.user@example.test', 'Open technology opportunities', 'status', 'published', 2),
    ('reviewer@example.test', 'Architecture review opportunities', 'keyword', 'arquitectura', 1),
    ('reviewer@example.test', 'Architecture review opportunities', 'min_amount_cents', '1000000000', 1)
) as filter_seed(email, search_name, filter_code, filter_value, value_order)
  on filter_seed.email = app_user.email
 and filter_seed.search_name = saved_search.name
join search_filter_key
  on search_filter_key.code = filter_seed.filter_code
on conflict (saved_search_id, filter_key_id, filter_value) do update
set value_order = excluded.value_order;
