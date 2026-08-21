// Chạy: FUNCTIONS_URL=https://<project-ref>.supabase.co/functions/v1 deno test --allow-net --allow-env supabase/functions/confirm/test.ts
//
// Happy path (token hợp lệ) không test tự động được ở đây vì `subscribe`
// cố tình không trả confirm_token qua response (tránh lộ dữ liệu) — test
// thủ công qua Postman: lấy confirm_token bằng MCP/Supabase Studio sau khi
// gọi subscribe, rồi gọi GET /confirm?token=<token> đó.
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

const BASE = Deno.env.get('FUNCTIONS_URL') ?? 'http://127.0.0.1:54321/functions/v1';
const HEADERS = { apikey: Deno.env.get('SUPABASE_ANON_KEY') ?? '' };

Deno.test('confirm: thiếu token trả 400', async () => {
  const res = await fetch(`${BASE}/confirm`, { headers: HEADERS, redirect: 'manual' });
  assertEquals(res.status, 400);
});

Deno.test('confirm: token không hợp lệ trả 404', async () => {
  const res = await fetch(`${BASE}/confirm?token=${crypto.randomUUID()}`, {
    headers: HEADERS,
    redirect: 'manual',
  });
  assertEquals(res.status, 404);
});
