import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { handle } = await request.json()

    if (!handle) {
      return NextResponse.json({ error: 'TikTok handle is required' }, { status: 400 })
    }

    // Clean handle to remove '@' if present
    const cleanHandle = handle.replace('@', '')

    // 1. Fetch User Profile & Recent Posts from RapidAPI
    const response = await fetch(
      `https://${process.env.RAPIDAPI_HOST}/user/posts?unique_id=${cleanHandle}&count=10`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': process.env.RAPIDAPI_HOST!,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`RapidAPI responded with status ${response.status}`)
    }

    const data = await response.json()

    // 2. Format key metrics for your dashboard & AI prompts
    const posts = data?.data?.posts || []
    const processedMetrics = posts.map((post: any) => ({
      id: post.id,
      caption: post.title,
      views: post.play_count,
      likes: post.digg_count,
      comments: post.comment_count,
      shares: post.share_count,
      createdTime: post.create_time,
    }))

    return NextResponse.json({
      success: true,
      handle: cleanHandle,
      totalVideosAnalyzed: processedMetrics.length,
      metrics: processedMetrics,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch TikTok data' },
      { status: 500 }
    )
  }
}
