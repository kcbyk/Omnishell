'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Search, User, Sparkles, Download, Bell } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function TopNav() {
  const { activeView, navigateTo, searchQuery, setSearchQuery, headerColor } = usePlayer();

  return (
    <header
      style={{ backgroundColor: activeView === 'home' || activeView === 'playlist' ? 'rgba(18, 18, 18, 0.7)' : '#121212' }}
      className="sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center justify-between backdrop-blur-md select-none transition-colors duration-500 border-b border-white/5"
    >
      {/* Left: History Nav & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => navigateTo('home')}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            title="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateTo('search')}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            title="Go Forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Global Instant Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b3b3b3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'search') navigateTo('search');
            }}
            onFocus={() => {
              if (activeView !== 'search') navigateTo('search');
            }}
            placeholder="What do you want to play?"
            className="w-full h-10 pl-10 pr-4 bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] border border-transparent focus:border-white/20 rounded-full text-xs md:text-sm text-white placeholder-[#b3b3b3] focus:outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => alert('Spotify Premium Activated! Enjoy lossless 320kbps audio & zero ads.')}
          className="hidden md:inline-flex px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs hover:scale-105 active:scale-95 transition-transform"
        >
          Explore Premium
        </button>

        <button
          onClick={() => alert('App ready in browser! Tap "Add to Home Screen" on mobile for full PWA.')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white font-bold text-xs hover:scale-105 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>

        <button
          onClick={() => navigateTo('library')}
          className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#282828] border border-white/10 flex items-center justify-center text-white transition-transform hover:scale-105"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
