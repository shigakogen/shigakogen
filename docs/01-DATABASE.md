# 01 — Database

Migration đã viết sẵn: `supabase/migrations/20260820000000_init.sql`. Seed: `supabase/seed.sql`.

## Bảng

| Bảng | Vai trò |
|---|---|
| `admins` | Allowlist email được quyền ghi. **Phải seed email của bạn vào đây**, nếu không admin panel sẽ từ chối. |
| `posts` | Bài viết. `content` là Markdown/MDX text. `search_vector` là generated column (title A + summary B + content C). |
| `projects` | Case study. Sắp xếp theo `sort_order`. |
| `post_views` | Log view, unique `(post_id, fingerprint, viewed_on)` → 1 người/1 bài/1 ngày chỉ đếm 1 lần. |
| `reactions` | like / insightful, unique theo `(post_id, fingerprint, type)` → toggle được. |
| `subscribers` | Newsletter, double opt-in bằng `confirm_token`. |

## RPC functions

| Function | Gọi bởi | Mô tả |
|---|---|---|
| `increment_view(slug, fingerprint)` | Edge Function (service_role) | Trả về `view_count` mới |
| `toggle_reaction(slug, fingerprint, type)` | Edge Function (service_role) | Trả về JSON số đếm từng loại |
| `search_posts(query, limit)` | anon/authenticated | `websearch_to_tsquery` + `ts_rank` |
| `is_admin()` | policy nội bộ | Kiểm tra `auth.jwt() ->> 'email'` có trong `admins` |

## RLS — tóm tắt

- `posts`, `projects`: anon **chỉ đọc** row có `status = 'published'`. Admin đọc/ghi tất cả.
- `reactions`: anon đọc được (để hiển thị số đếm), **không** ghi trực tiếp — phải qua Edge Function.
- `post_views`, `subscribers`: anon **không** đọc được gì cả.
- `increment_view` và `toggle_reaction` đã bị `revoke` khỏi `public` → chỉ gọi được bằng `service_role` key trong Edge Function.

## Fingerprint

Không lưu IP thô. Edge Function tính:

```ts
fingerprint = base64url( sha256( ip + userAgent + slug + FINGERPRINT_SALT ) ).slice(0, 32)
```

`FINGERPRINT_SALT` là secret của Edge Function. Cách này đủ để chống đếm trùng mà không lưu dữ liệu cá nhân.

## Sinh types cho TypeScript

```bash
supabase gen types typescript --local > src/lib/supabase/database.types.ts
# hoặc từ remote:
supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts
```

Chạy lại lệnh này mỗi khi đổi schema. **Không sửa tay file này.**

## Storage buckets

Tạo 2 bucket trong Supabase Studio (hoặc bằng SQL):

| Bucket | Public | Dùng cho |
|---|---|---|
| `post-images` | có | Ảnh trong bài viết, cover |
| `files` | có | `resume.pdf` |

Policy upload: chỉ `authenticated` + `is_admin()`.

## Lưu ý khi lên production

- Bật **Point-in-time Recovery** nếu có thể, hoặc đặt lịch `pg_dump` định kỳ. Nội dung blog nằm trong DB nên **DB chết = mất bài viết**.
- Chạy `supabase db dump --data-only > backup.sql` định kỳ và commit vào repo riêng — coi như bản sao lưu bằng Git.
