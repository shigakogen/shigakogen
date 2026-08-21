import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { computeFingerprint } from '../_shared/fingerprint.ts';
import { handleOptions, jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') return handleOptions(origin);
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method not allowed' }, { status: 405 }, origin);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'invalid json body' }, { status: 400 }, origin);
  }

  const slug = (body as { slug?: unknown }).slug;
  if (typeof slug !== 'string' || slug.length === 0) {
    return jsonResponse({ error: 'slug is required' }, { status: 400 }, origin);
  }

  const fingerprint = await computeFingerprint(req);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data, error } = await supabase.rpc('increment_view', {
    p_slug: slug,
    p_fingerprint: fingerprint,
  });

  if (error) {
    if (error.code === 'P0002' || error.message.includes('post not found')) {
      return jsonResponse({ error: 'post not found' }, { status: 404 }, origin);
    }
    console.error('increment-view rpc error', error);
    return jsonResponse({ error: 'internal error' }, { status: 500 }, origin);
  }

  return jsonResponse({ views: data }, { status: 200 }, origin);
});
