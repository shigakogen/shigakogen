import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { handleOptions, jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') return handleOptions(origin);
  if (req.method !== 'GET') {
    return jsonResponse({ error: 'method not allowed' }, { status: 405 }, origin);
  }

  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  const limitParam = Number(url.searchParams.get('limit') ?? '10');
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), 50)
    : 10;

  if (q.trim().length < 2) {
    return jsonResponse({ results: [] }, { status: 200 }, origin);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data, error } = await supabase.rpc('search_posts', { p_query: q, p_limit: limit });

  if (error) {
    console.error('search rpc error', error);
    return jsonResponse({ error: 'internal error' }, { status: 500 }, origin);
  }

  return jsonResponse({ results: data }, { status: 200 }, origin);
});
