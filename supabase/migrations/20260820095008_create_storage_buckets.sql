-- 2 bucket public theo docs/01-DATABASE.md: post-images (ảnh bài viết/cover),
-- files (resume.pdf). Upload/update/delete chỉ authenticated + is_admin();
-- đọc thì public (cần để hiện ảnh/tải resume ngoài trang public).
insert into storage.buckets (id, name, public)
values
  ('post-images', 'post-images', true),
  ('files', 'files', true)
on conflict (id) do nothing;

create policy "post-images public read" on storage.objects
  for select using (bucket_id = 'post-images');

create policy "post-images admin write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'post-images' and public.is_admin());

create policy "post-images admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'post-images' and public.is_admin())
  with check (bucket_id = 'post-images' and public.is_admin());

create policy "post-images admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'post-images' and public.is_admin());

create policy "files public read" on storage.objects
  for select using (bucket_id = 'files');

create policy "files admin write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'files' and public.is_admin());

create policy "files admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'files' and public.is_admin())
  with check (bucket_id = 'files' and public.is_admin());

create policy "files admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'files' and public.is_admin());
