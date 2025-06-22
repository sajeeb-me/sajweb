import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
}

interface FileSystemContextType {
  files: FileItem[];
  currentFile: string | null;
  setCurrentFile: (path: string) => void;
  getFileContent: (path: string) => string;
  updateFileContent: (path: string, content: string) => void;
  createFile: (name: string) => void;
  createFolder: (name: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

const initialFiles: FileItem[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'App.tsx',
        type: 'file',
        content: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to SajWeb</h1>
        <p className="text-gray-600">Start building something amazing!</p>
      </div>
    </div>
  );
}

export default App;`
      },
      {
        name: 'main.tsx',
        type: 'file',
        content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`
      },
      {
        name: 'index.css',
        type: 'file',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`
      }
    ]
  },
  {
    name: 'package.json',
    type: 'file',
    content: `{
  "name": "sajweb-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2"
  }
}`
  }
];


export const FileSystemProvider: React.FC<{ children: ReactNode, files: FileItem[], setFiles: (files: FileItem[]) => void }> = ({ children, files, setFiles }) => {
  const [currentFile, setCurrentFile] = useState<string | null>('src/App.tsx');

  const findFile = (path: string, items: FileItem[] = files): FileItem | null => {
    const parts = path.split('/');
    let current: any = { children: items };

    for (const part of parts) {
      if (!current.children) return null;
      current = current.children.find((item: FileItem) => item.name === part);
      if (!current) return null;
    }

    return current;
  };

  const getFileContent = (path: string): string => {
    const file = findFile(path);
    return file?.content || '';
  };

  const updateFileContent = (path: string, content: string) => {
    const updateInTree = (items: FileItem[]): FileItem[] => {
      return items.map(item => {
        if (item.type === 'folder' && item.children) {
          return { ...item, children: updateInTree(item.children) };
        } else if (item.type === 'file') {
          const itemPath = getItemPath(item, files);
          if (itemPath === path) {
            return { ...item, content };
          }
        }
        return item;
      });
    };

    setFiles(updateInTree(files));
  };

  const getItemPath = (target: FileItem, items: FileItem[], currentPath = ''): string => {
    for (const item of items) {
      const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;

      if (item === target) {
        return fullPath;
      }

      if (item.type === 'folder' && item.children) {
        const found = getItemPath(target, item.children, fullPath);
        if (found) return found;
      }
    }
    return '';
  };

  const createFile = (name: string) => {
    // Simple implementation - adds to root
    setFiles(prev => [...prev, {
      name,
      type: 'file',
      content: ''
    }]);
  };

  const createFolder = (name: string) => {
    setFiles(prev => [...prev, {
      name,
      type: 'folder',
      children: []
    }]);
  };

  return (
    <FileSystemContext.Provider value={{
      files,
      currentFile,
      setCurrentFile,
      getFileContent,
      updateFileContent,
      createFile,
      createFolder
    }}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};