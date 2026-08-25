'use client';

import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  FileJson,
  FolderPlus,
  FilePlus,
  Trash2,
  Edit2,
  X,
  Sparkles,
  ChevronRight,
  Folder,
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { FileItem } from '../types/project';

export default function Sidebar() {
  const {
    files,
    activeFileId,
    setActiveFileId,
    openTab,
    createFile,
    deleteFile,
    renameFile,
    isSidebarOpen,
    toggleSidebar,
    openTemplateModal,
  } = useEditor();

  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const getFileIcon = (file: FileItem) => {
    if (file.name.endsWith('.html')) return <FileCode className="w-4 h-4 text-orange-400" />;
    if (file.name.endsWith('.css')) return <FileCode className="w-4 h-4 text-cyan-400" />;
    if (file.name.endsWith('.js')) return <FileCode className="w-4 h-4 text-yellow-400" />;
    if (file.name.endsWith('.json')) return <FileJson className="w-4 h-4 text-emerald-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      createFile(newFileName.trim());
      setNewFileName('');
      setIsCreatingFile(false);
    }
  };

  const handleRenameSubmit = (id: string) => {
    if (editName.trim()) {
      renameFile(id, editName.trim());
      setEditingId(null);
    }
  };

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        onClick={toggleSidebar}
      />

      {/* Drawer */}
      <aside className="fixed md:static inset-y-0 left-0 w-64 bg-[#0E131F] border-r border-[#1E293B] flex flex-col z-50 select-none">
        {/* Sidebar Header */}
        <div className="h-12 px-3 border-b border-[#1E293B] flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-200 tracking-wider flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-cyan-400" /> EXPLORER
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsCreatingFile(true)}
              className="p-1 rounded hover:bg-[#1E293B] text-slate-400 hover:text-cyan-400 transition"
              title="New File"
            >
              <FilePlus className="w-4 h-4" />
            </button>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-[#1E293B] text-slate-400 hover:text-rose-400 transition"
              title="Close Explorer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New File Input Box */}
        {isCreatingFile && (
          <form onSubmit={handleCreateSubmit} className="p-2 bg-[#121826] border-b border-[#1E293B]">
            <input
              type="text"
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="filename.html, style.css..."
              className="w-full bg-[#070A10] border border-cyan-500/40 rounded px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
            />
            <div className="flex justify-end gap-1 mt-1.5">
              <button
                type="button"
                onClick={() => setIsCreatingFile(false)}
                className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-0.5 rounded bg-cyan-400 text-black font-bold text-[10px]"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* File Tree List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {files.map((file) => {
            const isActive = activeFileId === file.id;
            const isEditing = editingId === file.id;

            return (
              <div
                key={file.id}
                onClick={() => {
                  setActiveFileId(file.id);
                  openTab(file.id);
                }}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium'
                    : 'text-slate-300 hover:bg-[#161F33] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 truncate flex-1">
                  {getFileIcon(file)}
                  {isEditing ? (
                    <input
                      type="text"
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleRenameSubmit(file.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSubmit(file.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="bg-black border border-cyan-400 rounded px-1 text-xs text-white w-28 focus:outline-none"
                    />
                  ) : (
                    <span className="truncate">{file.name}</span>
                  )}
                </div>

                {/* Actions (Rename, Delete) */}
                <div className="hidden group-hover:flex items-center space-x-1 opacity-80">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(file.id);
                      setEditName(file.name);
                    }}
                    className="p-1 hover:text-cyan-400"
                    title="Rename"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  {files.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${file.name}"?`)) deleteFile(file.id);
                      }}
                      className="p-1 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Templates Banner Footer */}
        <div className="p-3 border-t border-[#1E293B] bg-[#070A10]/50">
          <button
            onClick={openTemplateModal}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Starter Project</span>
          </button>
        </div>
      </aside>
    </>
  );
}
