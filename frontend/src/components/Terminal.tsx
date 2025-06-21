import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square, ChevronRight } from 'lucide-react';

interface TerminalProps {
  onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onClose }) => {
  const [history, setHistory] = useState<Array<{ command: string; output: string; timestamp: Date }>>([
    {
      command: 'npm run dev',
      output: '> vite\n\n  Local:   http://localhost:5173/\n  Network: use --host to expose\n\n  ready in 123ms.',
      timestamp: new Date()
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    
    // Simulate command processing
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    let output = '';
    
    switch (command.toLowerCase().trim()) {
      case 'help':
        output = 'Available commands:\n  help - Show this help\n  clear - Clear terminal\n  ls - List files\n  npm run dev - Start development server\n  npm run build - Build for production';
        break;
      case 'clear':
        setHistory([]);
        setIsProcessing(false);
        return;
      case 'ls':
        output = 'src/\npackage.json\ntsconfig.json\nvite.config.ts\nREADME.md';
        break;
      case 'npm run dev':
        output = '> vite\n\n  Local:   http://localhost:5173/\n  Network: use --host to expose\n\n  ready in 89ms.';
        break;
      case 'npm run build':
        output = '> vite build\n\nBuilding for production...\n✓ 34 modules transformed.\ndist/index.html                  0.46 kB\ndist/assets/index-a1b2c3d4.css  1.23 kB │ gzip:  0.45 kB\ndist/assets/index-e5f6g7h8.js   143.21 kB │ gzip: 46.12 kB\n✓ built in 1.23s';
        break;
      default:
        output = `Command not found: ${command}\nType 'help' for available commands.`;
    }
    
    setHistory(prev => [...prev, {
      command,
      output,
      timestamp: new Date()
    }]);
    
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCommand.trim() && !isProcessing) {
      processCommand(currentCommand);
      setCurrentCommand('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Minus size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Square size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded text-red-400"
          >
            <X size={14} />
          </motion.button>
        </div>
      </div>

      <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto font-mono text-sm">
        {history.map((entry, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center space-x-2 text-green-400">
              <ChevronRight size={14} />
              <span>sajweb@local:~$</span>
              <span className="text-white">{entry.command}</span>
            </div>
            <div className="ml-6 mt-1 text-gray-300 whitespace-pre-wrap">
              {entry.output}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-center space-x-2 text-yellow-400">
            <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
            <span>Processing...</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-green-400">
            <ChevronRight size={14} />
            <span className="font-mono text-sm">sajweb@local:~$</span>
          </div>
          <input
            ref={inputRef}
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            className="flex-1 bg-transparent font-mono text-sm focus:outline-none"
            placeholder="Enter command..."
            disabled={isProcessing}
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;