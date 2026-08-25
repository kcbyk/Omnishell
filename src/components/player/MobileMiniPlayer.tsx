'use client';

import React from 'react';
import { Play, Pause, Heart, Speaker } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function MobileMiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    togglePlay,
    toggleLike,
    isLiked,
    setIsFullScreenPlayerOpen,
  } = usePlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);

  return (
    <div className="md:hidden fixed bottom-16 left-2 right-2 z-40 select-none">
      <div
        onClick={() => setIsFullScreenPlayerOpen(true)}
        style={{
          backgroundColor: currentTrack.color ? `${currentTrack.color}dd` : '#242424dd',
        }}
        className="backdrop-blur-xl rounded-xl p-2 flex items-center justify-between shadow-2xl border border-white/10 relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      >
        {/* Track thumbnail and title */}
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            className={`w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-md ${
              isPlaying ? 'animate-pulse' : ''
            }`}
          />
          <div className="overflow-hidden pr-2">
            <div className="text-xs font-bold text-white truncate">{currentTrack.title}</div>
            <div className="text-[11px] text-white/70 truncate flex items-center gap-1.5 font-medium">
              <span className="truncate">{currentTrack.artist}</span>
            </div>
          </div>
        </div>

        {/* Right buttons: Like & Play */}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleLike(currentTrack.id)}
            className="p-2 text-white/80 hover:text-white transition"
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-[#1DB954] text-[#1DB954]' : ''}`} />
          </button>

          <button
            onClick={togglePlay}
            className="p-2 text-white hover:scale-110 active:scale-95 transition"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Bottom subtle progress line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-white transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}
