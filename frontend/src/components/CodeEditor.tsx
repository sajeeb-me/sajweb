import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, Copy, Download, MoreHorizontal } from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';
import { useEditor } from '../context/EditorContext';

const CodeEditor: React.FC = () => {
  const { currentFile, getFileContent, updateFileContent } = useFileSystem();
  const { editorContent, setEditorContent } = useEditor();
  const [localContent, setLocalContent] = useState('');

  useEffect(() => {
    if (currentFile) {
      const content = getFileContent(currentFile);
      setLocalContent(content);
      setEditorContent(content);
    }
  }, [currentFile]);

  const handleContentChange = (value: string) => {
    setLocalContent(value);
    setEditorContent(value);
    if (currentFile) {
      updateFileContent(currentFile, value);
    }
  };

  const getLanguage = (filename: string) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'typescript';
      case 'jsx':
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      default:
        return 'text';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-300">
            {currentFile || 'No file selected'}
          </span>
          {currentFile && (
            <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
              {getLanguage(currentFile)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-400"
            title="Copy"
          >
            <Copy size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-400"
            title="Save"
          >
            <Save size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-400"
            title="More options"
          >
            <MoreHorizontal size={16} />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 relative">
        {currentFile ? (
          <div className="h-full flex">
            {/* Line numbers */}
            <div className="w-12 bg-gray-800 border-r border-gray-700 p-2 text-xs text-gray-500 font-mono">
              {localContent.split('\n').map((_, index) => (
                <div key={index + 1} className="h-6 flex items-center justify-end pr-2">
                  {index + 1}
                </div>
              ))}
            </div>
            
            {/* Editor */}
            <div className="flex-1">
              <textarea
                value={localContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-full bg-gray-900 text-white p-4 font-mono text-sm resize-none focus:outline-none leading-6"
                placeholder="Start coding..."
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm text-gray-600">Choose a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>
              {currentFile ? `${localContent.split('\n').length} lines` : 'No file selected'}
            </span>
            <span>UTF-8</span>
            {currentFile && (
              <span className="text-purple-400">
                {getLanguage(currentFile).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Saved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;