import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { corsHeaders, handleOptions, jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') return handleOptions(origin);
  if (req.method !== 'GET') {
    return jsonResponse({ error: 'method not allowed' }, { status: 405 }, origin);
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return jsonResponse({ error: 'token is required' }, { status: 400 }, origin);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data, error } = await supabase
    .from('subscribers')
    .update({ confirmed_at: new Date().toISOString() })
    .eq('confirm_token', token)
    .is('confirmed_at', null)
    .select('email')
    .maybeSingle();

  if (error) {
    console.error('confirm update error', error);
    return jsonResponse({ error: 'internal error' }, { status: 500 }, origin);
  }

  if (!data) {
    return jsonResponse({ error: 'invalid or already used token' }, { status: 404 }, origin);
  }

  const siteUrl = Deno.env.get('SITE_URL') ?? 'http://localhost:3000';
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${siteUrl}/newsletter/confirmed`,
      ...corsHeaders(origin),
    },
  });
});
