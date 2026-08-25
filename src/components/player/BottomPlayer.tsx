'use client';

import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Volume1,
  Mic2,
  ListMusic,
  Maximize2,
  Laptop2,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    isLyricsOpen,
    setIsLyricsOpen,
    isQueueModalOpen,
    setIsQueueModalOpen,
    setIsFullScreenPlayerOpen,
  } = usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);

  return (
    <footer className="hidden md:flex h-20 bg-black border-t border-white/5 px-4 items-center justify-between select-none z-40 flex-shrink-0 text-[#b3b3b3]">
      {/* 1. Left: Track Info & Like */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[180px]">
        <div
          onClick={() => setIsFullScreenPlayerOpen(true)}
          className="relative group cursor-pointer w-14 h-14 rounded-md overflow-hidden flex-shrink-0 shadow-md"
        >
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            onClick={() => setIsFullScreenPlayerOpen(true)}
            className="text-sm font-semibold text-white hover:underline cursor-pointer truncate"
          >
            {currentTrack.title}
          </div>
          <div className="text-xs text-[#b3b3b3] hover:underline hover:text-white cursor-pointer truncate">
            {currentTrack.artist}
          </div>
        </div>

        <button
          onClick={() => toggleLike(currentTrack.id)}
          className={`p-1.5 transition-colors ${
            liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
          }`}
          title={liked ? 'Remove from Your Library' : 'Save to Your Library'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-[#1DB954]' : ''}`} />
        </button>
      </div>

      {/* 2. Center: Controls & Scrubber Timeline */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        {/* Buttons Row */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`p-1 transition-colors relative ${
              isShuffle ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title="Enable Shuffle"
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1DB954]" />}
          </button>

          <button
            onClick={prevTrack}
            className="text-[#b3b3b3] hover:text-white transition-colors"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play/Pause Main Button */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white hover:scale-105 active:scale-95 flex items-center justify-center text-black shadow-lg transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="text-[#b3b3b3] hover:text-white transition-colors"
            title="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-1 transition-colors relative ${
              repeatMode !== 'off' ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            {repeatMode !== 'off' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1DB954]" />
            )}
          </button>
        </div>

        {/* Scrubber Slider Bar */}
        <div className="w-full flex items-center gap-2 text-xs font-mono">
          <span className="w-9 text-right text-[11px] text-[#b3b3b3]">
            {formatTime(isScrubbing ? scrubValue : progress)}
          </span>

          <div className="relative flex-1 group flex items-center py-2 cursor-pointer">
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
              className="w-full h-1 bg-[#4d4d4d] group-hover:bg-[#5e5e5e] rounded-full appearance-none cursor-pointer accent-white group-hover:accent-[#1DB954] transition-colors"
            />
          </div>

          <span className="w-9 text-left text-[11px] text-[#b3b3b3]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Right: Lyrics, Queue, Volume, Fullscreen */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
        {/* Lyrics Button */}
        <button
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`p-1.5 rounded transition-colors ${
            isLyricsOpen ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
          }`}
          title="Karaoke Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue Button */}
        <button
          onClick={() => setIsQueueModalOpen(!isQueueModalOpen)}
          className={`p-1.5 rounded transition-colors ${
            isQueueModalOpen ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
          }`}
          title="Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Connect Device */}
        <button
          onClick={() => alert('Connected to Spotify Web Player (Lossless HiFi)')}
          className="p-1.5 text-[#b3b3b3] hover:text-white transition-colors"
          title="Connect to a device"
        >
          <Laptop2 className="w-4 h-4" />
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-2 group">
          <button onClick={toggleMute} className="text-[#b3b3b3] group-hover:text-white transition-colors">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolumeLevel(Number(e.target.value))}
            className="w-20 lg:w-24 h-1 bg-[#4d4d4d] group-hover:bg-[#5e5e5e] rounded-full appearance-none cursor-pointer accent-white group-hover:accent-[#1DB954] transition-all"
          />
        </div>

        {/* Fullscreen Player Modal */}
        <button
          onClick={() => setIsFullScreenPlayerOpen(true)}
          className="p-1.5 text-[#b3b3b3] hover:text-white transition-colors"
          title="Open Fullscreen View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
