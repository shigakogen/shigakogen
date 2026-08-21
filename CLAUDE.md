# CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc trong repo này.

## Dự án

Website portfolio + blog cá nhân của một Backend Developer. Mục tiêu: nơi chia sẻ bài viết kỹ thuật, trưng bày project, và đăng resume để gây ấn tượng với nhà tuyển dụng.

**Ngôn ngữ giao tiếp với người dùng: Tiếng Việt.** Code, comment, commit message, tên biến: tiếng Anh.

## Stack (đã chốt — không tự ý đổi)

| Lớp         | Công nghệ                                                            |
| ----------- | -------------------------------------------------------------------- |
| Framework   | Next.js (App Router) + TypeScript strict                             |
| Styling     | Tailwind CSS v4 + shadcn/ui                                          |
| Content     | **Supabase Postgres** (bài viết lưu trong DB dạng Markdown/MDX text) |
| Render MDX  | `next-mdx-remote` (RSC) + `rehype-pretty-code` (Shiki)               |
| Backend API | **Supabase Edge Functions** (Deno + TypeScript)                      |
| Auth        | Supabase Auth (chỉ 1 admin user, email allowlist)                    |
| Storage     | Supabase Storage (ảnh bài viết, resume PDF)                          |
| Deploy FE   | Vercel                                                               |
| Deploy BE   | `supabase functions deploy`                                          |

## Nguyên tắc quan trọng

1. **Không hardcode secret.** Mọi key đọc từ env. `SUPABASE_SERVICE_ROLE_KEY` **chỉ** được dùng ở server-side (Route Handler, Server Action, Edge Function) — tuyệt đối không để lọt vào client bundle.
2. **RLS luôn bật** trên mọi bảng. Public chỉ đọc được `posts` đã publish.
3. **Fail gracefully.** Nếu Edge Function chết, trang bài viết vẫn phải đọc được (chỉ ẩn view count đi).
4. **Server Components mặc định.** Chỉ thêm `"use client"` khi thật sự cần interactivity.
5. **ISR cho trang public**: `export const revalidate = 3600`, kết hợp `revalidatePath()` khi admin publish bài.
6. Mọi trang mới phải có `generateMetadata()` đầy đủ (title, description, OG image, canonical).
7. Không cài thêm dependency lớn nếu chưa hỏi. Ưu tiên thư viện chuẩn / đã có sẵn.

## Lệnh thường dùng

```bash
pnpm dev                 # chạy dev server
pnpm build               # build production (phải pass trước khi commit)
pnpm lint                # eslint
pnpm typecheck           # tsc --noEmit
pnpm test                # vitest

supabase start           # chạy Supabase local (Docker)
supabase db reset        # reset DB local + chạy lại migrations + seed
supabase migration new <name>
supabase db push         # đẩy migration lên project remote
supabase functions serve <name>    # chạy edge function local
supabase functions deploy <name>
supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

## Quy ước code

- Thư mục: `kebab-case`. Component file: `kebab-case.tsx`, export component `PascalCase`.
- Không dùng `any`. Nếu bí, dùng `unknown` + type guard.
- Data fetching đặt trong `src/lib/queries/*.ts`, không gọi Supabase trực tiếp trong component.
- Type DB sinh tự động bằng `supabase gen types` — **không sửa tay** file `database.types.ts`.
- Commit theo Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.

## Cấu trúc thư mục mục tiêu

```
src/
├── app/
│   ├── (site)/                  # public layout
│   │   ├── page.tsx             # home
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── projects/[slug]/page.tsx
│   │   ├── resume/page.tsx
│   │   └── about/page.tsx
│   ├── (admin)/admin/           # protected: list, editor, preview
│   ├── api/og/route.tsx         # OG image động
│   ├── rss.xml/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── components/{ui,site,mdx,admin}/
├── lib/
│   ├── supabase/{client,server,admin,database.types}.ts
│   ├── queries/{posts,projects,stats}.ts
│   ├── mdx.tsx
│   └── seo.ts
└── styles/globals.css

supabase/
├── migrations/
├── functions/{increment-view,react,subscribe,search}/
└── seed.sql
```

## Đọc trước khi bắt đầu

- `docs/00-SPEC.md` — đặc tả đầy đủ
- `docs/01-DATABASE.md` — schema, RLS, index
- `docs/02-API.md` — hợp đồng Edge Functions
- `docs/03-ROADMAP.md` — **danh sách task theo thứ tự, làm từ trên xuống**
- `docs/04-DESIGN.md` — design token, typography, màu

## Định nghĩa "xong" cho mỗi task

Một task chỉ được coi là hoàn thành khi:

- [ ] `pnpm typecheck` và `pnpm lint` pass
- [ ] `pnpm build` thành công
- [ ] Chức năng chạy được thật (không phải chỉ compile)
- [ ] Không có secret bị commit
- [ ] Đã tick `[x]` vào checkbox tương ứng trong `docs/03-ROADMAP.md`
