'use client';

import React from 'react';
import { X, Settings, RotateCcw } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { STARTER_TEMPLATES } from '../utils/templates';

export default function SettingsModal() {
  const {
    isSettingsModalOpen,
    closeSettingsModal,
    fontSize,
    setFontSize,
    wordWrap,
    setWordWrap,
    autoRun,
    setAutoRun,
    loadTemplate,
  } = useEditor();

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0E131F] border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2 text-white font-mono font-bold text-xs">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>EDITOR PREFERENCES</span>
          </div>
          <button
            onClick={closeSettingsModal}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Font Size */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300 font-mono">
            <span>Font Size</span>
            <span className="text-cyan-400 font-bold">{fontSize}px</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[12, 14, 16, 18].map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`py-1.5 rounded-xl text-xs font-mono font-bold border transition ${
                  fontSize === size
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-[#121826] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        {/* Word Wrap Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-white/5">
          <div>
            <div className="text-xs font-medium text-white">Word Wrap</div>
            <div className="text-[10px] text-slate-400">Wrap long lines of code</div>
          </div>
          <input
            type="checkbox"
            checked={wordWrap}
            onChange={(e) => setWordWrap(e.target.checked)}
            className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
          />
        </div>

        {/* Auto Run Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-white/5">
          <div>
            <div className="text-xs font-medium text-white">Live Auto-Run</div>
            <div className="text-[10px] text-slate-400">Rebuild sandbox while typing</div>
          </div>
          <input
            type="checkbox"
            checked={autoRun}
            onChange={(e) => setAutoRun(e.target.checked)}
            className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
          />
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            if (confirm('Reset to default template? Unsaved changes will be discarded.')) {
              loadTemplate(STARTER_TEMPLATES[0]);
              closeSettingsModal();
            }
          }}
          className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Project to Default</span>
        </button>
      </div>
    </div>
  );
}
