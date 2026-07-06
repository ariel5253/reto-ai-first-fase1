-- Modelo lógico PostgreSQL de referencia — Portal de Convocatorias Públicas
-- Normalización: 3NF, sin excepción de desnormalización en esta versión.
-- Este archivo valida el diseño lógico; las migraciones ejecutables pueden derivarse de aquí.

create table app_user (
    id bigint generated always as identity primary key,
    email varchar(320) not null,
    password_hash text not null,
    full_name varchar(160),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint uq_app_user_email unique (email),
    constraint ck_app_user_email_lowercase check (email = lower(email)),
    constraint ck_app_user_password_hash_length check (char_length(password_hash) >= 20)
);

create table opportunity_source (
    id bigint generated always as identity primary key,
    code varchar(50) not null,
    name varchar(160) not null,
    base_url text,
    created_at timestamptz not null default now(),
    constraint uq_opportunity_source_code unique (code),
    constraint ck_opportunity_source_code_not_blank check (btrim(code) <> ''),
    constraint ck_opportunity_source_name_not_blank check (btrim(name) <> '')
);

create table contracting_entity (
    id bigint generated always as identity primary key,
    source_id bigint not null,
    external_id varchar(120),
    name varchar(260) not null,
    normalized_name varchar(260) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_contracting_entity_source
        foreign key (source_id) references opportunity_source(id)
        on update cascade on delete restrict,
    constraint uq_contracting_entity_source_external unique (source_id, external_id),
    constraint uq_contracting_entity_source_normalized unique (source_id, normalized_name),
    constraint ck_contracting_entity_name_not_blank check (btrim(name) <> ''),
    constraint ck_contracting_entity_normalized_name_not_blank check (btrim(normalized_name) <> '')
);

create table opportunity_status (
    id bigint generated always as identity primary key,
    code varchar(50) not null,
    name varchar(120) not null,
    created_at timestamptz not null default now(),
    constraint uq_opportunity_status_code unique (code),
    constraint ck_opportunity_status_code_not_blank check (btrim(code) <> ''),
    constraint ck_opportunity_status_name_not_blank check (btrim(name) <> '')
);

create table public_opportunity (
    id bigint generated always as identity primary key,
    source_id bigint not null,
    external_id varchar(160) not null,
    entity_id bigint not null,
    status_id bigint,
    title text not null,
    description text,
    estimated_amount_cents bigint,
    published_at date,
    closing_at date,
    detail_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_public_opportunity_source
        foreign key (source_id) references opportunity_source(id)
        on update cascade on delete restrict,
    constraint fk_public_opportunity_entity
        foreign key (entity_id) references contracting_entity(id)
        on update cascade on delete restrict,
    constraint fk_public_opportunity_status
        foreign key (status_id) references opportunity_status(id)
        on update cascade on delete restrict,
    constraint uq_public_opportunity_source_external unique (source_id, external_id),
    constraint ck_public_opportunity_external_id_not_blank check (btrim(external_id) <> ''),
    constraint ck_public_opportunity_title_not_blank check (btrim(title) <> ''),
    constraint ck_public_opportunity_amount_non_negative check (
        estimated_amount_cents is null or estimated_amount_cents >= 0
    ),
    constraint ck_public_opportunity_dates_order check (
        closing_at is null or published_at is null or closing_at >= published_at
    )
);

create table bookmark (
    id bigint generated always as identity primary key,
    user_id bigint not null,
    opportunity_id bigint not null,
    notes text,
    created_at timestamptz not null default now(),
    constraint fk_bookmark_user
        foreign key (user_id) references app_user(id)
        on update cascade on delete cascade,
    constraint fk_bookmark_opportunity
        foreign key (opportunity_id) references public_opportunity(id)
        on update cascade on delete restrict,
    constraint uq_bookmark_user_opportunity unique (user_id, opportunity_id)
);

create table saved_search (
    id bigint generated always as identity primary key,
    user_id bigint not null,
    name varchar(120) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_saved_search_user
        foreign key (user_id) references app_user(id)
        on update cascade on delete cascade,
    constraint uq_saved_search_user_name unique (user_id, name),
    constraint ck_saved_search_name_not_blank check (btrim(name) <> '')
);

create table search_filter_key (
    id bigint generated always as identity primary key,
    code varchar(60) not null,
    name varchar(120) not null,
    value_type varchar(30) not null,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    constraint uq_search_filter_key_code unique (code),
    constraint ck_search_filter_key_code_not_blank check (btrim(code) <> ''),
    constraint ck_search_filter_key_name_not_blank check (btrim(name) <> ''),
    constraint ck_search_filter_key_value_type check (
        value_type in ('text', 'date', 'number', 'boolean')
    )
);

create table saved_search_filter_value (
    id bigint generated always as identity primary key,
    saved_search_id bigint not null,
    filter_key_id bigint not null,
    filter_value text not null,
    created_at timestamptz not null default now(),
    constraint fk_saved_search_filter_value_saved_search
        foreign key (saved_search_id) references saved_search(id)
        on update cascade on delete cascade,
    constraint fk_saved_search_filter_value_filter_key
        foreign key (filter_key_id) references search_filter_key(id)
        on update cascade on delete restrict,
    constraint uq_saved_search_filter_value_search_key unique (saved_search_id, filter_key_id),
    constraint ck_saved_search_filter_value_value_not_blank check (btrim(filter_value) <> '')
);

create index idx_app_user_email on app_user (email);
create index idx_public_opportunity_entity_id on public_opportunity (entity_id);
create index idx_public_opportunity_status_id on public_opportunity (status_id);
create index idx_public_opportunity_published_at on public_opportunity (published_at);
create index idx_bookmark_user_id on bookmark (user_id);
create index idx_saved_search_user_id on saved_search (user_id);
create index idx_saved_search_filter_value_saved_search_id on saved_search_filter_value (saved_search_id);
