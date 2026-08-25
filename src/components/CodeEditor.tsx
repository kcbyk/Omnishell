'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useEditor } from '../context/EditorContext';
import { Undo, Redo, Copy, Sparkles } from 'lucide-react';

const ACCESSORY_SYMBOLS = [
  'Tab',
  '<',
  '>',
  '/',
  '{',
  '}',
  '[',
  ']',
  '(',
  ')',
  '=',
  '"',
  "'",
  ';',
  ':',
  '$',
  '!',
  '&',
  '|',
  '+',
  '-',
  '*',
  '?',
];

export default function CodeEditor() {
  const { getActiveFile, updateFileContent, fontSize, wordWrap } = useEditor();
  const activeFile = getActiveFile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Keep track of undo/redo history
  useEffect(() => {
    if (activeFile) {
      setHistory([activeFile.content]);
      setHistoryIdx(0);
    }
  }, [activeFile?.id]);

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#070A10] text-slate-500 font-mono text-xs">
        <Sparkles className="w-8 h-8 text-cyan-500/40 mb-2" />
        <span>No open files. Select a file from Explorer to edit.</span>
      </div>
    );
  }

  const lines = activeFile.content.split('\n');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    updateFileContent(activeFile.id, newContent);

    // Push to undo history with debounce limit
    if (history[historyIdx] !== newContent) {
      const nextHistory = history.slice(0, historyIdx + 1);
      nextHistory.push(newContent);
      setHistory(nextHistory);
      setHistoryIdx(nextHistory.length - 1);
    }

    updateCursorPosition();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = textareaRef.current;
    if (!target) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newText = activeFile.content.substring(0, start) + '  ' + activeFile.content.substring(end);
      updateFileContent(activeFile.id, newText);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
        updateCursorPosition();
      }, 0);
    }
  };

  const updateCursorPosition = () => {
    const target = textareaRef.current;
    if (!target) return;
    const textBefore = activeFile.content.substring(0, target.selectionStart);
    const lineNum = textBefore.split('\n').length;
    const lastNewlineIdx = textBefore.lastIndexOf('\n');
    const colNum = lastNewlineIdx === -1 ? textBefore.length + 1 : textBefore.length - lastNewlineIdx;
    setCursorPos({ line: lineNum, col: colNum });
  };

  // Mobile Accessory Bar action: inserts symbol at current cursor
  const insertSymbol = (sym: string) => {
    const target = textareaRef.current;
    if (!target) return;

    target.focus();
    const start = target.selectionStart;
    const end = target.selectionEnd;

    let insertText = sym;
    let cursorOffset = sym.length;

    if (sym === 'Tab') {
      insertText = '  ';
      cursorOffset = 2;
    } else if (sym === '<') {
      insertText = '<>';
      cursorOffset = 1;
    } else if (sym === '{') {
      insertText = '{}';
      cursorOffset = 1;
    } else if (sym === '(') {
      insertText = '()';
      cursorOffset = 1;
    } else if (sym === '[') {
      insertText = '[]';
      cursorOffset = 1;
    } else if (sym === '"') {
      insertText = '""';
      cursorOffset = 1;
    } else if (sym === "'") {
      insertText = "''";
      cursorOffset = 1;
    }

    const newContent = activeFile.content.substring(0, start) + insertText + activeFile.content.substring(end);
    updateFileContent(activeFile.id, newContent);

    setTimeout(() => {
      target.selectionStart = target.selectionEnd = start + cursorOffset;
      updateCursorPosition();
    }, 10);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      updateFileContent(activeFile.id, prev);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      updateFileContent(activeFile.id, next);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070A10] overflow-hidden relative">
      {/* Main Text Area & Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers Column */}
        <div
          style={{ fontSize: `${fontSize}px` }}
          className="w-12 py-3 bg-[#0B0F19] border-r border-[#1E293B] text-slate-600 font-mono text-right pr-2.5 select-none overflow-hidden flex-shrink-0 leading-6"
        >
          {lines.map((_, i) => (
            <div
              key={i}
              className={i + 1 === cursorPos.line ? 'text-cyan-400 font-bold' : ''}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Input Area */}
        <textarea
          ref={textareaRef}
          value={activeFile.content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={updateCursorPosition}
          onKeyUp={updateCursorPosition}
          style={{ fontSize: `${fontSize}px` }}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className={`flex-1 p-3 bg-transparent text-slate-100 font-mono leading-6 resize-none focus:outline-none border-none overflow-auto no-scrollbar selection:bg-cyan-500/30 ${
            wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
          }`}
        />
      </div>

      {/* SPCK Mobile Keyboard Accessory Bar */}
      <div className="h-10 bg-[#0E131F] border-t border-[#1E293B] px-2 flex items-center justify-between select-none z-20 overflow-x-auto no-scrollbar">
        {/* Undo / Redo */}
        <div className="flex items-center space-x-1 border-r border-[#1E293B] pr-2 mr-1.5 flex-shrink-0">
          <button
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className="p-1.5 rounded bg-[#161F33] hover:bg-[#1E293B] text-slate-300 disabled:opacity-30 transition"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 rounded bg-[#161F33] hover:bg-[#1E293B] text-slate-300 disabled:opacity-30 transition"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Symbols Chips */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar flex-1">
          {ACCESSORY_SYMBOLS.map((sym) => (
            <button
              key={sym}
              onClick={() => insertSymbol(sym)}
              className="px-2.5 py-1 rounded bg-[#161F33] hover:bg-cyan-500/20 active:bg-cyan-400 active:text-black border border-white/5 text-cyan-300 font-mono font-bold text-xs transition active:scale-95 flex-shrink-0"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Status indicator */}
        <div className="hidden sm:flex items-center space-x-2 pl-2 text-[10px] font-mono text-slate-400 border-l border-[#1E293B] flex-shrink-0">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="text-cyan-400 font-bold uppercase">{activeFile.language}</span>
        </div>
      </div>
    </div>
  );
}
