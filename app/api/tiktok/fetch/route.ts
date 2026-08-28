// STEP 3: Map video fields into dashboard format
    const metrics = itemList.map((item: any) => {
      // Convert Unix timestamp (seconds) to formatted date string
      const createTimeSec = item.createTime || item.video?.createTime;
      const formattedDate = createTimeSec 
        ? new Date(Number(createTimeSec) * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : 'Recent';

      return {
        id: item.id || item.video?.id || Math.random().toString(),
        title: item.desc || item.contents?.[0]?.desc || 'TikTok Video',
        date: formattedDate,
        views: Number(item.stats?.playCount || item.statsV2?.playCount || 0),
        likes: Number(item.stats?.diggCount || item.statsV2?.diggCount || 0),
        comments: Number(item.stats?.commentCount || item.statsV2?.commentCount || 0),
        shares: Number(item.stats?.shareCount || item.statsV2?.shareCount || 0),
      };
    });

    return NextResponse.json({ success: true, metrics });
