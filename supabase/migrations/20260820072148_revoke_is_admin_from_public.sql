-- is_admin() vẫn gọi được bởi anon vì migration trước chỉ revoke khỏi
-- role anon tường minh, chưa revoke khỏi pseudo-role "public" (mà mọi
-- role đều là thành viên ngầm định) — nên anon vẫn kế thừa EXECUTE qua
-- đường "public". Revoke khỏi public rồi grant lại tường minh cho
-- authenticated (RLS policy posts_admin_read/posts_admin_write/
-- projects_admin_all cần authenticated gọi được hàm này khi đánh giá
-- policy).
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
