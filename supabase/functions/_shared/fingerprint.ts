// Fingerprint ẩn danh: SHA-256(ip + ua + salt), không lưu IP thô (docs/01-DATABASE.md).
export async function computeFingerprint(req: Request): Promise<string> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ua = req.headers.get('user-agent') ?? 'unknown';
  const salt = Deno.env.get('FINGERPRINT_SALT') ?? '';

  const data = new TextEncoder().encode(`${ip}|${ua}|${salt}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
