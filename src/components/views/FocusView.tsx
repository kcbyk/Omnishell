'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CloudRain, Coffee, Radio, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusViewProps {
  secondsLeft: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: (newSeconds?: number) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  currentSong: string;
  onSelectSong: (song: string) => void;
}

export default function FocusView({
  secondsLeft,
  isRunning,
  onToggleTimer,
  onResetTimer,
  isPlayingMusic,
  onToggleMusic,
  currentSong,
  onSelectSong,
}: FocusViewProps) {
  const [activeDuration, setActiveDuration] = useState<number>(25 * 60);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((activeDuration - secondsLeft) / activeDuration) * 100;

  const setDuration = (mins: number) => {
    const secs = mins * 60;
    setActiveDuration(secs);
    onResetTimer(secs);
  };

  const soundscapes = [
    { title: 'Cyberwave Lofi 80s', icon: Radio, category: 'Synth' },
    { title: 'Neon Rain on Glass', icon: CloudRain, category: 'Nature' },
    { title: 'Tokyo Midnight Cafe', icon: Coffee, category: 'Ambient' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 no-scrollbar pb-24">
      {/* Top Header */}
      <div className="text-center pt-2">
        <span className="text-[10px] font-mono tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          FLOWSTATE PROTOCOL
        </span>
        <h2 className="text-xl font-black text-white mt-1">Deep Focus Studio</h2>
      </div>

      {/* Circular Timer Display */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative w-52 h-52 flex items-center justify-center">
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${
            isRunning ? 'bg-purple-500/20 shadow-2xl shadow-purple-500/30' : 'bg-transparent'
          }`} />

          {/* SVG Progress Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="104"
              cy="104"
              r="88"
              className="stroke-white/10 fill-none"
              strokeWidth="10"
            />
            <circle
              cx="104"
              cy="104"
              r="88"
              className="stroke-purple-500 fill-none transition-all duration-500"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>

          {/* Time & State Text */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-4xl font-black font-mono tracking-tight text-white">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[11px] font-mono text-purple-300/80 mt-1 uppercase tracking-wider">
              {isRunning ? 'Flow Active' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center space-x-3 mt-4">
          <button
            onClick={() => onResetTimer(activeDuration)}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition active:scale-95"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleTimer}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-purple-500/25 hover:opacity-90 active:scale-95 transition"
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            <span>{isRunning ? 'Pause Flow' : 'Start Focus'}</span>
          </button>
        </div>
      </div>

      {/* Preset Duration Chips */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: '25m Sprint', mins: 25 },
          { label: '50m Deep', mins: 50 },
          { label: '5m Rest', mins: 5 },
        ].map((item) => {
          const isSelected = activeDuration === item.mins * 60;
          return (
            <button
              key={item.mins}
              onClick={() => setDuration(item.mins)}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${
                isSelected
                  ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-md shadow-purple-500/10'
                  : 'bg-[#121826] border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Ambient Soundscapes Player */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Ambient Audio Stream
            </span>
          </div>
          <button
            onClick={onToggleMusic}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30"
          >
            {isPlayingMusic ? 'STREAMING' : 'OFFLINE'}
          </button>
        </div>

        <div className="space-y-2">
          {soundscapes.map((sound) => {
            const Icon = sound.icon;
            const isCurrent = currentSong === sound.title;
            return (
              <div
                key={sound.title}
                onClick={() => {
                  onSelectSong(sound.title);
                  if (!isPlayingMusic) onToggleMusic();
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isCurrent && isPlayingMusic
                    ? 'bg-purple-500/20 border-purple-500/50 text-white'
                    : 'bg-black/30 border-white/5 hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-lg ${isCurrent && isPlayingMusic ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">{sound.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{sound.category}</div>
                  </div>
                </div>

                {isCurrent && isPlayingMusic ? (
                  <div className="flex items-end space-x-0.5 h-3">
                    <span className="w-0.5 h-3 bg-purple-400 rounded-full animate-bounce"></span>
                    <span className="w-0.5 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                    <span className="w-0.5 h-3.5 bg-purple-300 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  </div>
                ) : (
                  <Play className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
