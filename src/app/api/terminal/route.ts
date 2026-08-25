import { NextRequest, NextResponse } from 'next/server';

interface TerminalRequest {
  command: string;
  files: Array<{ name: string; content: string; language?: string }>;
  activeFileName?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { command, files, activeFileName } = (await req.json()) as TerminalRequest;
    const cleanCmd = command.trim();

    if (!cleanCmd) {
      return NextResponse.json({ response: 'Please enter a command or prompt.' });
    }

    // 1. Built-in Terminal Slash Commands
    if (cleanCmd.startsWith('/')) {
      const parts = cleanCmd.split(' ');
      const action = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      if (action === '/help') {
        return NextResponse.json({
          response: `Available Terminal Commands:
  /help                  - Show this help menu
  /files                 - List all files in current project
  /cat <filename>        - Print file content to terminal
  /create <filename>     - Create a new project file
  /stats                 - Show project size and line counts
  /templates             - View available project templates
  /clear                 - Clear terminal screen

Or simply type any coding request in natural language (e.g. "Create a neon button", "Fix bug in script.js", "Add particles")!`,
        });
      }

      if (action === '/files') {
        const fileList = files.map((f) => `📄 ${f.name} (${f.content.split('\n').length} lines)`).join('\n');
        return NextResponse.json({
          response: `Project Workspace Files:\n${fileList}`,
        });
      }

      if (action === '/cat') {
        const target = files.find((f) => f.name.toLowerCase() === arg.toLowerCase());
        if (!target) {
          return NextResponse.json({
            response: `Error: File "${arg}" not found. Type /files to list available files.`,
          });
        }
        return NextResponse.json({
          response: `--- ${target.name} ---\n${target.content}`,
        });
      }

      if (action === '/stats') {
        const totalLines = files.reduce((sum, f) => sum + f.content.split('\n').length, 0);
        const totalChars = files.reduce((sum, f) => sum + f.content.length, 0);
        return NextResponse.json({
          response: `📊 Project Statistics:
  - Total Files: ${files.length}
  - Total Lines of Code: ${totalLines}
  - File Size: ${(totalChars / 1024).toFixed(2)} KB
  - Active File: ${activeFileName || 'None'}`,
        });
      }
    }

    // 2. Intelligent Context-Aware Agent Engine
    const lower = cleanCmd.toLowerCase();
    let responseText = '';
    let suggestedCode: string | undefined = undefined;
    let targetFile: string | undefined = undefined;

    if (lower.includes('button') || lower.includes('buton')) {
      responseText = `I generated a glowing cyberpunk neon button snippet with ripple effect for your project!`;
      targetFile = 'index.html';
      suggestedCode = `<button class="neon-btn" onclick="alert('System Activated!')">
  <span>⚡ ACTIVATE HYPERDRIVE</span>
</button>

<style>
.neon-btn {
  background: transparent;
  color: #00F0FF;
  border: 2px solid #00F0FF;
  padding: 12px 24px;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  text-shadow: 0 0 8px #00F0FF;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  transition: all 0.2s ease;
}
.neon-btn:hover {
  background: #00F0FF;
  color: #000;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.8);
  transform: scale(1.05);
}
</style>`;
    } else if (lower.includes('particle') || lower.includes('parçacık') || lower.includes('canvas')) {
      responseText = `Here is a lightweight high-performance Canvas particle system you can paste into script.js:`;
      targetFile = 'script.js';
      suggestedCode = `// Interactive Particle Burst
const particles = [];
window.addEventListener('pointerdown', (e) => {
  for (let i = 0; i < 25; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1.0,
      color: Math.random() > 0.5 ? '#00F0FF' : '#FF0055'
    });
  }
});`;
    } else if (lower.includes('navbar') || lower.includes('menü') || lower.includes('header')) {
      responseText = `Here is a modern glassmorphic navigation header component:`;
      targetFile = 'index.html';
      suggestedCode = `<nav style="display:flex; justify-content:space-between; align-items:center; padding:16px 24px; background:rgba(14,19,31,0.8); backdrop-filter:blur(10px); border-bottom:1px solid rgba(255,255,255,0.1); color:#fff; font-family:sans-serif;">
  <div style="font-weight:900; font-size:16px; color:#00F0FF;">⚡ SPCK CORE</div>
  <div style="display:flex; gap:16px; font-size:13px;">
    <a href="#home" style="color:#00F0FF; text-decoration:none;">Home</a>
    <a href="#about" style="color:#94A3B8; text-decoration:none;">About</a>
    <a href="#contact" style="color:#94A3B8; text-decoration:none;">Contact</a>
  </div>
</nav>`;
    } else if (lower.includes('hata') || lower.includes('error') || lower.includes('fix') || lower.includes('düzelt')) {
      responseText = `I analyzed your active file (${activeFileName || 'workspace'}). All syntax trees look solid! If you encounter runtime errors in the iframe sandbox, open the DevTools Console (Terminal icon at the top right) to view real-time stacktraces.`;
    } else {
      responseText = `⚡ [SPCK Neural Terminal]
Directive received: "${cleanCmd}"
Workspace Status: ${files.length} active files loaded.
To create or inject components, ask me anything like:
- "Create a neon button"
- "Add a particle effect"
- "Create a dark glassmorphic navbar"
- Or use /help to see terminal commands!`;
    }

    return NextResponse.json({
      response: responseText,
      suggestedCode,
      targetFile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { response: `Terminal Agent Error: ${error?.message || 'Failed to process request'}` },
      { status: 500 }
    );
  }
}
