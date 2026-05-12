'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PixelTracker({ 
  metaPixelId,
  tiktokPixelId,
  snapchatPixelId
}: { 
  metaPixelId?: string;
  tiktokPixelId?: string;
  snapchatPixelId?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Meta / Facebook Pixel PageView
    if (metaPixelId && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }

    // 2. TikTok Pixel PageView
    if (tiktokPixelId && typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.page();
    }

    // 3. Snapchat Pixel PageView
    if (snapchatPixelId && typeof window !== 'undefined' && (window as any).snaptr) {
      (window as any).snaptr('track', 'PAGE_VIEW');
    }
  }, [pathname, searchParams, metaPixelId, tiktokPixelId, snapchatPixelId]);

  return null;
}
