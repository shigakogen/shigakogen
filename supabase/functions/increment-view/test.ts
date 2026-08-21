// Chạy: FUNCTIONS_URL=https://<project-ref>.supabase.co/functions/v1 deno test --allow-net --allow-env supabase/functions/increment-view/test.ts
import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

const BASE = Deno.env.get('FUNCTIONS_URL') ?? 'http://127.0.0.1:54321/functions/v1';
const HEADERS = {
  'content-type': 'application/json',
  'x-forwarded-for': '203.0.113.9',
  apikey: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
};

Deno.test('increment-view: happy path trả về views', async () => {
  const res = await fetch(`${BASE}/increment-view`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ slug: 'hello-world' }),
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assert(typeof body.views === 'number');
});

Deno.test('increment-view: gọi 2 lần cùng fingerprint không tăng 2 lần', async () => {
  const call = () =>
    fetch(`${BASE}/increment-view`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ slug: 'hello-world' }),
    }).then((r) => r.json());

  const first = await call();
  const second = await call();
  assertEquals(first.views, second.views);
});

Deno.test('increment-view: thiếu slug trả 400', async () => {
  const res = await fetch(`${BASE}/increment-view`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({}),
  });
  assertEquals(res.status, 400);
});

Deno.test('increment-view: slug không tồn tại trả 404', async () => {
  const res = await fetch(`${BASE}/increment-view`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ slug: 'khong-ton-tai-xyz' }),
  });
  assertEquals(res.status, 404);
});
