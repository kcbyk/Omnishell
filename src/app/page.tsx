'use client';

import React from 'react';
import { EditorProvider, useEditor } from '../context/EditorContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TabBar from '../components/TabBar';
import CodeEditor from '../components/CodeEditor';
import PreviewFrame from '../components/PreviewFrame';
import ConsoleDrawer from '../components/ConsoleDrawer';
import TemplateModal from '../components/TemplateModal';
import SettingsModal from '../components/SettingsModal';

function EditorApp() {
  const { viewMode } = useEditor();

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-[#070A10] text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar File Explorer */}
        <Sidebar />

        {/* Center Workspace (Editor / Preview / Split) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* Editor Container */}
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div
              className={`flex-1 flex flex-col h-full overflow-hidden ${
                viewMode === 'split' ? 'md:w-1/2 md:border-r border-[#1E293B]' : 'w-full'
              }`}
            >
              <TabBar />
              <CodeEditor />
            </div>
          )}

          {/* Preview Container */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              className={`flex-1 flex flex-col h-full overflow-hidden ${
                viewMode === 'split' ? 'md:w-1/2' : 'w-full'
              }`}
            >
              <PreviewFrame />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Console Drawer */}
      <ConsoleDrawer />

      {/* Modals */}
      <TemplateModal />
      <SettingsModal />
    </div>
  );
}

export default function Home() {
  return (
    <EditorProvider>
      <EditorApp />
    </EditorProvider>
  );
}
