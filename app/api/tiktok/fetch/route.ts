import { NextResponse } from 'next/server';
import { fetchTikTokStats } from '@/lib/tiktokApi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json({ error: 'TikTok handle is required' }, { status: 400 });
  }

  try {
    const metrics = await fetchTikTokStats(handle);
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error fetching data' },
      { status: 500 }
    );
  }
}
