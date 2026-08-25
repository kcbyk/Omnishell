'use client';

import React, { useState } from 'react';
import {
  Wifi,
  Bluetooth,
  Flashlight,
  Moon,
  Sun,
  Volume2,
  Sliders,
  BatteryCharging,
  Radio,
  X,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  isFlashlightOn: boolean;
  onToggleFlashlight: () => void;
}

export default function ControlCenter({
  isOpen,
  onClose,
  isFlashlightOn,
  onToggleFlashlight,
}: ControlCenterProps) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(70);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-2xl p-5 flex flex-col justify-between animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold font-mono tracking-wider text-slate-200">CONTROL DECK</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Control Tiles */}
      <div className="grid grid-cols-2 gap-3 my-auto">
        {/* Network 2x2 group */}
        <div className="bg-[#121826]/90 border border-white/10 p-3 rounded-2xl grid grid-cols-2 gap-2">
          <button
            onClick={() => setWifi(!wifi)}
            className={`p-2.5 rounded-xl flex flex-col items-center justify-center transition-all ${
              wifi ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'bg-white/5 text-slate-400'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-1">Wi-Fi</span>
          </button>

          <button
            onClick={() => setBluetooth(!bluetooth)}
            className={`p-2.5 rounded-xl flex flex-col items-center justify-center transition-all ${
              bluetooth ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-slate-400'
            }`}
          >
            <Bluetooth className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-1">BT 5.4</span>
          </button>

          <button
            onClick={() => setAirplane(!airplane)}
            className={`p-2.5 rounded-xl flex flex-col items-center justify-center transition-all ${
              airplane ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-1">Air Mode</span>
          </button>

          <button
            onClick={onToggleFlashlight}
            className={`p-2.5 rounded-xl flex flex-col items-center justify-center transition-all ${
              isFlashlightOn ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/40' : 'bg-white/5 text-slate-400'
            }`}
          >
            <Flashlight className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-1">Torch</span>
          </button>
        </div>

        {/* Sliders Box */}
        <div className="bg-[#121826]/90 border border-white/10 p-3 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
              <span className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" /> Brightness
              </span>
              <span>{brightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-cyan-400" /> Volume
              </span>
              <span>{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Quick battery saver */}
        <button
          onClick={() => setLowPower(!lowPower)}
          className={`p-3 rounded-2xl border transition-all flex items-center space-x-3 ${
            lowPower
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-[#121826]/90 border-white/10 text-slate-300'
          }`}
        >
          <div className={`p-2 rounded-xl ${lowPower ? 'bg-amber-500 text-black' : 'bg-white/10'}`}>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold">Ultra Eco Mode</div>
            <div className="text-[10px] text-slate-400 font-mono">{lowPower ? 'Active (18h+)' : 'Standard'}</div>
          </div>
        </button>

        {/* Security Shield */}
        <div className="p-3 rounded-2xl bg-[#121826]/90 border border-emerald-500/30 text-emerald-300 flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold">Encrypted Node</div>
            <div className="text-[10px] text-emerald-400/80 font-mono">TLS 1.3 Secure</div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center">
        <p className="text-[10px] font-mono text-slate-500">OmniOS Cyberdeck v2.4 • Kernel 6.1-Next</p>
      </div>
    </div>
  );
}
