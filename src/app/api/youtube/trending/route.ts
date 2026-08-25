import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function parseDuration(durationStr: string): number {
  if (!durationStr) return 210;
  const parts = durationStr.split(':').map((n) => parseInt(n, 10));
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  } else if (parts.length === 3) {
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  return 210;
}

function getRandomColor(seed: string): string {
  const colors = ['#1DB954', '#7C3AED', '#E11D48', '#0284C7', '#D97706', '#059669', '#EC4899', '#3B82F6', '#8B5CF6'];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category') || 'global';

    let query = 'Top Hits 2026 Official Music Video';
    if (category === 'turkish') query = 'Türkçe Pop Hit Şarkılar 2026';
    else if (category === 'lofi') query = 'Lofi Hip Hop Chill Beats Study';
    else if (category === 'synthwave') query = 'Synthwave Retrowave 80s';
    else if (category === 'rock') query = 'Classic Rock Greatest Hits';
    else if (category === 'edm') query = 'Festival EDM House Music 2026';

    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
      },
    });

    const html = await res.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/);

    if (!match) {
      return NextResponse.json({ tracks: [] });
    }

    const data = JSON.parse(match[1]);
    const sections =
      data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

    const tracks: any[] = [];

    for (const section of sections) {
      const items = section.itemSectionRenderer?.contents || [];
      for (const item of items) {
        const vr = item.videoRenderer;
        if (!vr || !vr.videoId) continue;

        const rawTitle = vr.title?.runs?.[0]?.text || '';
        const rawAuthor = vr.ownerText?.runs?.[0]?.text || 'YouTube Artist';
        const durationText = vr.lengthText?.simpleText || '3:30';
        const viewText = vr.viewCountText?.simpleText || '1M views';

        const cleanTitle = rawTitle
          .replace(/\[.*?\]/g, '')
          .replace(/\(Official.*?\)/gi, '')
          .replace(/\(Music Video.*?\)/gi, '')
          .replace(/\(Audio.*?\)/gi, '')
          .replace(/Official Video/gi, '')
          .trim();

        const durationSeconds = parseDuration(durationText);
        const highResThumb = `https://i.ytimg.com/vi/${vr.videoId}/hqdefault.jpg`;

        tracks.push({
          id: `yt-${vr.videoId}`,
          youtubeId: vr.videoId,
          title: cleanTitle || rawTitle,
          artist: rawAuthor.replace(/ - Topic$/i, ''),
          album: category.toUpperCase() + ' Playlist',
          albumArt: highResThumb,
          duration: durationSeconds,
          audioUrl: `https://www.youtube.com/watch?v=${vr.videoId}`,
          plays: viewText,
          color: getRandomColor(vr.videoId),
          genre: category,
          isYouTube: true,
        });

        if (tracks.length >= 15) break;
      }
      if (tracks.length >= 15) break;
    }

    return NextResponse.json({ tracks });
  } catch (error: any) {
    console.error('YouTube Trending API Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch trending' }, { status: 500 });
  }
}
