import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let handle = ''
  
  try {
    const body = await request.json()
    handle = body.handle || ''

    if (!handle) {
      return NextResponse.json({ error: 'Handle required' }, { status: 400 })
    }

    const cleanHandle = handle.replace('@', '').trim()

    if (!process.env.RAPIDAPI_KEY) {
      return NextResponse.json({ 
        error: 'RAPIDAPI_KEY environment variable is missing on Vercel.' 
      }, { status: 500 })
    }

    const headers = {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
    }

    // STEP 1: Get User Info to retrieve secUid
    const userResponse = await fetch(
      `https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${cleanHandle}`,
      { method: 'GET', headers }
    )

    if (!userResponse.ok) {
      const errText = await userResponse.text()
      return NextResponse.json({ 
        error: `User lookup failed (${userResponse.status}): ${errText}` 
      }, { status: userResponse.status })
    }

    const userData = await userResponse.json()
    const secUid = userData?.userInfo?.user?.secUid || userData?.user?.secUid

    // STEP 2: Fetch Posts using secUid if available, else fallback to uniqueId
    const postsUrl = secUid
      ? `https://tiktok-api23.p.rapidapi.com/api/user/posts?secUid=${encodeURIComponent(secUid)}&count=10&cursor=0`
      : `https://tiktok-api23.p.rapidapi.com/api/user/posts?uniqueId=${cleanHandle}&count=10&cursor=0`

    const postsResponse = await fetch(postsUrl, { method: 'GET', headers })
    const postsData = await postsResponse.json()

    // Parse items from multiple possible response properties
    const itemList = postsData?.itemList || postsData?.data?.itemList || postsData?.posts || []

    if (!Array.isArray(itemList) || itemList.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: `No public videos found for handle: @${cleanHandle}` 
      })
    }

    // STEP 3: Map video fields into dashboard format
    const metrics = itemList.map((item: any) => ({
      id: item.id || item.video?.id || Math.random().toString(),
      caption: item.desc || item.contents?.[0]?.desc || 'TikTok Video',
      views: item.stats?.playCount || item.statsV2?.playCount || 0,
      likes: item.stats?.diggCount || item.statsV2?.diggCount || 0,
      comments: item.stats?.commentCount || item.statsV2?.commentCount || 0,
      shares: item.stats?.shareCount || item.statsV2?.shareCount || 0,
    }))

    return NextResponse.json({ success: true, metrics })

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 })
  }
}
