-- Seed cho môi trường local (chạy tự động khi `supabase db reset`)
-- ⚠️ Đổi email dưới đây thành email bạn dùng để đăng nhập admin.

insert into public.admins (email) values ('luuhoainam97@gmail.com')
on conflict do nothing;

insert into public.posts (slug, title, summary, content, tags, status, reading_minutes, published_at)
values
(
  'hello-world',
  'Hello, world',
  'Bài viết đầu tiên — dùng để kiểm tra pipeline render MDX.',
  E'## Chào bạn\n\nĐây là bài viết mẫu để test pipeline.\n\n```go\nfunc main() {\n\tfmt.Println("hello")\n}\n```\n\n> Blockquote để kiểm tra style.\n\n- item một\n- item hai\n',
  array['meta'],
  'published',
  2,
  now() - interval '2 days'
),
(
  'draft-example',
  'Bài nháp mẫu',
  'Bài này ở trạng thái draft, không được hiện ra ngoài public.',
  E'Nội dung nháp.\n',
  array['meta'],
  'draft',
  1,
  null
)
on conflict (slug) do nothing;

insert into public.projects (slug, title, summary, content, tech, featured, sort_order, status)
values
(
  'sample-project',
  'Sample Project',
  'Một project mẫu để kiểm tra layout case study.',
  E'### Problem\n\nMô tả vấn đề.\n\n### Solution\n\nMô tả giải pháp.\n\n### Architecture\n\nSơ đồ ở đây.\n\n### Impact\n\n- Giảm p99 từ 1.2s xuống 80ms\n',
  array['Go', 'Postgres', 'Docker'],
  true,
  1,
  'published'
)
on conflict (slug) do nothing;
