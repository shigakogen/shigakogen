# 03 — Roadmap

**Cách dùng:** làm từ trên xuống, mỗi lần một task. Xong task nào thì tick `[x]` vào file này rồi commit. Không nhảy cóc.

**Phiên bản backend-first** — Edge Functions deploy lên Supabase Cloud từ Phase 1 (không dùng Supabase local/Docker). Frontend gọi thẳng vào backend đã chạy thật thay vì nối dây sau.

---

## Phase 0 — Khởi tạo & cấu trúc

### T0.1 — Scaffold Next.js
- [x] `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- [x] Bật `strict: true` và `noUncheckedIndexedAccess: true` trong `tsconfig.json`
- [x] Thêm script `typecheck`, `format` vào `package.json`
- [x] Cài Prettier + `prettier-plugin-tailwindcss`
- **Xong khi:** `pnpm dev` chạy, `pnpm typecheck` pass

### T0.2 — Supabase Cloud project
- [x] `supabase login`
- [x] Tạo project trên dashboard supabase.com (hoặc `supabase projects create`)
- [x] `supabase link --project-ref <ref>`
- [x] Sửa email trong `supabase/seed.sql` thành email thật
- [x] `supabase db push` — đẩy migration có sẵn thẳng lên project cloud
- [x] Chạy seed trên remote (qua connection string hoặc `supabase db push --include-seed` tuỳ CLI version)
- [x] `supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts`
- [x] Vá lỗ hổng phát hiện qua advisor: `increment_view`/`toggle_reaction` bị lộ cho anon/authenticated dù đã `revoke ... from public` (Supabase tự grant EXECUTE cho anon/authenticated tách biệt khỏi pseudo-role `public`); `is_admin` tương tự, chỉ giữ cho `authenticated` (RLS cần). Xem `supabase/migrations/20260820072051_harden_rpc_privileges.sql` và `20260820072148_revoke_is_admin_from_public.sql`.
- **Xong khi:** query `select * from posts` trong Supabase Studio (cloud) trả về 2 dòng

### T0.3 — Supabase client
- [x] Cài `@supabase/supabase-js` và `@supabase/ssr`
- [x] `src/lib/supabase/client.ts` — browser client (anon key)
- [x] `src/lib/supabase/server.ts` — server client đọc cookie (anon key)
- [x] `src/lib/supabase/admin.ts` — service role client, **có `import "server-only"` ở đầu file**
- [x] `.env.local` theo `.env.example`, trỏ vào project cloud (dùng publishable key `sb_publishable_...` thay cho legacy anon JWT; `SUPABASE_SERVICE_ROLE_KEY` để trống, bạn tự điền)
- **Xong khi:** một Server Component fetch được danh sách posts từ project cloud

### T0.4 — Deploy sớm
- [x] Push lên GitHub, connect Vercel, set env vars trên Vercel
- **Xong khi:** URL Vercel mở được trang chủ ✅ — `https://shigakogen.vercel.app` chạy thật, `/blog` load đúng dữ liệu từ Supabase Cloud. Domain riêng `shigakogen.site` đang add (xem ghi chú cuối T2.8).

---

## Phase 1 — Backend: Edge Functions

Viết & deploy thẳng lên Supabase Cloud (`supabase functions deploy`), set secrets bằng `supabase secrets set`. Chưa có UI/bài viết thật nên test bằng `deno test` + `curl`/Postman theo hợp đồng trong `docs/02-API.md`.

### T1.1 — `increment-view`
- [x] Viết function theo `docs/02-API.md`, có CORS + validate
- [x] `deno test` cho function
- [x] `supabase functions deploy increment-view`
- **Xong khi:** `curl` gọi function 2 lần trong cùng ngày, view chỉ tăng 1 ✅ (test qua curl + Postman + `deno test`)

### T1.2 — `react`
- [x] Function theo `docs/02-API.md`, toggle reaction
- [x] `deno test`
- [x] `supabase functions deploy react`
- **Xong khi:** gọi 2 lần thì toggle về như cũ ✅

### T1.3 — `search`
- [x] Function search dùng RPC `search_posts`
- [x] `deno test`
- [x] `supabase functions deploy search`
- **Xong khi:** gọi với từ khóa trong bài seed ra kết quả đúng ✅

