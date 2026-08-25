'use client';

import React, { useEffect, useRef } from 'react';
import { X, Mic2, Play, Pause, SkipBack, SkipForward, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function LyricsView() {
  const {
    currentTrack,
    progress,
    duration,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    isLyricsOpen,
    setIsLyricsOpen,
  } = usePlayer();

  const activeLineRef = useRef<HTMLDivElement | null>(null);

  const lyrics = currentTrack?.lyrics || [];

  // Find active line index based on current playback progress
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (progress >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Auto-scroll to active lyric line smoothly
  useEffect(() => {
    if (activeLineRef.current && isLyricsOpen) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, isLyricsOpen]);

  if (!isLyricsOpen || !currentTrack) return null;

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${currentTrack.color || '#7C3AED'} 0%, #0A0A0A 85%, #000000 100%)`,
      }}
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 select-none overflow-hidden animate-fadeIn"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            className="w-10 h-10 rounded-lg object-cover shadow-md"
          />
          <div>
            <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-white/70 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <button
          onClick={() => setIsLyricsOpen(false)}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition active:scale-95"
          title="Close Lyrics"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Lyrics Scrolling Area */}
      <div className="flex-1 overflow-y-auto py-12 px-2 space-y-8 no-scrollbar text-center max-w-2xl mx-auto flex flex-col justify-start">
        {lyrics.length === 0 ? (
          <div className="my-auto text-white/50 font-mono text-sm">
            No lyrics available for this track.
          </div>
        ) : (
          lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => seekTo(line.time)}
                className={`cursor-pointer transition-all duration-300 font-sans font-black ${
                  isActive
                    ? 'text-white text-2xl md:text-3xl scale-105 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                    : isPast
                    ? 'text-white/60 text-lg md:text-xl hover:text-white/80'
                    : 'text-white/30 text-lg md:text-xl hover:text-white/60'
                }`}
              >
                {line.text}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Mini Control Strip */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 max-w-md mx-auto w-full z-10">
        <button onClick={prevTrack} className="p-2 text-white/80 hover:text-white transition">
          <SkipBack className="w-6 h-6 fill-white" />
        </button>

        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-black" />
          ) : (
            <Play className="w-5 h-5 fill-black ml-0.5" />
          )}
        </button>

        <button onClick={nextTrack} className="p-2 text-white/80 hover:text-white transition">
          <SkipForward className="w-6 h-6 fill-white" />
        </button>
      </div>
    </div>
  );
}
