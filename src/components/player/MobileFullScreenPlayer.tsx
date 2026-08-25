'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Repeat1,
  Share2,
  ListMusic,
  Laptop2,
  Mic2,
  Maximize2,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import confetti from 'canvas-confetti';

export default function MobileFullScreenPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    isShuffle,
    repeatMode,
    activePlaylist,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    isFullScreenPlayerOpen,
    setIsFullScreenPlayerOpen,
    setIsLyricsOpen,
    setIsQueueModalOpen,
  } = usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  if (!isFullScreenPlayerOpen || !currentTrack) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const liked = isLiked(currentTrack.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentTrack.title} by ${currentTrack.artist}`,
        text: `Listen to ${currentTrack.title} on Spotify!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      confetti({ particleCount: 30, spread: 50 });
      alert('Track link copied to clipboard!');
    }
  };

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${currentTrack.color || '#121212'} 0%, #121212 60%, #000000 100%)`,
      }}
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 select-none overflow-y-auto no-scrollbar animate-fadeIn"
    >
      {/* 1. Top Header */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setIsFullScreenPlayerOpen(false)}
          className="p-2 rounded-full hover:bg-white/10 text-white transition active:scale-95"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center overflow-hidden px-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/70 font-mono">
            Playing From Playlist
          </div>
          <div className="text-xs font-bold text-white truncate">
            {activePlaylist?.title || 'Spotify Top Hits'}
          </div>
        </div>

        <button
          onClick={() => setIsQueueModalOpen(true)}
          className="p-2 rounded-full hover:bg-white/10 text-white transition"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Big Album Art */}
      <div className="my-auto py-4 flex justify-center">
        <div className="w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 relative group">
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 3. Track Info & Like Button */}
      <div className="flex items-center justify-between pb-2">
        <div className="overflow-hidden pr-4">
          <h2 className="text-xl md:text-2xl font-black text-white truncate tracking-tight">
            {currentTrack.title}
          </h2>
          <p className="text-sm font-medium text-white/70 truncate mt-0.5">
            {currentTrack.artist}
          </p>
        </div>

        <button
          onClick={() => {
            toggleLike(currentTrack.id);
            if (!liked) {
              confetti({ particleCount: 35, spread: 60 });
            }
          }}
          className="p-2 text-white hover:scale-110 active:scale-90 transition"
        >
          <Heart
            className={`w-7 h-7 ${
              liked ? 'fill-[#1DB954] text-[#1DB954]' : 'text-white/80'
            }`}
          />
        </button>
      </div>

      {/* 4. Scrubber Timeline */}
      <div className="space-y-1.5 py-1">
        <div className="relative group flex items-center py-2 cursor-pointer">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={isScrubbing ? scrubValue : progress}
            onMouseDown={() => setIsScrubbing(true)}
            onTouchStart={() => setIsScrubbing(true)}
            onChange={(e) => setScrubValue(Number(e.target.value))}
            onMouseUp={(e) => {
              setIsScrubbing(false);
              seekTo(Number((e.target as HTMLInputElement).value));
            }}
            onTouchEnd={(e) => {
              setIsScrubbing(false);
              seekTo(Number((e.target as HTMLInputElement).value));
            }}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="flex justify-between text-[11px] font-mono text-white/60">
          <span>{formatTime(isScrubbing ? scrubValue : progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 5. Playback Controls Grid */}
      <div className="flex items-center justify-between py-3">
        <button
          onClick={toggleShuffle}
          className={`p-2 transition relative ${
            isShuffle ? 'text-[#1DB954]' : 'text-white/70 hover:text-white'
          }`}
        >
          <Shuffle className="w-5 h-5" />
          {isShuffle && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1DB954]" />}
        </button>

        <button
          onClick={prevTrack}
          className="p-2 text-white hover:scale-110 active:scale-95 transition"
        >
          <SkipBack className="w-8 h-8 fill-white" />
        </button>

        {/* Large Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition shadow-white/20"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-black" />
          ) : (
            <Play className="w-8 h-8 fill-black ml-1" />
          )}
        </button>

        <button
          onClick={nextTrack}
          className="p-2 text-white hover:scale-110 active:scale-95 transition"
        >
          <SkipForward className="w-8 h-8 fill-white" />
        </button>

        <button
          onClick={toggleRepeat}
          className={`p-2 transition relative ${
            repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-white/70 hover:text-white'
          }`}
        >
          {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          {repeatMode !== 'off' && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1DB954]" />
          )}
        </button>
      </div>

      {/* 6. Mini Lyrics Preview Card */}
      {currentTrack.lyrics && (
        <div
          onClick={() => setIsLyricsOpen(true)}
          className="mt-2 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md cursor-pointer hover:bg-black/50 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-bold text-white/80 pb-1">
            <span className="flex items-center gap-1.5 text-white">
              <Mic2 className="w-4 h-4 text-[#1DB954]" /> Lyrics
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#1DB954]">
              Expand Karaoke &gt;
            </span>
          </div>

          <p className="text-sm font-bold text-white line-clamp-2 mt-1 leading-snug">
            {currentTrack.lyrics[Math.min(currentTrack.lyrics.length - 1, Math.floor((progress / duration) * currentTrack.lyrics.length))]?.text || 'Tap to view live synchronized lyrics...'}
          </p>
        </div>
      )}

      {/* 7. Bottom Utility Bar */}
      <div className="flex items-center justify-between pt-4 text-white/70 text-xs">
        <button
          onClick={() => alert('Connected to Spotify HiFi Audio Engine')}
          className="flex items-center gap-1.5 hover:text-white transition"
        >
          <Laptop2 className="w-4 h-4 text-[#1DB954]" />
          <span className="text-[11px] font-medium">This Phone (Lossless)</span>
        </button>

        <div className="flex items-center gap-4">
          <button onClick={handleShare} className="hover:text-white transition">
            <Share2 className="w-5 h-5" />
          </button>
          <button onClick={() => setIsQueueModalOpen(true)} className="hover:text-white transition">
            <ListMusic className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
