'use client';

import React from 'react';
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor, Eye } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

export default function PreviewFrame() {
  const { previewUrl, previewKey, runPreview, viewport, setViewport } = useEditor();

  const getViewportClass = () => {
    if (viewport === 'mobile') return 'w-[375px] h-[667px] shadow-2xl rounded-2xl border-4 border-[#1E293B] my-auto';
    if (viewport === 'tablet') return 'w-[768px] h-[90%] shadow-2xl rounded-2xl border-4 border-[#1E293B] my-auto';
    return 'w-full h-full';
  };

  const handleOpenNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050811] overflow-hidden relative">
      {/* Top Preview Sub-header */}
      <div className="h-9 bg-[#0B0F19] border-b border-[#1E293B] px-3 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-white font-medium">SANDBOX PREVIEW</span>
        </div>

        {/* Viewport & Actions */}
        <div className="flex items-center space-x-1.5">
          {/* Viewport size buttons (Desktop only) */}
          <div className="hidden sm:flex items-center bg-[#121826] border border-[#1E293B] rounded-lg p-0.5">
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1 rounded ${viewport === 'mobile' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1 rounded ${viewport === 'tablet' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('responsive')}
              className={`p-1 rounded ${viewport === 'responsive' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
              title="Responsive 100%"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reload Button */}
          <button
            onClick={runPreview}
            className="p-1 rounded bg-[#161F33] hover:bg-[#1E293B] text-slate-300 hover:text-cyan-400 transition"
            title="Reload Frame"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Open in new tab */}
          <button
            onClick={handleOpenNewTab}
            className="p-1 rounded bg-[#161F33] hover:bg-[#1E293B] text-slate-300 hover:text-cyan-400 transition"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sandboxed iframe viewport */}
      <div className="flex-1 flex items-center justify-center bg-[#020408] overflow-auto p-2">
        {previewUrl ? (
          <iframe
            key={previewKey}
            src={previewUrl}
            title="SPCK Preview Sandbox"
            sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
            className={`bg-white transition-all duration-300 ${getViewportClass()}`}
          />
        ) : (
          <div className="text-slate-500 font-mono text-xs">Generating preview...</div>
        )}
      </div>
    </div>
  );
}