### T1.4 — `subscribe` + `confirm`
- [x] 2 function theo `docs/02-API.md`, honeypot field chống bot
- [x] `deno test`
- [x] `supabase functions deploy subscribe` và `supabase functions deploy confirm`
- **Xong khi:** gọi `subscribe` tạo được record, gọi `confirm` với token đúng set được `confirmed_at` ✅ — **lưu ý:** `RESEND_API_KEY` chưa được set (`supabase secrets set RESEND_API_KEY=<key>`), nên `subscribe` hiện ghi DB đúng nhưng KHÔNG gửi email thật cho tới khi bạn có tài khoản Resend và set secret này.
- Cả 5 function deploy với `verify_jwt = false` (`supabase/config.toml`) vì client gọi bằng publishable key qua header `apikey`, không phải user JWT — xem `docs/02-API.md`/`postman/shigakogen-edge-functions.postman_collection.json`.

---

## Phase 2 — Frontend: Blog public

### T2.1 — Design system
- [x] `globals.css`: CSS variables theo `docs/04-DESIGN.md`, dark mode bằng `.dark` class
- [x] `next/font`: 1 sans + 1 mono, `display: swap`
- [x] Cài shadcn/ui, thêm `button`, `card`, `badge`, `input`, `dialog`
- [x] Theme toggle (`next-themes`), không bị flash khi load
- **Xong khi:** đổi light/dark mượt, không chớp trắng ✅ — verify script anti-FOUC của next-themes có trong HTML (chạy trước paint), không có lỗi hydration trong dev log. **Lưu ý:** chưa tự click test bằng trình duyệt thật (không có tool browser trong môi trường này) — bạn nên tự mở `pnpm dev` và bấm nút toggle 1 lần để xác nhận bằng mắt.
- Accent hue = 30 (cam), đã đo WCAG contrast thực tế và chỉnh 2 giá trị so với draft gốc (xem `docs/04-DESIGN.md`).
- shadcn dùng Base UI (không phải Radix) — CLI mới nhất khuyến nghị mặc định.

### T2.2 — Layout site
- [x] `src/app/(site)/layout.tsx`: header (logo, nav, theme toggle, search), footer (social, RSS)
- [x] Nav responsive, có mobile menu
- [x] Skip-to-content link cho a11y
- **Xong khi:** điều hướng bằng Tab hoạt động đầy đủ, focus ring rõ ✅ — verify qua curl: skip-link, header/nav (4 link + search placeholder + theme toggle + mobile menu trigger), footer đều render đúng DOM order, focus-visible outline dùng `--color-accent`. **Chưa click-test bằng trình duyệt thật** (không có browser tool) — nên tự mở `pnpm dev` bấm Tab/click mobile menu 1 lần.
- Trang chủ đã chuyển vào `src/app/(site)/page.tsx` (route group).
- Social links trong footer (`src/lib/site-config.ts`) là placeholder — cần bạn tự điền GitHub/LinkedIn/email thật.
- Nút search trong header disabled tạm (chờ Phase 3, T3.3).
- `lucide-react` v1 đã bỏ icon logo thương hiệu — GitHub/LinkedIn dùng inline SVG thay vì thêm dependency.

