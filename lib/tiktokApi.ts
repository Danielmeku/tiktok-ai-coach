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
  const host = process.env.RAPIDAPI_HOST || 'tiktok-scraper7.p.rapidapi.com';
  const url = `https://${host}/user/posts?username=${encodeURIComponent(handle)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      'x-rapidapi-host': host,
    },
    next: { revalidate: 3600 } // Cache results for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch TikTok data: ${response.statusText}`);
  }

  const rawData = await response.json();

  // Safely extract video list depending on API payload structure
  const posts = rawData?.data?.videos || rawData?.itemList || [];

  return posts.map((item: any) => ({
    id: String(item.id || item.video_id || Math.random()),
    title: item.desc || item.title || 'Untitled',
    playCount: Number(item.stats?.playCount || item.play_count || 0),
    diggCount: Number(item.stats?.diggCount || item.digg_count || 0),
    commentCount: Number(item.stats?.commentCount || item.comment_count || 0),
    shareCount: Number(item.stats?.shareCount || item.share_count || 0),
    createdTime: Number(item.createTime || item.create_time || 0),
  }));
}
