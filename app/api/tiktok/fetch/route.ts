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

    // Helper to safely parse JSON responses
    const fetchJsonSafely = async (url: string) => {
      const res = await fetch(url, { method: 'GET', headers })
      const text = await res.text()
      try {
        return { ok: res.ok, status: res.status, data: JSON.parse(text) }
      } catch {
        return { ok: false, status: res.status, rawText: text }
      }
    }

    // STEP 1: Look up user info to get secUid
    const userResult = await fetchJsonSafely(
      `https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${cleanHandle}`
    )

    if (!userResult.ok) {
      return NextResponse.json({ 
        error: `User info fetch failed (${userResult.status}): ${userResult.rawText || 'Empty/Invalid JSON from API'}` 
      }, { status: userResult.status || 500 })
    }

    const userData = userResult.data
    const secUid = userData?.userInfo?.user?.secUid || userData?.user?.secUid

    // STEP 2: Fetch Posts using secUid if available, else uniqueId
    const postsUrl = secUid
      ? `https://tiktok-api23.p.rapidapi.com/api/user/posts?secUid=${encodeURIComponent(secUid)}&count=10&cursor=0`
      : `https://tiktok-api23.p.rapidapi.com/api/user/posts?uniqueId=${cleanHandle}&count=10&cursor=0`

    const postsResult = await fetchJsonSafely(postsUrl)

    if (!postsResult.ok) {
      return NextResponse.json({ 
        error: `Posts fetch failed (${postsResult.status}): ${postsResult.rawText || 'Empty/Invalid JSON from API'}` 
      }, { status: postsResult.status || 500 })
    }

    const postsData = postsResult.data
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
