export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  youtubeId?: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  albumArt: string;
  duration: number; // in seconds
  audioUrl: string;
  lyrics?: LyricLine[];
  color?: string;
  plays?: string;
  genre?: string;
  releaseYear?: number;
  isYouTube?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverArt: string;
  color: string;
  author: string;
  followers?: string;
  tracks: Track[];
  isCustom?: boolean;
}

export interface Category {
  id: string;
  title: string;
  color: string;
  coverArt: string;
  query?: string;
}

export type RepeatMode = 'off' | 'all' | 'one';
export type ViewType = 'home' | 'search' | 'library' | 'playlist' | 'liked' | 'lyrics';
