'use client';

import React from 'react';
import { X, Sparkles, Terminal, Gamepad2, CheckSquare, ArrowRight } from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { STARTER_TEMPLATES } from '../utils/templates';

export default function TemplateModal() {
  const { isTemplateModalOpen, closeTemplateModal, loadTemplate } = useEditor();

  if (!isTemplateModalOpen) return null;

  const getTemplateIcon = (iconName: string) => {
    if (iconName === 'Gamepad2') return <Gamepad2 className="w-5 h-5 text-pink-400" />;
    if (iconName === 'CheckSquare') return <CheckSquare className="w-5 h-5 text-cyan-400" />;
    return <Terminal className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0E131F] border border-cyan-500/30 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono">STARTER PROJECT GALLERY</h3>
              <p className="text-[10px] text-slate-400">Select a project template to instant-load into SPCK</p>
            </div>
          </div>
          <button
            onClick={closeTemplateModal}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {STARTER_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => loadTemplate(tmpl)}
              className="p-3.5 rounded-2xl bg-[#121826] hover:bg-[#161F33] border border-white/5 hover:border-cyan-500/40 cursor-pointer transition-all active:scale-95 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {getTemplateIcon(tmpl.icon)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {tmpl.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{tmpl.description}</p>
                  </div>
                </div>

                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex-shrink-0">
                  {tmpl.badge}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
                <span>{tmpl.files.length} Files Included</span>
                <span className="text-cyan-400 flex items-center gap-1 font-bold">
                  Load in Editor <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
