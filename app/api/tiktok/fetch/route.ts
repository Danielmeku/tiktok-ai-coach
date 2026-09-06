import { NextResponse } from 'next/server';
import { fetchTikTokStats } from '@/lib/tiktokApi';

// Helper function to extract handle and fetch stats
async function handleTikTokFetch(handle: string | null) {
  if (!handle) {
    return NextResponse.json(
      { error: 'TikTok handle is required' },
      { status: 400 }
    );
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

// 1. GET Handler (for query params: ?handle=... or ?username=...)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle') || searchParams.get('username');
  return handleTikTokFetch(handle);
}

// 2. POST Handler (for JSON body: { handle: "..." } or { username: "..." })
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const handle = body.handle || body.username;
    return handleTikTokFetch(handle);
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid JSON request body' },
      { status: 400 }
    );
  }
}
