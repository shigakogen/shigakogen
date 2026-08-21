// Chạy: FUNCTIONS_URL=https://<project-ref>.supabase.co/functions/v1 deno test --allow-net --allow-env supabase/functions/subscribe/test.ts
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

const BASE = Deno.env.get('FUNCTIONS_URL') ?? 'http://127.0.0.1:54321/functions/v1';
const HEADERS = {
  'content-type': 'application/json',
  apikey: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
};

Deno.test('subscribe: happy path trả ok true', async () => {
  const res = await fetch(`${BASE}/subscribe`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ email: `test-${crypto.randomUUID()}@example.com` }),
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
});

Deno.test('subscribe: email sai định dạng trả 400', async () => {
  const res = await fetch(`${BASE}/subscribe`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ email: 'not-an-email' }),
  });
  assertEquals(res.status, 400);
});

Deno.test('subscribe: honeypot bị điền vẫn trả ok true (không lộ cơ chế chặn bot)', async () => {
  const res = await fetch(`${BASE}/subscribe`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ email: `bot-${crypto.randomUUID()}@example.com`, hp: 'im-a-bot' }),
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
});

Deno.test('subscribe: đăng ký lại email đã tồn tại vẫn trả ok true giống nhau', async () => {
  const email = `dup-${crypto.randomUUID()}@example.com`;
  const call = () =>
    fetch(`${BASE}/subscribe`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email }),
    }).then((r) => r.json());

  const first = await call();
  const second = await call();
  assertEquals(first, second);
});
