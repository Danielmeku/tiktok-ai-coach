export interface TikTokVideoMetric {
  id: string;
  title: string;
  playCount: number;
  diggCount: number; // Likes
  commentCount: number;
  shareCount: number;
  createdTime: number;
}

export async function fetchTikTokStats(handle: string): Promise<TikTokVideoMetric[]> {
  // 1. Strip leading '@' symbol and whitespace to prevent API 404s
  const cleanHandle = handle.replace(/^@/, '').trim();

  // 2. Updated host to match your active RapidAPI service
  const host = process.env.RAPIDAPI_HOST || 'tiktok-api23.p.rapidapi.com';
  
  // 3. Updated endpoint & query param key ('uniqueId') matching tiktok-api23
  const url = `https://${host}/api/user/info?uniqueId=${encodeURIComponent(cleanHandle)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      'x-rapidapi-host': host,
    },
    next: { revalidate: 3600 } // Cache results for 1 hour
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch TikTok data (${response.status}): ${errorText || response.statusText}`);
  }

  const rawData = await response.json();

  // 4. Safely extract video array across multiple common response structures
  const posts = 
    rawData?.data?.videos || 
    rawData?.itemList || 
    rawData?.data?.itemList || 
    rawData?.user?.posts || 
    [];

  return posts.map((item: any) => ({
    id: String(item.id || item.video_id || item.aweme_id || Math.random()),
    title: item.desc || item.title || item.share_info?.share_desc || 'Untitled',
    playCount: Number(item.stats?.playCount || item.play_count || item.statistics?.play_count || 0),
    diggCount: Number(item.stats?.diggCount || item.digg_count || item.statistics?.digg_count || 0),
    commentCount: Number(item.stats?.commentCount || item.comment_count || item.statistics?.comment_count || 0),
    shareCount: Number(item.stats?.shareCount || item.share_count || item.statistics?.share_count || 0),
    createdTime: Number(item.createTime || item.create_time || 0),
  }));
}
