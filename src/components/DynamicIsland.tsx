'use client';

import React, { useState } from 'react';
import { Music, Play, Pause, Timer, Bell, BatteryCharging, ChevronUp } from 'lucide-react';

interface DynamicIslandProps {
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  currentSong: string;
  focusTimerSeconds: number;
  isTimerRunning: boolean;
}

export default function DynamicIsland({
  isPlayingMusic,
  onToggleMusic,
  currentSong,
  focusTimerSeconds,
  isTimerRunning,
}: DynamicIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full flex justify-center items-center py-2 relative z-50">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`bg-black/90 border border-white/10 text-white rounded-[26px] cursor-pointer transition-all duration-300 ease-out shadow-2xl overflow-hidden flex flex-col items-center justify-between ${
          isExpanded
            ? 'w-[92%] h-[155px] p-4 bg-black/95 border-cyan-500/40 shadow-cyan-500/10'
            : isPlayingMusic || isTimerRunning
            ? 'w-[210px] h-[34px] px-3.5 py-1.5'
            : 'w-[125px] h-[30px] px-3 py-1'
        }`}
      >
        {/* Compact View */}
        {!isExpanded && (
          <div className="w-full h-full flex items-center justify-between text-xs font-mono">
            {isPlayingMusic ? (
              <>
                <div className="flex items-center space-x-1.5">
                  <Music className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-200 truncate max-w-[90px]">
                    {currentSong}
                  </span>
                </div>
                {/* Mini audio equalizer bars */}
                <div className="flex items-end space-x-0.5 h-3">
                  <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
                  <span className="w-0.5 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                  <span className="w-0.5 h-3.5 bg-cyan-300 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full"></span>
                </div>
              </>
            ) : isTimerRunning ? (
              <>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <Timer className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Focus</span>
                </div>
                <span className="text-[11px] font-mono text-white font-bold">
                  {formatTimer(focusTimerSeconds)}
                </span>
              </>
            ) : (
              <div className="w-full flex items-center justify-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/80"></div>
                <span className="text-[10px] text-slate-400 font-sans font-medium tracking-wider">OMNI-ISLAND</span>
              </div>
            )}
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div className="w-full h-full flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">{currentSong}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Cyberwave Soundscape • High Res</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Wave & Timer stats */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 py-1">
              <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5" /> 98% Ultra Charged
              </span>
              {isTimerRunning && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                  <Timer className="w-3.5 h-3.5" /> {formatTimer(focusTimerSeconds)}
                </span>
              )}
            </div>

            {/* Expanded Controls */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 font-mono">01:42 / 04:20</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={onToggleMusic}
                  className="w-9 h-9 rounded-full bg-cyan-400 text-black flex items-center justify-center hover:bg-cyan-300 active:scale-95 transition font-bold shadow-lg shadow-cyan-400/30"
                >
                  {isPlayingMusic ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