### T2.3 — MDX pipeline
- [x] Cài `next-mdx-remote`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`, `shiki`
- [x] `src/lib/mdx.tsx`: hàm `renderMdx(source)` + map component tùy chỉnh (heading có anchor, `a` external mở tab mới, `img` dùng `next/image`, code block có nút copy, callout)
- [x] Hàm trích TOC từ heading
- **Xong khi:** bài seed `hello-world` render đúng, code block có highlight, heading có anchor link ✅ — verify qua curl trên dữ liệu thật từ Supabase Cloud: heading có `id="chào-bạn"` + anchor link, code block Go có shiki token color (light/dark), copy button, TOC link khớp đúng id heading.
- Cài thêm `github-slugger` (dep của `rehype-slug`, dùng lại để TOC id khớp chính xác anchor thật) và `@types/mdx` (type cho `MDXComponents`) — nhỏ, không tính là dependency lớn.
- TOC trích bằng regex trên markdown thô (không parse AST đầy đủ) — đủ dùng cho nội dung blog, tránh thêm `remark-parse`/`unified` làm dependency riêng.
- `<img>` trong MDX dùng kích thước cố định 1200×675 cho `next/image` (chưa có cách biết kích thước thật ảnh upload — sẽ cải thiện khi làm upload ảnh ở T3.3) + `remotePatterns` cho domain Supabase Storage trong `next.config.ts`.
- Trang chủ (smoke-test tạm) giờ render luôn MDX thật của bài đầu tiên kèm TOC, để chứng minh pipeline — sẽ bị thay ở T2.5/T2.6.

### T2.4 — Queries layer
- [x] `src/lib/queries/posts.ts`: `getPublishedPosts({ tag?, page? })`, `getPostBySlug`, `getAdjacentPosts`, `getAllTags`
- [x] `src/lib/queries/projects.ts`: `getPublishedProjects`, `getProjectBySlug`
- [x] Tất cả trả về type sinh từ `database.types.ts` (`Pick<Tables<'posts'|'projects'>, ...>`), không dùng `any`
- **Xong khi:** `pnpm typecheck` pass, không có `any` ✅ — verify thêm bằng dữ liệu thật: trang chủ dùng `getPublishedPosts()`/`getAllTags()`/`getPostBySlug()` thay gọi Supabase trực tiếp, curl xác nhận đúng `view_count`/`reading_minutes`/tag từ DB.
- `getAdjacentPosts`/pagination/tag-filter chưa có dữ liệu seed để test thật (chỉ 1 bài published) — logic đã review kỹ nhưng nên test lại khi có ≥3 bài thật.

### T2.5 — Trang blog
- [x] `/blog` — danh sách + filter tag (tag cloud → `/blog/tags/[tag]`) + phân trang
- [x] `/blog/[slug]` — `generateStaticParams`, `revalidate = 3600`, TOC sticky, reading time, prev/next, view counter + reactions gọi Edge Functions từ Phase 1
- [x] `/blog/tags/[tag]`
- [x] `notFound()` khi slug không tồn tại hoặc là draft
- **Xong khi:** click từ danh sách vào bài chạy đúng, bài draft trả 404, view counter tăng thật ✅ — verify qua curl: `/blog/draft-example` và slug không tồn tại đều 404, `/blog/hello-world` render đủ view counter/reactions/TOC/prev-next/JSON-LD, không lỗi trong dev log.
- **Phát hiện & sửa bug:** `generateStaticParams` gọi `cookies()` (qua client server.ts) → build lỗi (`cookies()` không khả dụng lúc build). Thêm `src/lib/supabase/static.ts` (anon key, không đọc cookie) và đổi toàn bộ `queries/posts.ts`/`projects.ts` sang dùng nó — nhờ đó `/blog/[slug]` và `/projects/[slug]` giờ build ra `● SSG` thật (trước đó sẽ luôn là `ƒ` dynamic, mất hết lợi ích ISR).

### T2.6 — Trang chủ, Projects, About, Resume
- [x] `/` — hero (typography lớn/bold kiểu robbowen.digital) + 3 bài mới + 3 project featured + CTA
- [x] `/projects` và `/projects/[slug]` (case study: Problem → Solution → Architecture → Impact)
- [x] `/about` — timeline + ảnh
- [x] `/resume` — HTML print-friendly (`@media print`: ẩn nav/footer, màu đen trắng, page-break hợp lý) + nút tải PDF từ Supabase Storage
- **Xong khi:** Ctrl+P trang resume ra bản PDF nhìn được ngay — CSS print đã thêm đúng theo `docs/04-DESIGN.md`, **cần bạn tự Ctrl+P kiểm tra bằng mắt** (không có browser tool ở môi trường này).
- Tạo 2 storage bucket còn thiếu (`post-images`, `files`) qua migration mới — RLS: đọc public, ghi chỉ `authenticated` + `is_admin()`.
- **Nội dung hero/about/resume là placeholder** trong `src/lib/profile-config.ts` (đánh dấu `TODO` rõ ràng) — cần bạn tự điền thông tin thật (tên, bio, timeline, kinh nghiệm, kỹ năng) trước khi launch. Nút "Tải PDF" trỏ tới `files/resume.pdf` trên Supabase Storage — bucket đã tạo nhưng **chưa có file**, cần bạn tự upload.

### T2.7 — SEO
- [x] `generateMetadata()` mọi trang, có canonical (qua helper `src/lib/seo.ts`)
- [x] `src/app/api/og/route.tsx` — OG image động (`next/og`)
- [x] `sitemap.ts`, `robots.ts`, `/rss.xml/route.ts`
- [x] JSON-LD: `Person` ở `/`, `BlogPosting` ở bài viết, `BreadcrumbList` (bài viết + project)
- **Xong khi:** dán URL bài viết vào trình debug OG thấy ảnh hiện đúng ✅ — verify trực tiếp: `curl /api/og?title=...` ra đúng PNG 1200×630 (đã xem ảnh, đúng bảng màu/typography), `<link rel="canonical">`/`og:image`/`twitter:card` đúng trong `<head>` bài viết.
- Bỏ `export const runtime = 'edge'` khỏi `/api/og` — Next 16 báo deprecated, dùng nodejs runtime mặc định vẫn chạy tốt.

### T2.8 — Chốt chất lượng v1
- [ ] Lighthouse ≥ 95 cả 4 mục trên `/blog/[slug]` — **chưa đo được**, môi trường dev không có Chrome/browser tool (thiếu shared lib hệ thống, không có sudo để cài). Bạn cần tự chạy Lighthouse (Chrome DevTools hoặc `npx lighthouse`) sau khi deploy.
- [x] `@next/bundle-analyzer`: cài xong, script `pnpm analyze`. **Đo thật: `/blog/[slug]` ≈ 176KB gzip, `/about` (trang nhẹ nhất) ≈ 169KB gzip — KHÔNG đạt mục tiêu <100KB.** Đã điều tra: ~168KB trong số đó là baseline React 19 + Next.js 16 App Router runtime (react-dom ~71KB gzip + app-router client ~44KB gzip) — không phải code dư của site này. Base UI `Dialog` (dùng cho mobile nav menu) cộng thêm ~20KB gzip. Ngay cả bỏ hẳn Dialog cũng không đủ để xuống dưới 100KB — mục tiêu này gần như không khả thi với stack đã chốt (React 19 + Next 16) trừ khi hạ cấp phiên bản hoặc đổi framework, cả hai đều trái với "Stack đã chốt — không tự ý đổi" trong `CLAUDE.md`. Cần bạn quyết định: chấp nhận số liệu thật, hay cân nhắc đổi stack (rủi ro lớn, không khuyến nghị).
- [x] Kiểm tra contrast (đã đo WCAG thật ở T2.1, ≥4.5:1 mọi cặp fg/bg cả 2 theme), alt text (chỉ 1 chỗ dùng `<img>`/`next/image` — `MdxImage` trong `src/lib/mdx.tsx`, luôn có `alt`, seed hiện chưa có ảnh nào nên chưa test được ảnh thật), thứ tự heading (audit thủ công toàn bộ trang: mỗi trang đúng 1 `h1`, không trang nào nhảy cấp — vd. h1→h3 thiếu h2).
- [x] Security headers trong `next.config.ts`: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, thêm cả `X-Frame-Options` và `Permissions-Policy` — verify thật bằng `curl -I` trên `next start` (production build), cả 6 header đều có mặt đúng giá trị. CSP dùng `'unsafe-inline'` cho script/style (không dùng nonce theo-request, cần middleware riêng — ghi rõ lý do trong comment) thay vì strict CSP tuyệt đối.
- **🚀 Xong khi:** deploy production, có ít nhất 3 bài thật + 3 project thật — **chưa làm**: cần bạn (1) viết ≥3 bài blog thật + ≥3 project thật (nội dung hiện chỉ có 1 bài seed + 1 project seed), (2) làm T0.4 (deploy Vercel) đã tạm hoãn từ trước. Đây là 2 việc chỉ bạn quyết định được thời điểm — báo tôi khi sẵn sàng.

---

## Phase 3 — Admin

### T3.1 — Auth
- [x] `/admin/login` — magic link qua Supabase Auth
- [x] `src/app/auth/callback/route.ts` — exchange code lấy session
- [x] `src/proxy.ts` — refresh session, chặn `/admin/*` nếu chưa login hoặc email không có trong `admins` (Next.js 16 đổi quy ước file từ `middleware.ts` sang `proxy.ts`, export `proxy` thay vì `middleware` — đã tự chạy codemod chính thức)
- **Xong khi:** mở `/admin` khi chưa login bị đá về `/admin/login` ✅ verify thật (curl: 307 → `/admin/login`); email lạ bị từ chối — **logic đã đúng** (RPC `is_admin()` chặn ở proxy.ts, đã test đúng ở T0.2) nhưng **chưa test round-trip thật với 1 email lạ** (chỉ có 1 email admin duy nhất để test). Đã gửi thật 1 magic link tới `luuhoainam97@gmail.com` qua `signInWithOtp` — không lỗi, nghĩa là redirect URL đã được Supabase chấp nhận. **Cần bạn tự bấm link trong email để xác nhận trọn vẹn flow đăng nhập** (không click được email trong môi trường này).
- Trang `/admin` hiện chỉ là stub (chứng minh middleware + hiện email đã login) — bảng danh sách bài + editor thật sẽ xây ở T3.2.

### T3.2 — Post editor
- [x] `/admin` — bảng danh sách bài, lọc theo status (query param `?status=`)
- [x] `/admin/posts/new` và `/admin/posts/[id]`
- [x] Editor 2 cột: textarea Markdown ↔ live preview (debounce 500ms, render qua đúng `renderMdx()` — Server Action trả thẳng React element, không dùng `react-dom/server` vì Next 16 chặn import đó trong Server Action/Component)
- [x] Tự sinh slug từ title (tính trực tiếp lúc render, không dùng `useEffect` — tránh lỗi lint `set-state-in-effect`), tự tính `reading_minutes`
- [x] Server Action: save draft / publish (set `published_at`) / unpublish / delete có confirm (`window.confirm`)
- [x] Sau khi lưu: `revalidatePath('/blog')`, `/blog/[slug]` (cả slug cũ nếu đổi), `/`, `/sitemap.xml`, `/rss.xml`
- [x] Autosave draft mỗi 10s vào localStorage, hỏi khôi phục khi mở lại editor
- **Xong khi:** viết bài mới trên `/admin` → publish → thấy ngay trên `/blog` — **chưa click-test được UI thật** (không có browser tool). Đã verify: `slugify()` ra đúng slug hợp lệ với tiêu đề tiếng Việt có dấu, RLS policy `posts_admin_write` (yêu cầu `is_admin()`) đúng như thiết kế, `typecheck`/`lint`/`build` sạch. **Cần bạn tự đăng nhập (bấm magic link đã gửi ở T3.1) rồi thử viết + publish 1 bài thật** để xác nhận trọn vẹn flow.

### T3.3 — Upload ảnh
- [x] Upload lên bucket `post-images`, trả về URL public (Server Action `uploadPostImage`, dùng session client — RLS `post-images admin write` tự chặn nếu không phải admin, không cần service role)
- [x] Paste ảnh trực tiếp vào editor tự upload và chèn markdown (`onPaste` trên textarea, chèn placeholder rồi thay bằng `![](url)` khi upload xong)
- [x] Giới hạn 5MB, chỉ nhận image/* (check ở Server Action)
- **Xong khi:** paste screenshot vào editor là ảnh hiện trong preview — **chưa test được bằng paste thật** (cần browser + session admin thật). Logic đã review kỹ, dùng đúng RLS bucket đã tạo/verify ở T2.6. **Cần bạn tự thử paste 1 ảnh vào editor** sau khi đăng nhập để xác nhận.

### T3.4 — Quản lý projects
- [x] CRUD project (`/admin/projects`, `/admin/projects/new`, `/admin/projects/[id]`), kéo thả sắp xếp `sort_order` (HTML5 Drag and Drop thuần — không thêm dnd-kit/react-dnd, danh sách project cá nhân ngắn không cần), toggle `featured`
- **Xong khi:** đổi thứ tự trên admin thì trang `/projects` đổi theo — logic đúng (`reorderProjects` ghi `sort_order` mới + `revalidatePath('/projects')`), RLS `projects_admin_all` verify đúng qua MCP. **Chưa click-test kéo-thả thật bằng browser** — cần bạn tự thử sau khi đăng nhập.
- Phase 3 (Admin) hoàn tất — bạn giờ có thể tự đăng nhập và viết bài/project thật qua UI, không cần tôi bịa nội dung giả cho T2.8 nữa.

---

## Phase 4 — Hoàn thiện

### T4.1 — CI/CD
- [ ] GitHub Actions: `lint` → `typecheck` → `build` → `deno test`
- [ ] Workflow riêng deploy Edge Functions khi `supabase/functions/**` đổi
- [ ] Dependabot

### T4.2 — Quan sát & sao lưu
- [ ] Sentry (chỉ production)
- [ ] Umami hoặc Plausible
- [ ] Cron job GitHub Actions: `supabase db dump --data-only` → commit vào repo backup riêng, chạy hằng tuần
- **Xong khi:** có ít nhất 1 bản backup DB tự động

### T4.3 — README cho nhà tuyển dụng
- [ ] Sơ đồ kiến trúc (Mermaid) trong README
- [ ] Hướng dẫn chạy local trong 1 lệnh
- [ ] Badge CI
- [ ] Trang public `/architecture` giải thích chính site này được build thế nào
- **Xong khi:** người lạ clone repo, chạy được trong dưới 5 phút

---

## Backlog (v2, không làm bây giờ)

Comment system · i18n Việt/Anh · digital garden + backlink · `/uses`, `/now` · RSS-to-newsletter tự động · trang thống kê view public
