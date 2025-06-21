import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  FolderOpen, 
  File, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Search,
  FileText,
  Image,
  Code,
  Settings
} from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';

const Sidebar: React.FC = () => {
  const { files, currentFile, setCurrentFile, createFile, createFolder } = useFileSystem();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
      case 'js':
      case 'jsx':
        return <Code size={14} className="text-blue-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image size={14} className="text-green-400" />;
      case 'css':
        return <FileText size={14} className="text-pink-400" />;
      case 'json':
        return <Settings size={14} className="text-yellow-400" />;
      default:
        return <FileText size={14} className="text-gray-400" />;
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderFileTree = (items: any[], path: string = '') => {
    return items.map((item) => {
      const fullPath = path ? `${path}/${item.name}` : item.name;
      const isExpanded = expandedFolders.has(fullPath);
      
      if (item.type === 'folder') {
        return (
          <div key={fullPath}>
            <motion.div
              whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
              className="flex items-center space-x-2 px-2 py-1.5 cursor-pointer rounded-md text-sm"
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {isExpanded ? <FolderOpen size={14} className="text-blue-400" /> : <Folder size={14} className="text-blue-400" />}
              <span className="text-gray-300">{item.name}</span>
            </motion.div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-4 overflow-hidden"
                >
                  {renderFileTree(item.children, fullPath)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      } else {
        return (
          <motion.div
            key={fullPath}
            whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
            className={`flex items-center space-x-2 px-2 py-1.5 cursor-pointer rounded-md ml-6 text-sm ${
              currentFile === fullPath ? 'bg-purple-600/20 border-l-2 border-purple-500' : ''
            }`}
            onClick={() => setCurrentFile(fullPath)}
          >
            {getFileIcon(item.name)}
            <span className={`${currentFile === fullPath ? 'text-purple-300' : 'text-gray-300'}`}>
              {item.name}
            </span>
          </motion.div>
        );
      }
    });
  };

  return (
    <div className="h-full bg-gray-800 border-t border-gray-700">
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300">Files</h3>
          <div className="flex space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 hover:bg-gray-700 rounded text-gray-400"
              onClick={() => createFile('new-file.tsx')}
            >
              <Plus size={14} />
            </motion.button>
          </div>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 pl-8 pr-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-300"
          />
        </div>
      </div>

      <div className="p-2 space-y-1 overflow-y-auto max-h-60">
        {renderFileTree(files)}
      </div>
    </div>
  );
};

export default Sidebar;