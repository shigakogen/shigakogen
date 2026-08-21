# 00 — Đặc tả sản phẩm

## Mục tiêu

Một website cá nhân vừa là blog kỹ thuật, vừa là portfolio, vừa là resume online. Người đọc mục tiêu: **nhà tuyển dụng / tech lead** (ở lại ~40 giây, cần thấy ngay bạn giỏi cái gì) và **developer khác** (đọc bài, quay lại nếu nội dung tốt).

## Phạm vi v1 (MVP)

### Trang public

| Route | Mô tả |
|---|---|
| `/` | Hero giới thiệu ngắn gọn, 3 bài mới nhất, 3 project nổi bật, CTA liên hệ |
| `/blog` | Danh sách bài viết, filter theo tag, phân trang |
| `/blog/[slug]` | Bài viết: TOC sticky, reading time, view count, nút reaction, prev/next, share |
| `/blog/tags/[tag]` | Bài viết theo tag |
| `/projects` | Grid các project |
| `/projects/[slug]` | Case study: Problem → Solution → Architecture → Impact |
| `/resume` | CV dạng HTML, print-friendly (`@media print`), nút tải PDF |
| `/about` | Câu chuyện cá nhân, timeline sự nghiệp, ảnh |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt` | Feed & SEO |
| `/api/og` | Sinh OG image động cho từng bài |

### Trang admin (chỉ chủ site)

| Route | Mô tả |
|---|---|
| `/admin/login` | Đăng nhập bằng Supabase Auth (magic link) |
| `/admin` | Danh sách bài viết + trạng thái draft/published |
| `/admin/posts/new` | Tạo bài mới |
| `/admin/posts/[id]` | Editor: textarea Markdown + live preview cạnh bên, upload ảnh |
| `/admin/projects` | CRUD project |

Bảo vệ bằng `middleware.ts`: kiểm tra session Supabase **và** email nằm trong `ADMIN_EMAIL`. Không có session → redirect `/admin/login`.

## Mô hình nội dung

Bài viết lưu trong Postgres, cột `content` là **Markdown/MDX dạng text**. Khi render, đọc từ DB → truyền qua `next-mdx-remote/rsc` với plugin `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`.

Vì content nằm trong DB nên trang dùng **ISR**: `export const revalidate = 3600`. Khi admin publish/sửa bài, gọi `revalidatePath('/blog/' + slug)` và `revalidatePath('/blog')` để cập nhật ngay.

> **Cảnh báo bảo mật:** MDX cho phép thực thi JSX. Vì chỉ có **một tác giả duy nhất là chính bạn** (RLS chặn mọi người khác ghi vào `posts`), việc này an toàn. Nếu sau này mở cho người khác viết, phải chuyển sang Markdown thuần (`remark` + sanitize), không dùng MDX.

## Chức năng động (qua Edge Functions)

1. **View counter** — mỗi bài đếm lượt xem, chống spam bằng fingerprint hash (IP + User-Agent + slug), TTL 24h.
2. **Reactions** — like / insightful, một fingerprint 1 lần mỗi loại.
3. **Search** — full-text search trên tiêu đề + tóm tắt + nội dung, dùng `tsvector` + GIN index.
4. **Newsletter** — đăng ký email, double opt-in qua email xác nhận.

## Yêu cầu phi chức năng

- Lighthouse ≥ 95 cả 4 mục trên trang bài viết
- LCP < 2.0s, CLS < 0.05, INP < 200ms
- First load JS < 100KB trên trang public
- Dark mode + light mode, tôn trọng `prefers-color-scheme` và `prefers-reduced-motion`
- Contrast ≥ 4.5:1, điều hướng bàn phím đầy đủ
- Tất cả trang public phải hoạt động khi JS bị tắt (trừ view counter, search, reaction)

## Ngoài phạm vi v1

Comment system, i18n song ngữ, digital garden / backlinks, analytics tự viết, multi-author. Ghi lại nhưng **không làm** trong v1.
