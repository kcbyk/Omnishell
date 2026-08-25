export interface FileItem {
  id: string;
  name: string;
  path: string;
  content: string;
  type: 'file' | 'folder';
  parentId?: string | null;
  language?: 'html' | 'css' | 'javascript' | 'typescript' | 'json' | 'markdown' | 'text';
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export type ViewMode = 'editor' | 'preview' | 'split';
export type EditorTheme = 'vscode-dark' | 'dracula' | 'cyberpunk' | 'monokai';
export type DeviceViewport = 'responsive' | 'mobile' | 'tablet' | 'desktop';

export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  files: FileItem[];
}
