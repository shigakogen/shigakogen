# 04 — Design system

Nguyên tắc: **nội dung là chính, giao diện lùi lại phía sau.** Ít màu, nhiều khoảng trắng, typography tốt. Không animation thừa.

## Cảm hứng thiết kế

- **robbowen.digital** — hero section chữ lớn/bold ("Hi, my name is **Robb**"), ngắt dòng sáng tạo (vd. "S c r o l l") để tạo điểm nhấn thị giác mà không cần animation, contrast cao (nền sáng/chữ tối rõ ràng), CTA nổi bật kiểu "Hire me". Áp dụng cho hero ở trang chủ và trang `/about`: 1 dòng tiêu đề lớn + 1 chi tiết typography chơi chữ, còn lại giữ tối giản.
- **lelouvincx.com** — cấu trúc tính năng blog + portfolio cá nhân: tag/category cho bài viết, reading time, project trình bày dạng case study, resume xem trực tiếp + tải file. Các mục này đã có trong `docs/00-SPEC.md`/`01-DATABASE.md`, không cần thêm token mới — chỉ đảm bảo khi build UI (T1.5, T1.6 trong roadmap) thể hiện đủ các thành phần này.

## Màu (OKLCH, Tailwind v4 dùng `@theme`)

Đã chốt **hue 206 (xanh blue pastel, dựa trên `#B3EBF2`)** — implement trong `src/app/globals.css`:

```css
@theme {
  /* Light */
  --color-bg:            oklch(99% 0.002 30);
  --color-surface:       oklch(97% 0.004 30);
  --color-border:        oklch(90% 0.006 30);
  --color-fg:            oklch(22% 0.012 30);
  --color-muted:         oklch(52% 0.014 30);
  --color-accent:        oklch(90.4% 0.0576 206); /* = #B3EBF2, dùng làm NỀN fill */
  --color-accent-fg:     oklch(25% 0.03 206);      /* chữ/icon tối trên accent */
  --color-accent-strong: oklch(52% 0.16 206);      /* chữ/link/viền/focus-ring */

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

.dark {
  --color-bg:            oklch(16% 0.012 30);
  --color-surface:       oklch(20% 0.014 30);
  --color-border:        oklch(28% 0.016 30);
  --color-fg:            oklch(94% 0.006 30);
  --color-muted:         oklch(68% 0.012 30);
  /* accent/accent-fg KHÔNG đổi theo theme — xem lưu ý dưới */
  --color-accent-strong: oklch(72% 0.14 206);
}
```

**2 vai trò tách riêng cho accent** (quyết định khi đổi từ cam sang pastel blue — pastel quá sáng để dùng làm chữ/viền):
- `accent` + `accent-fg`: chỉ dùng khi accent là **nền của một khối fill** có chữ/icon đặt trực tiếp lên trên (nút primary, badge, logo). Cặp này giữ nguyên giá trị ở cả 2 theme vì đây là màu "chip" thương hiệu cố định, không phải màu phái sinh theo độ sáng nền. Contrast accent-fg vs accent ≈ 12:1.
- `accent-strong`: dùng khi accent đóng vai trò **chữ/link/hover/viền/focus-ring** — tức là màu đặt trực tiếp lên nền trang (`--color-bg`/`--color-surface`), cần đủ đậm để đọc được. Light: L52%/C0.16 (contrast ≈5:1 với bg). Dark: L72%/C0.14 (contrast ≈8:1 với bg) — công thức L/C tái dùng y hệt bản hue 30 cũ, chỉ đổi hue, vì đã verify mức lightness đó cho contrast tốt.

Lưu ý so với bản nháp ban đầu (hue 250 mặc định):
- `--font-mono` trỏ `--font-geist-mono` (đã có sẵn từ scaffold Next.js) thay vì JetBrains Mono — tránh thêm dependency font mới không cần thiết.
- Hue cam (30) ban đầu: `accent-fg` ở dark mode phải đổi từ trắng sang tối để đạt 5.79:1 (light) / 7.4:1 (dark) — **mỗi khi đổi hue phải đo lại**, không copy nguyên giá trị lightness cũ.
- Hue pastel blue (206) hiện tại: bản thân accent (L90%) quá sáng để dùng trực tiếp làm chữ/link ở bất kỳ theme nào (contrast chỉ ~1.3:1 với bg) → tách thêm `accent-strong` thay vì ép 1 token gánh 2 vai trò.

**Chọn accent:** đổi giá trị hue (số cuối) nếu muốn màu khác. 250 = xanh dương, 150 = xanh lá, 30 = cam, 206 = xanh blue pastel, 320 = tím. Nếu hue mới cũng rất sáng (pastel) như 206, nhớ tách `accent-strong` tương tự thay vì chỉ đổi 1 token `accent`.

**Bắt buộc:** mọi cặp foreground/background phải đạt contrast ≥ 4.5:1 ở cả hai theme — đo bằng WCAG relative luminance thực tế (OKLCH lightness không tuyến tính với contrast), không chỉ nhìn số L cho giống nhau giữa 2 theme rồi coi là an toàn.

## Typography

- Body: 17–18px, `line-height: 1.7`, `max-width: 68ch` cho vùng đọc
- Heading: `font-weight: 650`, `letter-spacing: -0.02em`, scale 1.25
- Code inline: nền `--color-surface`, bo góc 4px, cỡ chữ 0.9em
- Code block: padding 16px, có nút copy góc trên phải, `overflow-x: auto`
- Link trong bài: màu accent + `text-underline-offset: 3px`, hover đổi độ dày gạch chân

## Spacing & layout

- Scale 4px. Container tối đa 1100px, vùng đọc 68ch.
- Section cách nhau 96px trên desktop, 64px trên mobile.
- Breakpoint: mobile-first, 640 / 768 / 1024 / 1280.

## Motion

- Chỉ 2 loại: fade-in nhẹ khi scroll vào viewport (một lần), và transition 150ms cho hover/focus.
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Bắt buộc** bọc trong `@media (prefers-reduced-motion: no-preference)`.
- Không parallax, không animation kéo dài > 300ms, không auto-play.
- **Công cụ:** CSS `transition`/`@keyframes` + `IntersectionObserver` (viewport reveal) là đủ cho toàn bộ site. Chỉ cân nhắc thêm `motion` (Framer Motion) nếu sau này cần scroll-reveal/hover phức tạp hơn mức CSS thuần làm được — không dùng GSAP (nặng, không cần thiết cho mức độ animation đã định ở trên).

## Component style

- Card: `border` 1px `--color-border`, bo 12px, **không đổ bóng** ở light mode; hover chỉ đổi màu border.
- Badge/tag: nền surface, chữ muted, bo tròn hoàn toàn, chữ nhỏ 12px.
- Focus ring: `outline: 2px solid var(--color-accent); outline-offset: 2px` — không bao giờ `outline: none`.

## Print (trang `/resume`)

```css
@media print {
  nav, footer, .no-print { display: none; }
  body { color: #000; background: #fff; font-size: 11pt; }
  a::after { content: " (" attr(href) ")"; font-size: 9pt; }
  section { break-inside: avoid; }
}
```

Mục tiêu: Ctrl+P ra đúng 1–2 trang A4 sạch sẽ.
