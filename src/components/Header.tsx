'use client';

import React from 'react';
import {
  Menu,
  Play,
  Columns,
  Code2,
  Eye,
  Terminal,
  Download,
  FolderTree,
  Sparkles,
  Settings,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

export default function Header() {
  const {
    viewMode,
    setViewMode,
    runPreview,
    toggleSidebar,
    toggleConsole,
    openAiTerminal,
    isConsoleOpen,
    consoleLogs,
    openTemplateModal,
    openSettingsModal,
    exportProjectZip,
  } = useEditor();

  const errorCount = consoleLogs.filter((l) => l.type === 'error').length;

  return (
    <header className="h-12 bg-[#0B0F19] border-b border-[#1E293B] px-3 flex items-center justify-between select-none z-30">
      {/* Left: Sidebar Toggle & Brand */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg bg-[#161F33] hover:bg-[#1E293B] text-slate-300 transition active:scale-95"
          title="Toggle File Explorer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1.5 cursor-pointer" onClick={openTemplateModal}>
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-[11px] text-black shadow-md shadow-cyan-400/20">
            S
          </div>
          <span className="font-mono font-bold text-xs tracking-wider text-white flex items-center gap-1">
            SPCK<span className="text-cyan-400">.DEV</span>
          </span>
        </div>

        {/* AI Terminal Button */}
        <button
          onClick={openAiTerminal}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition active:scale-95 shadow-sm"
          title="Open AI Agent Terminal"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Terminal</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* Center: View Switcher (Desktop & Mobile) */}
      <div className="flex items-center bg-[#121826] border border-[#1E293B] p-0.5 rounded-lg text-xs">
        <button
          onClick={() => setViewMode('editor')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
            viewMode === 'editor' ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Code Editor"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Code</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`hidden md:flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
            viewMode === 'split' ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Split View"
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>

        <button
          onClick={() => setViewMode('preview')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
            viewMode === 'preview' ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Live Preview"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Preview</span>
        </button>
      </div>

      {/* Right: Actions (Run, Console, Export, Settings) */}
      <div className="flex items-center space-x-1.5">
        {/* Run Button */}
        <button
          onClick={runPreview}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition"
          title="Run / Rebuild Project"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Run</span>
        </button>

        {/* Console Drawer Button */}
        <button
          onClick={toggleConsole}
          className={`relative p-1.5 rounded-lg border transition ${
            isConsoleOpen
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
              : 'bg-[#161F33] border-transparent text-slate-400 hover:text-slate-200'
          }`}
          title="DevTools Console"
        >
          <Terminal className="w-4 h-4" />
          {errorCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {errorCount}
            </span>
          )}
        </button>

        {/* Export ZIP */}
        <button
          onClick={exportProjectZip}
          className="p-1.5 rounded-lg bg-[#161F33] hover:bg-[#1E293B] text-slate-400 hover:text-slate-200 transition"
          title="Download Project ZIP"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={openSettingsModal}
          className="p-1.5 rounded-lg bg-[#161F33] hover:bg-[#1E293B] text-slate-400 hover:text-slate-200 transition"
          title="Editor Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
