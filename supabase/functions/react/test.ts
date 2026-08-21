// Chạy: FUNCTIONS_URL=https://<project-ref>.supabase.co/functions/v1 deno test --allow-net --allow-env supabase/functions/react/test.ts
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

const BASE = Deno.env.get('FUNCTIONS_URL') ?? 'http://127.0.0.1:54321/functions/v1';
const HEADERS = {
  'content-type': 'application/json',
  'x-forwarded-for': '203.0.113.10',
  apikey: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
};

Deno.test('react: bấm 2 lần thì toggle về như cũ', async () => {
  const call = () =>
    fetch(`${BASE}/react`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ slug: 'hello-world', type: 'like' }),
    }).then((r) => r.json());

  // Lần 1: thêm reaction "like" -> phải xuất hiện trong counts.
  const added = await call();
  assertEquals(added.counts.like, 1);

  // Lần 2 (cùng fingerprint): bỏ reaction -> counts.like biến mất, quay về trạng thái ban đầu.
  const removed = await call();
  assertEquals(removed.counts.like, undefined);
});

Deno.test('react: type không hợp lệ trả 400', async () => {
  const res = await fetch(`${BASE}/react`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ slug: 'hello-world', type: 'love' }),
  });
  assertEquals(res.status, 400);
});

Deno.test('react: thiếu slug trả 400', async () => {
  const res = await fetch(`${BASE}/react`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ type: 'like' }),
  });
  assertEquals(res.status, 400);
});

Deno.test('react: slug không tồn tại trả 404', async () => {
  const res = await fetch(`${BASE}/react`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ slug: 'khong-ton-tai-xyz', type: 'like' }),
  });
  assertEquals(res.status, 404);
});
