-- Datos semilla mínimos para catálogos del modelo lógico.
-- No contiene datos de prueba de usuarios finales ni contraseñas de aplicación.

insert into opportunity_source (code, name, base_url)
values ('SECOP', 'datos.gov.co / SECOP', 'https://www.datos.gov.co')
on conflict (code) do nothing;

insert into opportunity_dataset (source_id, code, name, api_url)
select id,
       'SECOP_PUBLIC_OPPORTUNITIES',
       'SECOP public opportunities dataset',
       'https://www.datos.gov.co/resource/'
from opportunity_source
where code = 'SECOP'
on conflict (source_id, code) do nothing;

insert into opportunity_status (code, name)
values
  ('unknown', 'Unknown'),
  ('open', 'Open'),
  ('closed', 'Closed'),
  ('published', 'Published')
on conflict (code) do nothing;

insert into search_filter_key (code, name, value_type)
values
  ('keyword', 'Keyword', 'text'),
  ('entity', 'Contracting entity', 'text'),
  ('status', 'Opportunity status', 'text'),
  ('published_from', 'Published from', 'date'),
  ('published_to', 'Published to', 'date'),
  ('closing_from', 'Closing from', 'date'),
  ('closing_to', 'Closing to', 'date'),
  ('min_amount_cents', 'Minimum amount in cents', 'number'),
  ('max_amount_cents', 'Maximum amount in cents', 'number')
on conflict (code) do nothing;
