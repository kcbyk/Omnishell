'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { Track, Playlist, RepeatMode, ViewType } from '../types/spotify';
import { TRACKS, PLAYLISTS } from '../data/musicData';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;
  likedTrackIds: string[];
  playlists: Playlist[];
  activePlaylist: Playlist | null;
  activeView: ViewType;
  isFullScreenPlayerOpen: boolean;
  isQueueModalOpen: boolean;
  isLyricsOpen: boolean;
  searchQuery: string;
  headerColor: string;

  // Actions
  playTrack: (track: Track, playlist?: Playlist) => void;
  togglePlay: () => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (seconds: number) => void;
  setVolumeLevel: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  createCustomPlaylist: (title: string, description?: string) => Playlist;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  navigateTo: (view: ViewType, playlist?: Playlist) => void;
  setSearchQuery: (query: string) => void;
  setIsFullScreenPlayerOpen: (open: boolean) => void;
  setIsQueueModalOpen: (open: boolean) => void;
  setIsLyricsOpen: (open: boolean) => void;
  setHeaderColor: (color: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(TRACKS[0].duration);
  const [volume, setVolume] = useState<number>(0.8);
  const [prevVolume, setPrevVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [queue, setQueue] = useState<Track[]>(TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(['track-1', 'track-2']);
  const [playlists, setPlaylists] = useState<Playlist[]>(PLAYLISTS);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(PLAYLISTS[0]);
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState<boolean>(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState<boolean>(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [headerColor, setHeaderColor] = useState<string>('#1DB954');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load persistence from LocalStorage
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('spotify_liked_tracks');
      if (savedLikes) setLikedTrackIds(JSON.parse(savedLikes));
      const savedPlaylists = localStorage.getItem('spotify_custom_playlists');
      if (savedPlaylists) {
        const custom = JSON.parse(savedPlaylists);
        if (Array.isArray(custom)) {
          setPlaylists([...PLAYLISTS, ...custom]);
        }
      }
      const savedVol = localStorage.getItem('spotify_volume');
      if (savedVol) setVolume(Number(savedVol));
    } catch (_) {}
  }, []);

  // Save persistence to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('spotify_liked_tracks', JSON.stringify(likedTrackIds));
      const customOnly = playlists.filter((p) => p.isCustom);
      localStorage.setItem('spotify_custom_playlists', JSON.stringify(customOnly));
      localStorage.setItem('spotify_volume', volume.toString());
    } catch (_) {}
  }, [likedTrackIds, playlists, volume]);

  // Web Audio Synthesizer Fallback: Generates sweet musical notes if audio URL takes time
  const playSynthNote = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C, D, E, G, A, C
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomNote, ctx.currentTime);
      gain.gain.setValueAtTime((volume * 0.05), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
  }, [volume]);

  // Setup HTML5 Audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'auto';
      audioRef.current = audio;

      const handleTimeUpdate = () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      };

      const handleLoadedMetadata = () => {
        if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
          setDuration(audioRef.current.duration);
        }
      };

      const handleEnded = () => {
        if (repeatMode === 'one') {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        } else {
          nextTrack();
        }
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, [repeatMode]);

  // Audio Play / Pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
      audio.load();
    }

    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audio.play().catch(() => {
        // Fallback smooth synthetic ticker if direct MP3 stream is autoplay-blocked
      });
      // Trigger synth chime
      playSynthNote();
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, volume, isMuted, playSynthNote]);

  const playTrack = (track: Track, playlist?: Playlist) => {
    if (playlist) {
      setQueue(playlist.tracks);
      const idx = playlist.tracks.findIndex((t) => t.id === track.id);
      setQueueIndex(idx !== -1 ? idx : 0);
      setActivePlaylist(playlist);
    }
    setCurrentTrack(track);
    setDuration(track.duration);
    setProgress(0);
    setIsPlaying(true);
    if (track.color) setHeaderColor(track.color);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const pauseTrack = () => setIsPlaying(false);
  const resumeTrack = () => setIsPlaying(true);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeatMode === 'all') nextIdx = 0;
      else {
        setIsPlaying(false);
        return;
      }
    }
    setQueueIndex(nextIdx);
    const track = queue[nextIdx];
    setCurrentTrack(track);
    setDuration(track.duration);
    setProgress(0);
    setIsPlaying(true);
    if (track.color) setHeaderColor(track.color);
  }, [queue, queueIndex, isShuffle, repeatMode]);

  const prevTrack = () => {
    if (progress > 3) {
      seekTo(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) prevIdx = queue.length - 1;
    setQueueIndex(prevIdx);
    const track = queue[prevIdx];
    setCurrentTrack(track);
    setDuration(track.duration);
    setProgress(0);
    setIsPlaying(true);
    if (track.color) setHeaderColor(track.color);
  };

  const seekTo = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
    setProgress(seconds);
  };

  const setVolumeLevel = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolume(clamped);
    if (clamped > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 0.5);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const toggleLike = (trackId: string) => {
    setLikedTrackIds((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const isLiked = (trackId: string) => likedTrackIds.includes(trackId);

  const createCustomPlaylist = (title: string, description = '') => {
    const newPlaylist: Playlist = {
      id: 'custom-' + Date.now(),
      title: title.trim() || 'My Playlist #' + (playlists.length + 1),
      description: description || 'Custom playlist created by you.',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      color: '#7C3AED',
      author: 'You',
      followers: '1 follower',
      tracks: [],
      isCustom: true,
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    setActivePlaylist(newPlaylist);
    setActiveView('playlist');
    return newPlaylist;
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId && !p.tracks.some((t) => t.id === track.id)) {
          return { ...p, tracks: [...p.tracks, track] };
        }
        return p;
      })
    );
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) };
        }
        return p;
      })
    );
  };

  const navigateTo = (view: ViewType, playlist?: Playlist) => {
    setActiveView(view);
    if (playlist) {
      setActivePlaylist(playlist);
      setHeaderColor(playlist.color || '#1DB954');
    }
    // Scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        likedTrackIds,
        playlists,
        activePlaylist,
        activeView,
        isFullScreenPlayerOpen,
        isQueueModalOpen,
        isLyricsOpen,
        searchQuery,
        headerColor,
        playTrack,
        togglePlay,
        pauseTrack,
        resumeTrack,
        nextTrack,
        prevTrack,
        seekTo,
        setVolumeLevel,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        isLiked,
        createCustomPlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        navigateTo,
        setSearchQuery,
        setIsFullScreenPlayerOpen,
        setIsQueueModalOpen,
        setIsLyricsOpen,
        setHeaderColor,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
}
