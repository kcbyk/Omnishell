'use client';

import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Shield,
  Zap,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Flame,
  Battery,
  Cpu,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomeViewProps {
  onOpenControlCenter: () => void;
  onNavigateTab: (tab: 'home' | 'ai' | 'crypto' | 'focus' | 'apps') => void;
}

export default function HomeView({ onOpenControlCenter, onNavigateTab }: HomeViewProps) {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [habits, setHabits] = useState([
    { id: 1, title: 'Code Next.js Project', done: true, points: 50 },
    { id: 2, title: 'Drink 2L Clean Water', done: true, points: 20 },
    { id: 3, title: '45m Gym / Cardio Workout', done: false, points: 100 },
    { id: 4, title: 'Read 20 pages Architecture', done: false, points: 40 },
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextState = !h.done;
          if (nextState) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#00F0FF', '#FF0055', '#00FF66'],
            });
          }
          return { ...h, done: nextState };
        }
        return h;
      })
    );
  };

  const completedCount = habits.filter((h) => h.done).length;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 no-scrollbar pb-24">
      {/* Top Header Card */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>SYSTEM ONLINE</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight mt-0.5">Welcome, Pilot</h1>
        </div>

        {/* Quick buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenControlCenter}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition active:scale-95 shadow-md"
            title="Open Control Deck"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Weather & Live Widget Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weather card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#121826] to-[#1A2234] border border-cyan-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between">
            <CloudSun className="w-6 h-6 text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-300/80 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              AQI 24
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">24°C</div>
            <div className="text-[11px] font-medium text-slate-300">Balıkesir • Clear Sky</div>
          </div>
        </div>

        {/* Dynamic Streak card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#121826] to-[#251522] border border-pink-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between">
            <Flame className="w-6 h-6 text-pink-500" />
            <span className="text-[10px] font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
              14 DAYS
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-white font-mono">Streak 🔥</div>
            <div className="text-[11px] font-medium text-slate-300">Level 8 Cyber Monk</div>
          </div>
        </div>
      </div>

      {/* Cyber Wallet Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-tr from-[#0E131F] via-[#161F33] to-[#0A101D] border border-white/10 shadow-xl shadow-black/40 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Shield className="w-3.5 h-3.5" /> OmniOS Vault
          </span>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            +18.4% (24h)
          </span>
        </div>

        <div className="mt-3">
          <div className="text-xs text-slate-400 uppercase tracking-widest font-mono">Total Balance</div>
          <div className="text-3xl font-black text-white font-mono tracking-tight mt-1">
            $42,890<span className="text-cyan-400 text-xl">.50</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5">
          <button
            onClick={() => onNavigateTab('crypto')}
            className="py-2.5 px-3 rounded-xl bg-cyan-400 text-black font-bold text-xs flex items-center justify-center space-x-1 hover:bg-cyan-300 active:scale-95 transition shadow-lg shadow-cyan-400/20"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Send / Swap</span>
          </button>
          <button
            onClick={() => onNavigateTab('ai')}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center space-x-1 active:scale-95 transition border border-white/10"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Ask OmniAI</span>
          </button>
        </div>
      </div>

      {/* Habits / Daily Quests */}
      <div className="p-4 rounded-2xl bg-[#121826]/80 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white tracking-wider font-mono uppercase">Daily Quests</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {completedCount} / {habits.length} Complete
          </span>
        </div>

        {/* Habit List */}
        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                habit.done
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {habit.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
                <span className={`text-xs font-medium ${habit.done ? 'line-through text-slate-400' : ''}`}>
                  {habit.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                +{habit.points} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live System Specs Bar */}
      <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-white/5 flex items-center justify-around text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] text-slate-400">CPU Load</div>
            <div className="font-bold text-white">28% (8-Core)</div>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center space-x-2">
          <Battery className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400">Battery</div>
            <div className="font-bold text-white">98% Ultra</div>
          </div>
        </div>
      </div>
    </div>
  );
}
