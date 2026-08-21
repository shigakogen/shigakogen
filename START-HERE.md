# Bắt đầu từ đây

Bộ file này để bạn mở Claude Code trong terminal và build tiếp.

## Bước 1 — Copy vào repo

Giải nén bộ này rồi copy toàn bộ vào thư mục repo GitHub bạn đã tạo:

```
your-repo/
├── CLAUDE.md
├── START-HERE.md
├── .env.example
├── docs/
│   ├── 00-SPEC.md
│   ├── 01-DATABASE.md
│   ├── 02-API.md
│   ├── 03-ROADMAP.md
│   └── 04-DESIGN.md
└── supabase/
    ├── migrations/20260820000000_init.sql
    └── seed.sql
```

## Bước 2 — Sửa 3 chỗ trước khi chạy

1. `supabase/seed.sql` → đổi `CHANGE_ME@example.com` thành email bạn dùng đăng nhập admin
2. `docs/04-DESIGN.md` → chọn hue cho accent color (250 là mặc định)
3. `.env.example` → copy thành `.env.local` và điền key thật (nhớ thêm `.env.local` vào `.gitignore`)

## Bước 3 — Cần cài sẵn

```bash
node -v            # >= 20
pnpm -v            # npm i -g pnpm
supabase --version # https://supabase.com/docs/guides/cli
docker ps          # Supabase local cần Docker chạy
```

## Bước 4 — Mở Claude Code

```bash
cd your-repo
claude
```

Prompt đầu tiên, dán nguyên đoạn này:

```
Đọc CLAUDE.md và toàn bộ thư mục docs/. Sau đó thực hiện task T0.1
trong docs/03-ROADMAP.md. Chỉ làm đúng task đó, không làm trước các
task sau. Xong thì chạy typecheck, báo tôi kết quả và tick checkbox
trong ROADMAP.
```

Các lần sau chỉ cần:

```
Làm task tiếp theo trong docs/03-ROADMAP.md.
```

## Mẹo dùng Claude Code hiệu quả cho dự án này

- **Mỗi task một session context sạch.** Xong một task lớn thì `/clear` rồi bắt đầu task mới — tránh Claude bị nhiễu bởi context cũ.
- **Bắt commit sau mỗi task.** "Commit lại với conventional commit message" — history sạch là điểm cộng khi nhà tuyển dụng xem repo.
- **Dùng plan mode cho task khó.** Nhấn `Shift+Tab` hai lần để vào plan mode trước khi làm T1.3 (MDX pipeline) và T2.2 (editor) — đây là 2 task dễ đi sai hướng nhất.
- **Đừng để Claude làm nhiều task một lượt.** Nó sẽ chạy được nhưng bạn không kiểm soát được chất lượng, và bạn học được ít hơn — mà mục tiêu của bạn là tự dev để học.
- **Sau mỗi phase, tự đọc lại code.** Nếu có chỗ không hiểu, hỏi luôn: "giải thích file X hoạt động thế nào". Đây mới là phần có giá trị cho phỏng vấn.

## Thứ tự ưu tiên nếu bị kẹt thời gian

Phase 0 → Phase 1 → **viết 3 bài thật và launch** → Phase 2 → Phase 3 → Phase 4.

Đừng làm admin panel trước khi có blog chạy được. Và đừng làm Edge Functions trước khi có bài viết thật — view counter đếm 0 lượt xem trên site không có nội dung thì vô nghĩa.

## Nhắc lại điều quan trọng nhất

Nhà tuyển dụng nhớ **nội dung**, không nhớ animation. Site chạy được với 3 bài viết tử tế thắng site hoàn hảo với 0 bài. Đặt deadline launch cho Phase 1 và giữ nó.
