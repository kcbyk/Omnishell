'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  X,
  Send,
  Trash2,
  Sparkles,
  Play,
  CornerDownLeft,
  Check,
  Copy,
  PlusCircle,
  FileCode,
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';

interface TerminalMessage {
  id: string;
  sender: 'user' | 'agent';
  command?: string;
  text: string;
  suggestedCode?: string;
  targetFile?: string;
  timestamp: string;
}

const QUICK_TERMINAL_COMMANDS = [
  '/help',
  '/files',
  '/stats',
  'Neon button ekle',
  'Particle effect ekle',
  'Dark navbar component',
];

export default function AiTerminalModal() {
  const {
    isAiTerminalOpen,
    closeAiTerminal,
    files,
    getActiveFile,
    appendCodeToFile,
    runPreview,
    addConsoleLog,
  } = useEditor();

  const [messages, setMessages] = useState<TerminalMessage[]>([
    {
      id: 'init',
      sender: 'agent',
      text: `=== SPCK NEURAL AGENT TERMINAL v2.0 ===
[+] Connected to live project workspace.
[+] You can talk to me in Turkish or English, ask for code snippets, or use /help.
Type your prompt below to interact directly with the agent.`,
      timestamp: 'Ready',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [injectedId, setInjectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAiTerminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isAiTerminalOpen, messages]);

  if (!isAiTerminalOpen) return null;

  const handleSubmit = async (cmdToSend?: string) => {
    const cmd = (cmdToSend || input).trim();
    if (!cmd) return;

    if (cmd === '/clear' || cmd === 'clear' || cmd === 'cls') {
      setMessages([]);
      setInput('');
      return;
    }

    const userMsg: TerminalMessage = {
      id: Date.now().toString(),
      sender: 'user',
      command: cmd,
      text: cmd,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);
    setInput('');
    setIsLoading(true);

    const activeFile = getActiveFile();

    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: cmd,
          files: files.map((f) => ({ name: f.name, content: f.content, language: f.language })),
          activeFileName: activeFile?.name,
        }),
      });

      const data = await res.json();

      const agentMsg: TerminalMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: data.response || 'Command executed successfully.',
        suggestedCode: data.suggestedCode,
        targetFile: data.targetFile,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: `Error connecting to terminal agent: ${err?.message || 'Server error'}`,
          timestamp: 'Error',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInput(history[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInput('');
        }
      }
    }
  };

  const handleInjectCode = (msg: TerminalMessage) => {
    if (msg.suggestedCode && msg.targetFile) {
      appendCodeToFile(msg.targetFile, msg.suggestedCode);
      runPreview();
      setInjectedId(msg.id);
      addConsoleLog('info', `⚡ Injected component snippet into ${msg.targetFile}`);
      setTimeout(() => setInjectedId(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="w-full max-w-2xl h-[85vh] bg-[#070A10] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Terminal Header */}
        <div className="h-12 bg-[#0E131F] border-b border-[#1E293B] px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
              <TerminalIcon className="w-4 h-4" />
            </div>
            <span className="text-white font-bold flex items-center gap-1.5">
              spck@agent-terminal:~${' '}
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setMessages([])}
              className="p-1.5 rounded-lg bg-[#161F33] hover:bg-[#1E293B] text-slate-400 hover:text-rose-400 transition"
              title="Clear Terminal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeAiTerminal}
              className="p-1.5 rounded-lg bg-[#161F33] hover:bg-[#1E293B] text-slate-400 hover:text-white transition"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Pills */}
        <div className="px-3 py-2 bg-[#0B0F19] border-b border-[#1E293B] flex space-x-1.5 overflow-x-auto no-scrollbar">
          {QUICK_TERMINAL_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSubmit(cmd)}
              className="px-2.5 py-1 rounded-lg bg-[#121826] hover:bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono whitespace-nowrap transition active:scale-95 flex-shrink-0"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Conversation Output */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs bg-[#04060A]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className="space-y-1.5">
                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                  <span className={isUser ? 'text-pink-400 font-bold' : 'text-cyan-400 font-bold'}>
                    {isUser ? 'you@spck:~$' : 'agent@spck:~$'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-xl border leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#121826] border-pink-500/30 text-slate-100'
                      : 'bg-[#0E131F] border-cyan-500/30 text-emerald-300 shadow-lg shadow-cyan-500/5'
                  }`}
                >
                  {msg.text}

                  {/* Code Snippet Card */}
                  {msg.suggestedCode && (
                    <div className="mt-3 rounded-xl bg-black/90 border border-cyan-500/30 p-3 text-[11px] text-cyan-300 overflow-hidden font-mono">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1.5 text-white">
                          <FileCode className="w-3.5 h-3.5 text-cyan-400" /> Target:{' '}
                          <b className="text-cyan-300">{msg.targetFile}</b>
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.suggestedCode!);
                              addConsoleLog('info', 'Code snippet copied to clipboard');
                            }}
                            className="p-1 hover:text-white flex items-center gap-1 text-slate-400 transition"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        </div>
                      </div>

                      <pre className="overflow-x-auto no-scrollbar py-1 text-slate-200">
                        {msg.suggestedCode}
                      </pre>

                      {/* 1-Click Inject Button */}
                      <button
                        onClick={() => handleInjectCode(msg)}
                        className={`w-full mt-2.5 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 ${
                          injectedId === msg.id
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-90 shadow-lg shadow-cyan-400/20'
                        }`}
                      >
                        {injectedId === msg.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Injected into {msg.targetFile}!</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-4 h-4" />
                            <span>⚡ Inject into {msg.targetFile} & Run</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span className="animate-pulse">Agent is analyzing workspace and drafting response...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="h-14 bg-[#0E131F] border-t border-[#1E293B] px-3 flex items-center space-x-2"
        >
          <span className="text-cyan-400 font-mono text-sm font-bold pl-1">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (/help, /files) or ask a question..."
            className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-black font-bold disabled:opacity-40 hover:opacity-90 active:scale-95 transition shadow-lg shadow-cyan-400/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
