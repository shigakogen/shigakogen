import { createClient as createSupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

// Client anon key thuần, không đọc cookie — dùng cho các chỗ chạy ngoài
// request context (vd. generateStaticParams lúc build), nơi next/headers
// cookies() không khả dụng.
export function createStaticClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
