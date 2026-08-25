'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Mic, Bot, User, CornerDownLeft, Terminal, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

const PRESET_PROMPTS = [
  '⚡ Next.js 14 Server Actions snippet',
  '🚀 High-speed mobile animations in Tailwind',
  '🛡️ Cyberpunk mobile OS architecture',
  '🧠 Create a 30-min deep focus routine',
];

export default function AiChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings Commander. I am **OmniMind AI**, your neural copilot. Ask me to architect code, automate workflows, or optimize your day.',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = `Processing neural query for: "${query}".\nHere is your real-time response optimized for high execution performance.`;
      let snippet: string | undefined = undefined;

      if (query.toLowerCase().includes('next') || query.toLowerCase().includes('code')) {
        aiResponseText = `Here is an ultra-fast Next.js Server Action pattern with optimistic updates:`;
        snippet = `'use server';\n\nexport async function updateOmniState(data: FormData) {\n  const payload = data.get('action');\n  // Atomic sync with edge cache\n  return { success: true, timestamp: Date.now() };\n}`;
      } else if (query.toLowerCase().includes('focus') || query.toLowerCase().includes('routine')) {
        aiResponseText = `Here is the **HyperFocus Protocol**:\n1. 50-minute uninterrupted deep work sprint.\n2. Ambient Binaural 40Hz Audio stream.\n3. 10-minute active stretch & hydration break.`;
      } else {
        aiResponseText = `OmniMind analyzed your directive: "${query}". Neural system nodes are synchronized at 99.8% efficiency. All parameters are optimal.`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        codeSnippet: snippet,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070A10] pb-20">
      {/* Top AI Bar */}
      <div className="px-4 py-3 border-b border-white/5 bg-[#0E131F]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-md shadow-pink-500/20">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              OmniMind Copilot <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-[10px] text-pink-400 font-mono">Neural Engine v4.5 • 120B Active</div>
          </div>
        </div>
      </div>

      {/* Preset Prompts Pills */}
      <div className="px-3 py-2 border-b border-white/5 bg-[#070A10]/50 overflow-x-auto no-scrollbar flex space-x-2">
        {PRESET_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 font-medium transition active:scale-95 flex-shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${isAi ? 'justify-start' : 'justify-end flex-row-reverse space-x-reverse'}`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 mt-1 ${
                  isAi ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                isAi
                  ? 'bg-[#121826] border border-white/10 text-slate-200'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-medium shadow-lg shadow-cyan-500/10'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.codeSnippet && (
                  <div className="mt-2.5 rounded-xl bg-black/80 border border-white/10 p-2.5 font-mono text-[11px] relative">
                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10 text-[9px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-pink-400" /> TypeScript
                      </span>
                      <button
                        onClick={() => copyCode(msg.codeSnippet!, msg.id)}
                        className="flex items-center gap-1 hover:text-white transition"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-cyan-300 overflow-x-auto no-scrollbar">{msg.codeSnippet}</pre>
                  </div>
                )}

                <div className={`text-[9px] mt-1 font-mono text-right ${isAi ? 'text-slate-500' : 'text-black/60'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-pink-400 font-mono">
            <Bot className="w-4 h-4 animate-spin" />
            <span className="animate-pulse">OmniMind is synthesizing response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-white/10 bg-[#0E131F]/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask OmniMind anything..."
              className="w-full bg-[#161F33] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition shadow-lg shadow-pink-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
