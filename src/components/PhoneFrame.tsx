'use client';

import React, { useState, useEffect } from 'react';
import DynamicIsland from './DynamicIsland';
import BottomNav, { TabType } from './BottomNav';
import ControlCenter from './ControlCenter';
import HomeView from './views/HomeView';
import AiChatView from './views/AiChatView';
import CryptoView from './views/CryptoView';
import FocusView from './views/FocusView';
import AppsView from './views/AppsView';
import { Smartphone, Monitor, Wifi, BatteryCharging, ShieldAlert } from 'lucide-react';

export default function PhoneFrame() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState<boolean>(false);

  // Focus Timer state shared with Dynamic Island
  const [focusTimerSeconds, setFocusTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Audio state shared with Dynamic Island
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<string>('Cyberwave Lofi 80s');

  // Customization state
  const [activeTheme, setActiveTheme] = useState<string>('oled');
  const [accentColor, setAccentColor] = useState<string>('#00F0FF');

  // Clock
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && focusTimerSeconds > 0) {
      interval = setInterval(() => {
        setFocusTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (focusTimerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, focusTimerSeconds]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = (newSec?: number) => {
    setIsTimerRunning(false);
    setFocusTimerSeconds(newSec ?? 25 * 60);
  };

  const toggleMusic = () => setIsPlayingMusic(!isPlayingMusic);

  const getThemeBackground = () => {
    if (activeTheme === 'cyber') return 'bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#070A10]';
    if (activeTheme === 'emerald') return 'bg-gradient-to-b from-[#064E3B] via-[#022C22] to-[#070A10]';
    return 'bg-[#070A10]';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      {/* Top Desktop Bar (Hidden on Mobile) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-sm mb-4 px-2 text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-white font-bold">OmniOS Mobile</span>
        </div>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center space-x-1.5 transition active:scale-95 shadow-md"
        >
          {isPhoneFrame ? <Monitor className="w-3.5 h-3.5 text-cyan-400" /> : <Smartphone className="w-3.5 h-3.5 text-pink-400" />}
          <span>{isPhoneFrame ? 'Full View' : 'Phone Frame'}</span>
        </button>
      </div>

      {/* Main Container: Native 100% on Mobile / Phone Frame on Desktop */}
      <div
        className={`relative transition-all duration-300 overflow-hidden flex flex-col ${
          isPhoneFrame
            ? 'w-full md:w-[395px] h-[100dvh] md:h-[840px] md:rounded-[50px] md:border-[10px] md:border-[#1E293B] md:shadow-[0_0_60px_rgba(0,240,255,0.15)] md:ring-1 md:ring-white/20'
            : 'w-full max-w-4xl h-[100dvh] md:h-[90vh] md:rounded-3xl md:border md:border-white/10'
        } ${getThemeBackground()}`}
      >
        {/* Flashlight screen overlay */}
        {isFlashlightOn && (
          <div className="absolute inset-0 bg-white z-[60] flex flex-col items-center justify-center text-black">
            <h2 className="text-xl font-black">TORCH ON</h2>
            <button
              onClick={() => setIsFlashlightOn(false)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold"
            >
              Turn Off
            </button>
          </div>
        )}

        {/* Mobile Status Bar */}
        <div className="w-full px-7 pt-3 pb-1 flex items-center justify-between text-xs font-mono text-white/90 select-none z-40">
          <span className="font-bold text-[13px] tracking-tight">{currentTime}</span>

          <div className="flex items-center space-x-2">
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5 text-[11px] font-bold">
              <span>5G</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span>98%</span>
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Dynamic Island */}
        <DynamicIsland
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={toggleMusic}
          currentSong={currentSong}
          focusTimerSeconds={focusTimerSeconds}
          isTimerRunning={isTimerRunning}
        />

        {/* Control Center Modal / Drawer */}
        <ControlCenter
          isOpen={isControlCenterOpen}
          onClose={() => setIsControlCenterOpen(false)}
          isFlashlightOn={isFlashlightOn}
          onToggleFlashlight={() => setIsFlashlightOn(!isFlashlightOn)}
        />

        {/* Active Tab View */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'home' && (
            <HomeView
              onOpenControlCenter={() => setIsControlCenterOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
          {activeTab === 'ai' && <AiChatView />}
          {activeTab === 'crypto' && <CryptoView />}
          {activeTab === 'focus' && (
            <FocusView
              secondsLeft={focusTimerSeconds}
              isRunning={isTimerRunning}
              onToggleTimer={toggleTimer}
              onResetTimer={resetTimer}
              isPlayingMusic={isPlayingMusic}
              onToggleMusic={toggleMusic}
              currentSong={currentSong}
              onSelectSong={(s) => setCurrentSong(s)}
            />
          )}
          {activeTab === 'apps' && (
            <AppsView
              activeTheme={activeTheme}
              onChangeTheme={(t) => setActiveTheme(t)}
              accentColor={accentColor}
              onChangeAccent={(c) => setAccentColor(c)}
            />
          )}
        </div>

        {/* Bottom Floating Navigation */}
        <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

        {/* iPhone Home Indicator Bar */}
        <div className="w-full flex justify-center pb-2 pt-1">
          <div className="w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
