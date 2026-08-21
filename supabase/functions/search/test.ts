// Chạy: FUNCTIONS_URL=https://<project-ref>.supabase.co/functions/v1 deno test --allow-net --allow-env supabase/functions/search/test.ts
import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

const BASE = Deno.env.get('FUNCTIONS_URL') ?? 'http://127.0.0.1:54321/functions/v1';
const HEADERS = { apikey: Deno.env.get('SUPABASE_ANON_KEY') ?? '' };

Deno.test('search: từ khóa trong bài seed ra kết quả đúng', async () => {
  const res = await fetch(`${BASE}/search?q=hello`, { headers: HEADERS });
  assertEquals(res.status, 200);
  const body = await res.json();
  assert(body.results.some((r: { slug: string }) => r.slug === 'hello-world'));
});

Deno.test('search: query rỗng/quá ngắn trả results rỗng, không lỗi', async () => {
  const res = await fetch(`${BASE}/search?q=a`, { headers: HEADERS });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.results, []);
});

Deno.test('search: limit được kẹp trong 1..50', async () => {
  const res = await fetch(`${BASE}/search?q=hello&limit=999`, { headers: HEADERS });
  assertEquals(res.status, 200);
  const body = await res.json();
  assert(body.results.length <= 50);
});
