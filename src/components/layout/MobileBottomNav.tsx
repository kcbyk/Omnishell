'use client';

import React from 'react';
import { Home, Search, Library, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { ViewType } from '../../types/spotify';

export default function MobileBottomNav() {
  const { activeView, navigateTo } = usePlayer();

  const navItems: { id: ViewType; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/95 to-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-30 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              isActive ? 'text-white font-bold' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}

      {/* Premium Tab */}
      <button
        onClick={() => alert('Spotify Premium: Unlimited skips, zero ads, offline audio.')}
        className="flex flex-col items-center justify-center flex-1 py-1 text-[#b3b3b3] hover:text-white transition-colors"
      >
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span className="text-[10px] mt-1 font-medium">Premium</span>
      </button>
    </nav>
  );
}
