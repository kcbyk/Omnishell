'use client';

import React from 'react';
import { Home, Sparkles, TrendingUp, Compass, Grid, LucideIcon } from 'lucide-react';

export type TabType = 'home' | 'ai' | 'crypto' | 'focus' | 'apps';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: LucideIcon;
  badge?: string;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Hub', icon: Home, color: 'text-cyan-400' },
  { id: 'ai', label: 'OmniAI', icon: Sparkles, badge: 'PRO', color: 'text-pink-500' },
  { id: 'crypto', label: 'Finance', icon: TrendingUp, color: 'text-emerald-400' },
  { id: 'focus', label: 'Flow', icon: Compass, color: 'text-purple-400' },
  { id: 'apps', label: 'Forge', icon: Grid, color: 'text-amber-400' },
];

export default function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <div className="w-full px-4 py-3 bg-gradient-to-t from-[#070A10] via-[#0E131F]/90 to-transparent backdrop-blur-xl border-t border-white/5 relative z-40">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-3 rounded-2xl transition-all duration-300 ${
                isActive ? 'scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Ambient Glow Background */}
              {isActive && (
                <div className="absolute inset-0 bg-white/[0.06] rounded-2xl border border-white/10 shadow-lg shadow-cyan-500/5 -z-10 animate-fade-in" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? `${item.color} filter drop-shadow-[0_0_8px_currentColor]` : 'text-slate-400'
                  }`}
                />
                {item.badge && !isActive && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 bg-gradient-to-r from-pink-500 to-purple-600 text-[8px] font-bold text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Glowing bottom indicator dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_6px_#00F0FF]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
