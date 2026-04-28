import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Purge ALL cached data tags (Next.js 16 requires 2nd arg "max")
    revalidateTag('settings', 'max');
    revalidateTag('services', 'max');
    revalidateTag('key_clients', 'max');
    revalidateTag('branches', 'max');
    revalidateTag('entities', 'max');
    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}
