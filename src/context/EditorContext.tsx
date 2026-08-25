'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { FileItem, ConsoleLog, ViewMode, EditorTheme, DeviceViewport, ProjectTemplate } from '../types/project';
import { STARTER_TEMPLATES } from '../utils/templates';
import JSZip from 'jszip';

interface EditorContextType {
  files: FileItem[];
  activeFileId: string | null;
  openTabs: string[];
  viewMode: ViewMode;
  theme: EditorTheme;
  viewport: DeviceViewport;
  fontSize: number;
  wordWrap: boolean;
  autoRun: boolean;
  isSidebarOpen: boolean;
  isConsoleOpen: boolean;
  isTemplateModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isAiTerminalOpen: boolean;
  consoleLogs: ConsoleLog[];
  previewUrl: string;
  previewKey: number;

  // Actions
  setActiveFileId: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  appendCodeToFile: (fileName: string, codeToAppend: string) => void;
  createFile: (name: string, type?: 'file' | 'folder', parentId?: string | null) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  closeTab: (id: string) => void;
  openTab: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setTheme: (theme: EditorTheme) => void;
  setViewport: (vp: DeviceViewport) => void;
  setFontSize: (size: number) => void;
  setWordWrap: (wrap: boolean) => void;
  setAutoRun: (auto: boolean) => void;
  toggleSidebar: () => void;
  toggleConsole: () => void;
  toggleAiTerminal: () => void;
  openAiTerminal: () => void;
  closeAiTerminal: () => void;
  openTemplateModal: () => void;
  closeTemplateModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  loadTemplate: (template: ProjectTemplate) => void;
  runPreview: () => void;
  clearConsole: () => void;
  addConsoleLog: (type: 'log' | 'warn' | 'error' | 'info', message: string) => void;
  exportProjectZip: () => Promise<void>;
  getActiveFile: () => FileItem | undefined;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>(STARTER_TEMPLATES[0].files);
  const [activeFileId, setActiveFileId] = useState<string | null>('1');
  const [openTabs, setOpenTabs] = useState<string[]>(['1', '2', '3']);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [theme, setTheme] = useState<EditorTheme>('vscode-dark');
  const [viewport, setViewport] = useState<DeviceViewport>('responsive');
  const [fontSize, setFontSize] = useState<number>(14);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAiTerminalOpen, setIsAiTerminalOpen] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewKey, setPreviewKey] = useState<number>(1);

  // Load from localStorage on initial mount
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem('spck_project_files');
      if (savedFiles) {
        const parsed = JSON.parse(savedFiles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFiles(parsed);
          setActiveFileId(parsed[0].id);
          setOpenTabs(parsed.slice(0, 3).map((f: FileItem) => f.id));
        }
      }
      const savedTheme = localStorage.getItem('spck_theme');
      if (savedTheme) setTheme(savedTheme as EditorTheme);
      const savedFont = localStorage.getItem('spck_font_size');
      if (savedFont) setFontSize(Number(savedFont));
    } catch (_) {}
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spck_project_files', JSON.stringify(files));
      localStorage.setItem('spck_theme', theme);
      localStorage.setItem('spck_font_size', fontSize.toString());
    } catch (_) {}
  }, [files, theme, fontSize]);

  const addConsoleLog = useCallback((type: 'log' | 'warn' | 'error' | 'info', message: string) => {
    setConsoleLogs((prev) => [
      ...prev.slice(-100),
      {
        id: Math.random().toString(),
        type,
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ]);
  }, []);

  // Listen to postMessage from sandboxed iframe for console.log/error/warn
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.source === 'spck-sandbox') {
        addConsoleLog(e.data.type, e.data.message);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addConsoleLog]);

  // Generate sandboxed HTML with inlined CSS/JS and console interceptor
  const buildPreviewHtml = useCallback(() => {
    const htmlFile = files.find((f) => f.name.endsWith('.html')) || files[0];
    if (!htmlFile) return '';

    let html = htmlFile.content;

    // Console Interceptor script injected into <head>
    const consoleInterceptor = `
      <script>
        (function() {
          function send(type, args) {
            try {
              const msg = Array.from(args).map(a => {
                if (typeof a === 'object') {
                  try { return JSON.stringify(a); } catch(e) { return String(a); }
                }
                return String(a);
              }).join(' ');
              window.parent.postMessage({ source: 'spck-sandbox', type: type, message: msg }, '*');
            } catch(e) {}
          }
          const _log = console.log, _warn = console.warn, _error = console.error, _info = console.info;
          console.log = function() { send('log', arguments); _log.apply(console, arguments); };
          console.warn = function() { send('warn', arguments); _warn.apply(console, arguments); };
          console.error = function() { send('error', arguments); _error.apply(console, arguments); };
          console.info = function() { send('info', arguments); _info.apply(console, arguments); };
          window.onerror = function(msg, url, line) {
            send('error', 'Uncaught Error: ' + msg + ' (Line ' + line + ')');
          };
        })();
      </script>
    `;

    // Inline all local CSS files referenced in <link rel="stylesheet" href="...">
    const cssFiles = files.filter((f) => f.name.endsWith('.css'));
    for (const css of cssFiles) {
      const linkRegex = new RegExp(`<link[^>]*href=["']${css.name}["'][^>]*>`, 'gi');
      if (linkRegex.test(html)) {
        html = html.replace(linkRegex, `<style>\n${css.content}\n</style>`);
      } else {
        html = html.replace('</head>', `<style>\n${css.content}\n</style></head>`);
      }
    }

    // Inline all local JS files referenced in <script src="...">
    const jsFiles = files.filter((f) => f.name.endsWith('.js'));
    for (const js of jsFiles) {
      const scriptRegex = new RegExp(`<script[^>]*src=["']${js.name}["'][^>]*>\\s*<\\/script>`, 'gi');
      if (scriptRegex.test(html)) {
        html = html.replace(scriptRegex, `<script>\n${js.content}\n</script>`);
      } else {
        html = html.replace('</body>', `<script>\n${js.content}\n</script></body>`);
      }
    }

    if (html.includes('<head>')) {
      html = html.replace('<head>', '<head>' + consoleInterceptor);
    } else {
      html = consoleInterceptor + html;
    }

    return html;
  }, [files]);

  const runPreview = useCallback(() => {
    const bundle = buildPreviewHtml();
    const blob = new Blob([bundle], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setPreviewKey((k) => k + 1);
  }, [buildPreviewHtml]);

  // Initial and auto preview rebuild
  useEffect(() => {
    if (autoRun) {
      const timeout = setTimeout(() => {
        runPreview();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [files, autoRun, runPreview]);

  const getActiveFile = () => files.find((f) => f.id === activeFileId);

  const updateFileContent = (id: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, content: newContent } : f))
    );
  };

  const appendCodeToFile = (fileName: string, codeToAppend: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.name.toLowerCase() === fileName.toLowerCase()) {
          let updated = f.content;
          if (fileName.endsWith('.html') && updated.includes('</body>')) {
            updated = updated.replace('</body>', `\n  ${codeToAppend}\n</body>`);
          } else {
            updated = updated + '\n\n' + codeToAppend;
          }
          return { ...f, content: updated };
        }
        return f;
      })
    );
  };

  const getLanguage = (filename: string): FileItem['language'] => {
    if (filename.endsWith('.html') || filename.endsWith('.htm')) return 'html';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.md')) return 'markdown';
    return 'text';
  };

  const createFile = (name: string, type: 'file' | 'folder' = 'file', parentId: string | null = null) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    const newId = Date.now().toString();
    const newFile: FileItem = {
      id: newId,
      name: cleanName,
      path: cleanName,
      type,
      parentId,
      language: getLanguage(cleanName),
      content: type === 'file' ? (cleanName.endsWith('.html') ? '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' : '') : '',
    };

    setFiles((prev) => [...prev, newFile]);
    if (type === 'file') {
      openTab(newId);
    }
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    closeTab(id);
  };

  const renameFile = (id: string, newName: string) => {
    const cleanName = newName.trim();
    if (!cleanName) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: cleanName, language: getLanguage(cleanName) } : f))
    );
  };

  const openTab = (id: string) => {
    if (!openTabs.includes(id)) {
      setOpenTabs((prev) => [...prev, id]);
    }
    setActiveFileId(id);
  };

  const closeTab = (id: string) => {
    const newTabs = openTabs.filter((t) => t !== id);
    setOpenTabs(newTabs);
    if (activeFileId === id) {
      setActiveFileId(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  const loadTemplate = (template: ProjectTemplate) => {
    setFiles(template.files);
    setActiveFileId(template.files[0].id);
    setOpenTabs(template.files.map((f) => f.id));
    setConsoleLogs([]);
    setIsTemplateModalOpen(false);
    addConsoleLog('info', `Loaded project template: "${template.title}"`);
  };

  const exportProjectZip = async () => {
    const zip = new JSZip();
    for (const file of files) {
      if (file.type === 'file') {
        zip.file(file.name, file.content);
      }
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spck-project-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addConsoleLog('info', '✓ Project successfully exported as ZIP!');
  };

  return (
    <EditorContext.Provider
      value={{
        files,
        activeFileId,
        openTabs,
        viewMode,
        theme,
        viewport,
        fontSize,
        wordWrap,
        autoRun,
        isSidebarOpen,
        isConsoleOpen,
        isTemplateModalOpen,
        isSettingsModalOpen,
        isAiTerminalOpen,
        consoleLogs,
        previewUrl,
        previewKey,
        setActiveFileId,
        updateFileContent,
        appendCodeToFile,
        createFile,
        deleteFile,
        renameFile,
        closeTab,
        openTab,
        setViewMode,
        setTheme,
        setViewport,
        setFontSize,
        setWordWrap,
        setAutoRun,
        toggleSidebar: () => setIsSidebarOpen((v) => !v),
        toggleConsole: () => setIsConsoleOpen((v) => !v),
        toggleAiTerminal: () => setIsAiTerminalOpen((v) => !v),
        openAiTerminal: () => setIsAiTerminalOpen(true),
        closeAiTerminal: () => setIsAiTerminalOpen(false),
        openTemplateModal: () => setIsTemplateModalOpen(true),
        closeTemplateModal: () => setIsTemplateModalOpen(false),
        openSettingsModal: () => setIsSettingsModalOpen(true),
        closeSettingsModal: () => setIsSettingsModalOpen(false),
        loadTemplate,
        runPreview,
        clearConsole: () => setConsoleLogs([]),
        addConsoleLog,
        exportProjectZip,
        getActiveFile,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
}
