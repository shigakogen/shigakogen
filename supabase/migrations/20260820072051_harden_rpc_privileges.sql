-- =============================================================
-- Hardening theo cảnh báo của Supabase advisor sau khi push migration đầu:
--
-- 1. increment_view / toggle_reaction đang bị lộ cho anon + authenticated
--    dù migration gốc đã `revoke all ... from public` — vì Supabase tự
--    grant EXECUTE cho anon/authenticated trên mọi function mới trong
--    schema public (default privileges), tách biệt với pseudo-role
--    "public". Revoke tường minh để chỉ Edge Function (service_role)
--    gọi được, đúng thiết kế trong docs/02-API.md.
-- 2. is_admin() không cần anon gọi trực tiếp (tránh dò xem 1 JWT có phải
--    admin không qua /rest/v1/rpc/is_admin) — chỉ giữ cho authenticated
--    vì RLS policy (posts_admin_read, ...) cần authenticated gọi được
--    hàm này khi đánh giá policy.
-- 3. set_updated_at() và search_posts() thiếu `set search_path`, dễ bị
--    search_path hijacking — pin về public như các hàm khác.
-- =============================================================

revoke execute on function public.increment_view(text, text) from anon, authenticated;
revoke execute on function public.toggle_reaction(text, text, public.reaction_type) from anon, authenticated;
grant execute on function public.increment_view(text, text) to service_role;
grant execute on function public.toggle_reaction(text, text, public.reaction_type) to service_role;

revoke execute on function public.is_admin() from anon;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

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
set search_path = public
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
