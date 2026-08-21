# 02 — Supabase Edge Functions

Chạy trên Deno. Base URL: `https://<project-ref>.supabase.co/functions/v1/<name>`

Mọi function đều dùng `SUPABASE_SERVICE_ROLE_KEY` (biến này Supabase tự inject) để gọi RPC, nên **bắt buộc** phải tự validate input và giới hạn CORS.

## Quy tắc chung

```ts
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",");

function cors(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "content-type, authorization, apikey",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Vary": "Origin",
  };
}
```

Mỗi function phải: xử lý `OPTIONS` preflight, validate body bằng Zod (hoặc check tay), trả lỗi dạng `{ "error": "message" }` với status phù hợp, log kèm request id.

---

## `increment-view`

```http
POST /functions/v1/increment-view
Content-Type: application/json

{ "slug": "hello-world" }
```

**200** → `{ "views": 1234 }`
**404** → bài không tồn tại hoặc chưa publish
**429** → vượt rate limit

Xử lý:
1. Lấy IP từ header `x-forwarded-for`, UA từ `user-agent`
2. Tính fingerprint SHA-256 kèm `FINGERPRINT_SALT`
3. Gọi RPC `increment_view(slug, fingerprint)`

---

## `react`

```http
POST /functions/v1/react
{ "slug": "hello-world", "type": "like" }
```

**200** → `{ "counts": { "like": 12, "insightful": 3 } }`

`type` chỉ nhận `"like"` hoặc `"insightful"`. Gọi RPC `toggle_reaction`.

---

## `search`

```http
GET /functions/v1/search?q=goroutine&limit=10
```

**200** → `{ "results": [{ "slug", "title", "summary", "published_at", "rank" }] }`

Query rỗng hoặc < 2 ký tự → trả `{ "results": [] }` chứ không lỗi. `limit` kẹp trong khoảng 1–50.

---

## `subscribe`

```http
POST /functions/v1/subscribe
{ "email": "a@b.com" }
```

**200** → `{ "ok": true }` (trả về giống nhau dù email đã tồn tại hay chưa — tránh lộ danh sách subscriber)

Xử lý:
1. Validate email
2. Upsert vào `subscribers`, lấy `confirm_token`
3. Gửi mail xác nhận qua Resend, link: `https://<domain>/confirm?token=<uuid>`
4. Nếu đã `confirmed_at` rồi thì không gửi lại mail

---

## `confirm`

```http
GET /functions/v1/confirm?token=<uuid>
```

Set `confirmed_at = now()`, redirect 302 về `/newsletter/confirmed`.

---

## Rate limiting

Supabase không có Redis sẵn. Chọn 1 trong 2:
- **Đơn giản:** dựa vào unique constraint trong DB (view/reaction đã tự chống trùng rồi) + giới hạn `subscribe` bằng bảng đếm theo IP hash.
- **Chuẩn hơn:** thêm Upstash Redis (free tier), token bucket 30 req/phút cho mỗi fingerprint.

Làm cách đơn giản trước, chỉ nâng cấp khi thật sự bị spam.

---

## Env cho Edge Functions

```bash
supabase secrets set FINGERPRINT_SALT=<random-32-bytes>
supabase secrets set ALLOWED_ORIGINS=https://your-domain.com,http://localhost:3000
supabase secrets set RESEND_API_KEY=<key>
supabase secrets set SITE_URL=https://your-domain.com
```

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` được Supabase tự inject — không cần set.

---

## Chạy local

```bash
supabase functions serve increment-view --env-file supabase/functions/.env.local
curl -X POST http://localhost:54321/functions/v1/increment-view \
  -H 'content-type: application/json' \
  -d '{"slug":"hello-world"}'
```

## Test

Mỗi function có file `test.ts` cạnh nó, chạy bằng `deno test --allow-all`. Tối thiểu test: happy path, input sai, slug không tồn tại, gọi 2 lần không tăng view 2 lần.
