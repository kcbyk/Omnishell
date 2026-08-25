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
    const query = searchParams.get('q');

    if (!query || !query.trim()) {
      return NextResponse.json({ tracks: [] });
    }

    const cleanQuery = query.trim();
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`;

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
          .replace(/\(Lyric.*?\)/gi, '')
          .replace(/Official Video/gi, '')
          .trim();

        const durationSeconds = parseDuration(durationText);
        const highResThumb = `https://i.ytimg.com/vi/${vr.videoId}/hqdefault.jpg`;

        tracks.push({
          id: `yt-${vr.videoId}`,
          youtubeId: vr.videoId,
          title: cleanTitle || rawTitle,
          artist: rawAuthor.replace(/ - Topic$/i, ''),
          album: 'YouTube Music Release',
          albumArt: highResThumb,
          duration: durationSeconds,
          audioUrl: `https://www.youtube.com/watch?v=${vr.videoId}`,
          plays: viewText,
          color: getRandomColor(vr.videoId),
          genre: 'YouTube Stream',
          isYouTube: true,
        });

        if (tracks.length >= 25) break;
      }
      if (tracks.length >= 25) break;
    }

    return NextResponse.json({ tracks });
  } catch (error: any) {
    console.error('YouTube Search API Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to search YouTube' }, { status: 500 });
  }
}
