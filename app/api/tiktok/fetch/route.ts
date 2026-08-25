import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let handle = ''
  
  try {
    const body = await request.json()
    handle = body.handle || ''

    if (!handle) {
      return NextResponse.json({ error: 'Handle required' }, { status: 400 })
    }

    const cleanHandle = handle.replace('@', '')

    // Fall back to mock data if API key is missing
    if (!process.env.RAPIDAPI_KEY) {
      console.warn('RAPIDAPI_KEY missing. Returning mock data.')
      return NextResponse.json(getMockData(cleanHandle))
    }

    const response = await fetch(
      `https://${process.env.RAPIDAPI_HOST}/user/posts?uniqueId=${cleanHandle}&count=10`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': process.env.RAPIDAPI_HOST!,
        },
      }
    )

    const data = await response.json()
    const rawPosts = data?.data?.posts || data?.posts || data?.result || []

    if (!Array.isArray(rawPosts) || rawPosts.length === 0) {
      return NextResponse.json(getMockData(cleanHandle))
    }

    const metrics = rawPosts.map((post: any) => ({
      id: post.id || Math.random().toString(),
      caption: post.title || post.desc || 'TikTok Video',
      views: post.play_count || post.statistics?.play_count || 0,
      likes: post.digg_count || post.statistics?.digg_count || 0,
      comments: post.comment_count || post.statistics?.comment_count || 0,
      shares: post.share_count || post.statistics?.share_count || 0,
    }))

    return NextResponse.json({ success: true, metrics })
  } catch (error: any) {
    console.error('Fetch error:', error)
    return NextResponse.json(getMockData(handle))
  }
}

function getMockData(handle: string) {
  return {
    success: true,
    isMock: true,
    metrics: [
      { id: '1', caption: 'Top trading strategy for 2026 #trading #crypto', views: 14200, likes: 1200, comments: 84, shares: 45 },
      { id: '2', caption: 'How to manage risk in volatile markets', views: 8900, likes: 650, comments: 32, shares: 12 },
      { id: '3', caption: '3 mistakes every beginner trader makes', views: 25400, likes: 3100, comments: 190, shares: 210 },
    ],
  }
}
