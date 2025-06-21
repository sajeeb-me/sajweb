import React from 'react';
import { Menu, Share, Settings, Play, Code, Monitor, SplitSquareVertical, Terminal, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  layout: 'split' | 'preview' | 'code';
  onLayoutChange: (layout: 'split' | 'preview' | 'code') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  onToggleSidebar, 
  layout, 
  onLayoutChange 
}) => {
  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-700 rounded-md transition-colors"
        >
          <Menu size={20} />
        </motion.button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold">SajWeb</span>
            <div className="text-xs text-gray-400 -mt-1">AI Development</div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLayoutChange('code')}
          className={`p-2 rounded-md transition-colors ${
            layout === 'code' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600'
          }`}
          title="Code View"
        >
          <Code size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLayoutChange('split')}
          className={`p-2 rounded-md transition-colors ${
            layout === 'split' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600'
          }`}
          title="Split View"
        >
          <SplitSquareVertical size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLayoutChange('preview')}
          className={`p-2 rounded-md transition-colors ${
            layout === 'preview' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600'
          }`}
          title="Preview View"
        >
          <Monitor size={16} />
        </motion.button>
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Play size={16} />
          <span>Deploy</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title="Share"
        >
          <Share size={20} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </motion.button>
      </div>
    </header>
  );
};

export default Header;