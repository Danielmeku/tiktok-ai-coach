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

    // 1. Verify Vercel environment variables
    if (!process.env.RAPIDAPI_KEY) {
      return NextResponse.json({ 
        error: 'RAPIDAPI_KEY environment variable is missing on Vercel.' 
      }, { status: 500 })
    }

    // 2. Fetch User Posts from tiktok-api23
    const response = await fetch(
      `https://tiktok-api23.p.rapidapi.com/api/user/posts?uniqueId=${cleanHandle}&count=10&cursor=0`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
        },
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ 
        error: `RapidAPI responded with status ${response.status}: ${errText}` 
      }, { status: response.status })
    }

    const data = await response.json()
    
    // Extract video list according to tiktok-api23 response shape
    const itemList = data?.itemList || data?.data?.itemList || []

    if (!itemList || itemList.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: `No public videos found for handle: @${cleanHandle}` 
      })
    }

    // Map actual TikTok fields
    const metrics = itemList.map((item: any) => ({
      id: item.id || item.video?.id,
      caption: item.desc || 'No caption',
      views: item.stats?.playCount || 0,
      likes: item.stats?.diggCount || 0,
      comments: item.stats?.commentCount || 0,
      shares: item.stats?.shareCount || 0,
    }))

    return NextResponse.json({ success: true, metrics })

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 })
  }
}
