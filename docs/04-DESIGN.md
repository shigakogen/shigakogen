# 04 — Design system

Nguyên tắc: **nội dung là chính, giao diện lùi lại phía sau.** Ít màu, nhiều khoảng trắng, typography tốt. Không animation thừa.

## Cảm hứng thiết kế

- **robbowen.digital** — hero section chữ lớn/bold ("Hi, my name is **Robb**"), ngắt dòng sáng tạo (vd. "S c r o l l") để tạo điểm nhấn thị giác mà không cần animation, contrast cao (nền sáng/chữ tối rõ ràng), CTA nổi bật kiểu "Hire me". Áp dụng cho hero ở trang chủ và trang `/about`: 1 dòng tiêu đề lớn + 1 chi tiết typography chơi chữ, còn lại giữ tối giản.
- **lelouvincx.com** — cấu trúc tính năng blog + portfolio cá nhân: tag/category cho bài viết, reading time, project trình bày dạng case study, resume xem trực tiếp + tải file. Các mục này đã có trong `docs/00-SPEC.md`/`01-DATABASE.md`, không cần thêm token mới — chỉ đảm bảo khi build UI (T1.5, T1.6 trong roadmap) thể hiện đủ các thành phần này.

## Màu (OKLCH, Tailwind v4 dùng `@theme`)

Đã chốt **hue 30 (cam)** — implement trong `src/app/globals.css`:

```css
@theme {
  /* Light */
  --color-bg:        oklch(99% 0.002 30);
  --color-surface:   oklch(97% 0.004 30);
  --color-border:    oklch(90% 0.006 30);
  --color-fg:        oklch(22% 0.012 30);
  --color-muted:     oklch(52% 0.014 30);
  --color-accent:    oklch(52% 0.16 30);
  --color-accent-fg: oklch(99% 0.002 30);

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

.dark {
  --color-bg:        oklch(16% 0.012 30);
  --color-surface:   oklch(20% 0.014 30);
  --color-border:    oklch(28% 0.016 30);
  --color-fg:        oklch(94% 0.006 30);
  --color-muted:     oklch(68% 0.012 30);
  --color-accent:    oklch(72% 0.14 30);
  --color-accent-fg: oklch(16% 0.012 30); /* tối, không phải trắng — xem lưu ý dưới */
}
```

Lưu ý so với bản nháp ban đầu (hue 250 mặc định):
- `--font-mono` trỏ `--font-geist-mono` (đã có sẵn từ scaffold Next.js) thay vì JetBrains Mono — tránh thêm dependency font mới không cần thiết.
- `accent` ở light mode hạ từ L58%→L52%, và `accent-fg` ở dark mode đổi từ trắng sang tối (`oklch(16% ...)`) — do đo WCAG thực tế thấy hue cam ở các mức lightness gốc cho contrast `accent` vs `accent-fg` chỉ 2.55:1–4.49:1 (fail/borderline), sau khi chỉnh đạt 5.79:1 (light) và 7.4:1 (dark). Xanh dương (hue 250) gốc có thể không gặp vấn đề này — **mỗi khi đổi hue phải đo lại**, không copy nguyên giá trị lightness cũ.

**Chọn accent:** đổi giá trị hue (số cuối) nếu muốn màu khác. 250 = xanh dương, 150 = xanh lá, 30 = cam, 320 = tím.

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
