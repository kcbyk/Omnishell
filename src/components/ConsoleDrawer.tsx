'use client';

import React, { useState } from 'react';
import { Terminal, Trash2, X, AlertCircle, AlertTriangle, Info, Play, CornerDownLeft } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { ConsoleLog } from '../types/project';

export default function ConsoleDrawer() {
  const { isConsoleOpen, toggleConsole, consoleLogs, clearConsole, addConsoleLog } = useEditor();
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'log'>('all');
  const [replInput, setReplInput] = useState('');

  if (!isConsoleOpen) return null;

  const filteredLogs = consoleLogs.filter((log) => {
    if (filter === 'all') return true;
    return log.type === filter;
  });

  const getLogIcon = (type: ConsoleLog['type']) => {
    if (type === 'error') return <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />;
    if (type === 'warn') return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
    if (type === 'info') return <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />;
    return <Terminal className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />;
  };

  const handleReplSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = replInput.trim();
    if (!cmd) return;

    addConsoleLog('log', `> ${cmd}`);
    setReplInput('');

    try {
      // Safe eval
      const result = eval(cmd);
      addConsoleLog('info', `< ${String(result)}`);
    } catch (err: any) {
      addConsoleLog('error', `< ${err?.message || String(err)}`);
    }
  };

  return (
    <div className="h-48 bg-[#0B0F19] border-t border-[#1E293B] flex flex-col z-30 select-none">
      {/* Console Header */}
      <div className="h-8 px-3 bg-[#0E131F] border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-purple-400" /> CONSOLE
          </span>

          {/* Filter tabs */}
          <div className="flex items-center space-x-1 text-[10px] font-mono ml-2">
            {(['all', 'error', 'warn', 'log'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-1.5 py-0.5 rounded uppercase ${
                  filter === f ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={clearConsole}
            className="p-1 rounded hover:bg-[#1E293B] text-slate-400 hover:text-rose-400 transition"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleConsole}
            className="p-1 rounded hover:bg-[#1E293B] text-slate-400 hover:text-slate-200 transition"
            title="Close Console"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Output List */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1 bg-[#070A10]">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 text-[11px] p-2">Console is ready. Output from code & errors appear here.</div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start space-x-2 p-1.5 rounded text-[11px] leading-tight ${
                log.type === 'error'
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  : log.type === 'warn'
                  ? 'bg-amber-500/10 text-amber-300'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {getLogIcon(log.type)}
              <span className="flex-1 break-all">{log.message}</span>
              <span className="text-[9px] text-slate-500 flex-shrink-0">{log.timestamp}</span>
            </div>
          ))
        )}
      </div>

      {/* Interactive REPL Input */}
      <form onSubmit={handleReplSubmit} className="h-8 bg-[#0E131F] border-t border-[#1E293B] px-2 flex items-center">
        <span className="text-purple-400 font-mono text-xs font-bold mr-1.5">&gt;</span>
        <input
          type="text"
          value={replInput}
          onChange={(e) => setReplInput(e.target.value)}
          placeholder="Evaluate JavaScript expression..."
          className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
        />
        <button type="submit" className="text-slate-400 hover:text-purple-400 p-1">
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
