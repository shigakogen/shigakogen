-- =============================================================
-- Portfolio blog — initial schema
-- Chạy: supabase db reset (local) hoặc supabase db push (remote)
-- =============================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- -------------------------------------------------------------
-- Admin allowlist
-- -------------------------------------------------------------
create table public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

comment on table public.admins is 'Email được phép ghi. Seed email của bạn vào đây.';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- -------------------------------------------------------------
-- Enum
-- -------------------------------------------------------------
create type public.content_status as enum ('draft', 'published');
create type public.reaction_type as enum ('like', 'insightful');

-- -------------------------------------------------------------
-- updated_at trigger
-- -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- -------------------------------------------------------------
-- posts
-- -------------------------------------------------------------
create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  summary         text not null default '',
  content         text not null default '',
  cover_image     text,
  tags            text[] not null default '{}',
  status          public.content_status not null default 'draft',
  reading_minutes int not null default 1,
  view_count      int not null default 0,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  search_vector   tsvector generated always as (
      setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A')
   || setweight(to_tsvector('english'::regconfig, coalesce(summary, '')), 'B')
   || setweight(to_tsvector('english'::regconfig, coalesce(content, '')), 'C')
  ) stored,
  constraint slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint published_needs_date check (status <> 'published' or published_at is not null)
);

create index posts_search_idx      on public.posts using gin (search_vector);
create index posts_tags_idx        on public.posts using gin (tags);
create index posts_published_idx   on public.posts (published_at desc) where status = 'published';
create index posts_title_trgm_idx  on public.posts using gin (title gin_trgm_ops);

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------
-- projects
-- -------------------------------------------------------------
create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  summary      text not null default '',
  content      text not null default '',
  cover_image  text,
  tech         text[] not null default '{}',
  repo_url     text,
  live_url     text,
  featured     boolean not null default false,
  sort_order   int not null default 0,
  status       public.content_status not null default 'draft',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index projects_sort_idx on public.projects (sort_order asc, created_at desc);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------
-- post_views  (chống đếm trùng: 1 fingerprint / 1 bài / 1 ngày)
-- -------------------------------------------------------------
create table public.post_views (
  id          bigserial primary key,
  post_id     uuid not null references public.posts(id) on delete cascade,
  fingerprint text not null,
  viewed_on   date not null default current_date,
  created_at  timestamptz not null default now(),
  unique (post_id, fingerprint, viewed_on)
);

create index post_views_post_idx on public.post_views (post_id);

-- -------------------------------------------------------------
-- reactions
-- -------------------------------------------------------------
create table public.reactions (
  id          bigserial primary key,
  post_id     uuid not null references public.posts(id) on delete cascade,
  fingerprint text not null,
  type        public.reaction_type not null,
  created_at  timestamptz not null default now(),
  unique (post_id, fingerprint, type)
);

create index reactions_post_idx on public.reactions (post_id, type);

-- -------------------------------------------------------------
-- subscribers (double opt-in)
-- -------------------------------------------------------------
create table public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  confirm_token uuid not null default gen_random_uuid(),
  confirmed_at  timestamptz,
  created_at    timestamptz not null default now(),
  constraint email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

-- =============================================================
-- RPC: tăng view, trả về tổng view hiện tại
-- =============================================================
create or replace function public.increment_view(p_slug text, p_fingerprint text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_post_id uuid;
  v_count   int;
  v_rows    int := 0;
begin
  select id into v_post_id
  from public.posts
  where slug = p_slug and status = 'published';

  if v_post_id is null then
    raise exception 'post not found: %', p_slug using errcode = 'no_data_found';
  end if;

  insert into public.post_views (post_id, fingerprint)
  values (v_post_id, p_fingerprint)
  on conflict (post_id, fingerprint, viewed_on) do nothing;

  get diagnostics v_rows = row_count;

  if v_rows > 0 then
    update public.posts
       set view_count = view_count + 1
     where id = v_post_id
    returning view_count into v_count;
  else
    select view_count into v_count from public.posts where id = v_post_id;
  end if;

  return v_count;
end;
$$;

-- =============================================================
-- RPC: toggle reaction, trả về số đếm từng loại
-- =============================================================
create or replace function public.toggle_reaction(
  p_slug text,
  p_fingerprint text,
  p_type public.reaction_type
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_post_id uuid;
  v_deleted int;
begin
  select id into v_post_id
  from public.posts
  where slug = p_slug and status = 'published';

  if v_post_id is null then
    raise exception 'post not found: %', p_slug using errcode = 'no_data_found';
  end if;

  delete from public.reactions
   where post_id = v_post_id
     and fingerprint = p_fingerprint
     and type = p_type;

  get diagnostics v_deleted = row_count;

  if v_deleted = 0 then
    insert into public.reactions (post_id, fingerprint, type)
    values (v_post_id, p_fingerprint, p_type);
  end if;

  return (
    select coalesce(json_object_agg(type, cnt), '{}'::json)
    from (
      select type::text as type, count(*) as cnt
      from public.reactions
      where post_id = v_post_id
      group by type
    ) s
  );
end;
$$;

-- =============================================================
-- RPC: full-text search
-- =============================================================
create or replace function public.search_posts(p_query text, p_limit int default 10)
returns table (
  slug text,
  title text,
  summary text,
  published_at timestamptz,
  rank real
)
language sql
stable
as $$
  select p.slug,
         p.title,
         p.summary,
         p.published_at,
         ts_rank(p.search_vector, websearch_to_tsquery('english'::regconfig, p_query)) as rank
  from public.posts p
  where p.status = 'published'
    and p.search_vector @@ websearch_to_tsquery('english'::regconfig, p_query)
  order by rank desc, p.published_at desc
  limit least(greatest(p_limit, 1), 50);
$$;

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.posts       enable row level security;
alter table public.projects    enable row level security;
alter table public.post_views  enable row level security;
alter table public.reactions   enable row level security;
alter table public.subscribers enable row level security;
alter table public.admins      enable row level security;

-- posts: ai cũng đọc được bài đã publish
create policy posts_public_read on public.posts
  for select using (status = 'published');

create policy posts_admin_read on public.posts
  for select to authenticated using (public.is_admin());

create policy posts_admin_write on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- projects: tương tự
create policy projects_public_read on public.projects
  for select using (status = 'published');

create policy projects_admin_all on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- reactions: cho phép đọc số đếm
create policy reactions_public_read on public.reactions
  for select using (true);

-- post_views / subscribers / admins: KHÔNG có policy public.
-- Chỉ Edge Function (service_role, bypass RLS) và admin mới đụng được.
create policy views_admin_read on public.post_views
  for select to authenticated using (public.is_admin());

create policy subscribers_admin_read on public.subscribers
  for select to authenticated using (public.is_admin());

create policy admins_self_read on public.admins
  for select to authenticated using (email = (auth.jwt() ->> 'email'));

-- =============================================================
-- Quyền cho anon / authenticated gọi RPC
-- =============================================================
revoke all on function public.increment_view(text, text)  from public;
revoke all on function public.toggle_reaction(text, text, public.reaction_type) from public;

grant execute on function public.search_posts(text, int) to anon, authenticated;
-- increment_view / toggle_reaction chỉ gọi qua Edge Function bằng service_role
