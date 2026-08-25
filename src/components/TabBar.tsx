'use client';

import React from 'react';
import { X, FileCode, FileText } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

export default function TabBar() {
  const { files, openTabs, activeFileId, setActiveFileId, closeTab } = useEditor();

  if (openTabs.length === 0) return null;

  return (
    <div className="h-9 bg-[#0B0F19] border-b border-[#1E293B] flex items-center overflow-x-auto no-scrollbar select-none">
      {openTabs.map((tabId) => {
        const file = files.find((f) => f.id === tabId);
        if (!file) return null;

        const isActive = activeFileId === tabId;

        return (
          <div
            key={tabId}
            onClick={() => setActiveFileId(tabId)}
            className={`group h-full px-3 flex items-center space-x-2 border-r border-[#1E293B] text-xs font-mono cursor-pointer transition-colors flex-shrink-0 ${
              isActive
                ? 'bg-[#121826] text-cyan-300 border-t-2 border-t-cyan-400 font-medium'
                : 'text-slate-400 hover:bg-[#0E131F] hover:text-slate-200'
            }`}
          >
            <span className="truncate max-w-[120px]">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tabId);
              }}
              className="p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-rose-400 transition"
              title="Close Tab"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
