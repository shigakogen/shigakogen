import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

import { siteConfig } from '@/lib/site-config';

// Màu cứng (không đọc được CSS var trong Satori) khớp docs/04-DESIGN.md hue 30.
const BG = '#fdfbfb';
const FG = '#241a17';
const ACCENT = '#b2392b';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title')?.slice(0, 140) || siteConfig.name;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: BG,
        padding: 80,
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 28,
          fontWeight: 650,
          color: ACCENT,
        }}
      >
        {siteConfig.name}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 64,
          fontWeight: 650,
          lineHeight: 1.15,
          letterSpacing: -1.5,
          color: FG,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', fontSize: 24, color: FG, opacity: 0.6 }}>
        {siteConfig.description}
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
