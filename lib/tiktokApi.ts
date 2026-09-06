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
  const cleanHandle = handle.replace(/^@/, '').trim();

  if (!cleanHandle) {
    throw new Error('A valid TikTok username is required');
  }

  const host = process.env.RAPIDAPI_HOST || 'tiktok-api23.p.rapidapi.com';
  const apiKey = process.env.RAPIDAPI_KEY || '';

  const headers = {
    'x-rapidapi-key': apiKey,
    'x-rapidapi-host': host,
  };

  // STEP 1: Fetch user info to extract secUid
  const userUrl = `https://${host}/api/user/info?uniqueId=${encodeURIComponent(cleanHandle)}`;
  const userRes = await fetch(userUrl, { method: 'GET', headers, next: { revalidate: 3600 } });

  if (!userRes.ok) {
    const errorText = await userRes.text();
    throw new Error(`User lookup failed (${userRes.status}): ${errorText || userRes.statusText}`);
  }

  const userData = await userRes.json();
  const secUid = userData?.userInfo?.user?.secUid || userData?.data?.user?.secUid;

  if (!secUid) {
    throw new Error(`Could not locate user profile details for "${cleanHandle}"`);
  }

  // STEP 2: Fetch user posts using the retrieved secUid
  const postsUrl = `https://${host}/api/user/posts?secUid=${encodeURIComponent(secUid)}&count=35&cursor=0`;
  const postsRes = await fetch(postsUrl, { method: 'GET', headers, next: { revalidate: 3600 } });

  if (!postsRes.ok) {
    const errorText = await postsRes.text();
    throw new Error(`Posts lookup failed (${postsRes.status}): ${errorText || postsRes.statusText}`);
  }

  const postsData = await postsRes.json();

  // Extract posts array safely across possible RapidAPI wrappers
  const posts = 
    postsData?.data?.itemList || 
    postsData?.itemList || 
    postsData?.data?.videos || 
    postsData?.data || 
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
