'use client';

import React, { useState } from 'react';
import {
  Palette,
  Smartphone,
  Shield,
  Download,
  Share2,
  HardDrive,
  Info,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppsViewProps {
  activeTheme: string;
  onChangeTheme: (theme: string) => void;
  accentColor: string;
  onChangeAccent: (color: string) => void;
}

export default function AppsView({
  activeTheme,
  onChangeTheme,
  accentColor,
  onChangeAccent,
}: AppsViewProps) {
  const [copied, setCopied] = useState(false);

  const wallpapers = [
    { id: 'oled', name: 'OLED Void', bg: 'bg-[#070A10]', border: 'border-cyan-500/40' },
    { id: 'cyber', name: 'Cyber Neon', bg: 'bg-gradient-to-br from-[#0F172A] to-[#1E1B4B]', border: 'border-pink-500/40' },
    { id: 'emerald', name: 'Matrix Green', bg: 'bg-gradient-to-br from-[#064E3B] to-[#022C22]', border: 'border-emerald-500/40' },
  ];

  const accents = [
    { name: 'Cyan', hex: '#00F0FF', class: 'bg-[#00F0FF]' },
    { name: 'Pink', hex: '#FF0055', class: 'bg-[#FF0055]' },
    { name: 'Green', hex: '#00FF66', class: 'bg-[#00FF66]' },
    { name: 'Purple', hex: '#9D00FF', class: 'bg-[#9D00FF]' },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'OmniOS Next.js Mobile Web Experience',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      confetti({ particleCount: 40, spread: 50 });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 no-scrollbar pb-24">
      {/* Top Header */}
      <div className="pt-2">
        <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
          CUSTOMIZATION & FORGE
        </div>
        <h2 className="text-xl font-black text-white mt-0.5">Widget & Theme Lab</h2>
      </div>

      {/* Wallpaper Switcher */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-white/10">
        <div className="flex items-center space-x-2 mb-3">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white font-mono uppercase">Wallpaper Theme</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              onClick={() => onChangeTheme(w.id)}
              className={`h-20 rounded-xl p-2 flex flex-col justify-end border transition-all ${w.bg} ${
                activeTheme === w.id ? `${w.border} ring-2 ring-cyan-400/50 scale-105` : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <span className="text-[10px] font-bold text-white font-mono">{w.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color Picker */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-white/10">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-bold text-white font-mono uppercase">Neon Accent Glow</span>
        </div>

        <div className="flex items-center justify-around">
          {accents.map((acc) => (
            <button
              key={acc.name}
              onClick={() => onChangeAccent(acc.hex)}
              className={`w-10 h-10 rounded-2xl ${acc.class} flex items-center justify-center transition-transform ${
                accentColor === acc.hex ? 'scale-110 ring-4 ring-white/30 shadow-lg' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {accentColor === acc.hex && <Check className="w-5 h-5 text-black stroke-[3]" />}
            </button>
          ))}
        </div>
      </div>

      {/* PWA & Mobile Web Installation */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121826] to-[#1E293B] border border-white/10">
        <div className="flex items-center space-x-2 mb-2 text-cyan-400">
          <Smartphone className="w-4 h-4" />
          <span className="text-xs font-bold font-mono uppercase">PWA Mobile Integration</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          This Next.js app runs directly as an installable standalone Web App on iOS & Android. Open your browser menu and tap <strong className="text-cyan-400">"Add to Home Screen"</strong> for full-screen native feel.
        </p>

        <button
          onClick={handleShare}
          className="w-full mt-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center space-x-2 active:scale-95 transition"
        >
          <Share2 className="w-4 h-4" />
          <span>{copied ? 'Link Copied to Clipboard!' : 'Share Mobile Link'}</span>
        </button>
      </div>

      {/* System Node Info */}
      <div className="p-4 rounded-2xl bg-[#0E131F] border border-white/5 space-y-2 text-xs font-mono">
        <div className="flex items-center space-x-2 text-slate-400 mb-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold">SYSTEM RUNTIME DIAGNOSTICS</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Framework</span>
          <span className="text-cyan-400 font-bold">Next.js 14 (App Router)</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Rendering Engine</span>
          <span className="text-emerald-400 font-bold">Tailwind JIT + React 18</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Target Architecture</span>
          <span className="text-white">Mobile-First Touch & Gestures</span>
        </div>
      </div>
    </div>
  );
}
