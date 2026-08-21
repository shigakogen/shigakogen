import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { handleOptions, jsonResponse } from '../_shared/cors.ts';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function sendConfirmationEmail(email: string, token: string): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const siteUrl = Deno.env.get('SITE_URL') ?? 'http://localhost:3000';
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping confirmation email send');
    return;
  }

  // Link trỏ thẳng vào Edge Function `confirm`, function này tự redirect
  // 302 về `${SITE_URL}/newsletter/confirmed` sau khi set confirmed_at.
  const confirmUrl = `${supabaseUrl}/functions/v1/confirm?token=${token}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Newsletter <newsletter@${new URL(siteUrl).hostname}>`,
      to: email,
      subject: 'Xác nhận đăng ký nhận bài viết',
      html: `<p>Bấm vào link sau để xác nhận đăng ký:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`,
    }),
  });

  if (!res.ok) {
    console.error('resend send failed', res.status, await res.text());
  }
}

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

  const { email, hp } = body as { email?: unknown; hp?: unknown };

  // Honeypot: field ẩn trong form, bot thường tự điền vào. Người thật để trống.
  // Trả về "ok" y hệt path bình thường để không lộ cơ chế phát hiện bot.
  if (typeof hp === 'string' && hp.length > 0) {
    return jsonResponse({ ok: true }, { status: 200 }, origin);
  }

  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return jsonResponse({ error: 'invalid email' }, { status: 400 }, origin);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: existing, error: fetchError } = await supabase
    .from('subscribers')
    .select('confirm_token, confirmed_at')
    .eq('email', email)
    .maybeSingle();

  if (fetchError) {
    console.error('subscribe fetch error', fetchError);
    return jsonResponse({ error: 'internal error' }, { status: 500 }, origin);
  }

  if (existing) {
    if (!existing.confirmed_at) {
      await sendConfirmationEmail(email, existing.confirm_token);
    }
    return jsonResponse({ ok: true }, { status: 200 }, origin);
  }

  const { data: inserted, error: insertError } = await supabase
    .from('subscribers')
    .insert({ email })
    .select('confirm_token')
    .single();

  if (insertError || !inserted) {
    console.error('subscribe insert error', insertError);
    return jsonResponse({ error: 'internal error' }, { status: 500 }, origin);
  }

  await sendConfirmationEmail(email, inserted.confirm_token);

  return jsonResponse({ ok: true }, { status: 200 }, origin);
});
