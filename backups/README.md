# Backups

Bản sao lưu dữ liệu (data-only, không có schema) từ Supabase Cloud, tự động
tạo hằng tuần bởi `.github/workflows/db-backup.yml` (Chủ nhật, 3h UTC).

Chứa dữ liệu thật (email subscriber, admin...) — repo này phải luôn ở chế độ
**private**. Không dùng để restore trực tiếp schema, chỉ để khôi phục dữ liệu
sau khi đã chạy lại các file trong `supabase/migrations/`.
