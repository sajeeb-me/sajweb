import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Check, Clock, FileText, Folder, Code, Eye } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useFileSystem } from '../context/FileSystemContext';

interface FileAction {
  id: string;
  type: 'create' | 'modify' | 'delete';
  path: string;
  status: 'pending' | 'in-progress' | 'completed';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const { messages, addMessage, isLoading } = useChat();
  const { files } = useFileSystem();
  const [input, setInput] = useState('');
  const [fileActions, setFileActions] = useState<FileAction[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, fileActions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      addMessage({
        id: Date.now().toString(),
        content: input,
        role: 'user',
        timestamp: new Date()
      });
      
      // Simulate file actions based on user input
      simulateFileActions(input);
      setInput('');
    }
  };

  const simulateFileActions = (userInput: string) => {
    const actions: FileAction[] = [];
    const timestamp = new Date();
    
    // Simulate different file actions based on input keywords
    if (userInput.toLowerCase().includes('create') || userInput.toLowerCase().includes('build') || userInput.toLowerCase().includes('make')) {
      actions.push(
        {
          id: `${Date.now()}-1`,
          type: 'create',
          path: 'src/components/NewComponent.tsx',
          status: 'pending',
          timestamp
        },
        {
          id: `${Date.now()}-2`,
          type: 'create',
          path: 'src/styles/component.css',
          status: 'pending',
          timestamp
        },
        {
          id: `${Date.now()}-3`,
          type: 'modify',
          path: 'src/App.tsx',
          status: 'pending',
          timestamp
        }
      );
    }

    if (actions.length > 0) {
      setFileActions(prev => [...prev, ...actions]);
      
      // Simulate progress
      actions.forEach((action, index) => {
        setTimeout(() => {
          setFileActions(prev => 
            prev.map(a => 
              a.id === action.id ? { ...a, status: 'in-progress' } : a
            )
          );
          
          setTimeout(() => {
            setFileActions(prev => 
              prev.map(a => 
                a.id === action.id ? { ...a, status: 'completed' } : a
              )
            );
          }, 1000 + Math.random() * 1000);
        }, index * 500);
      });
    }
  };

  const getActionIcon = (type: string, status: string) => {
    if (status === 'completed') return <Check size={14} className="text-green-400" />;
    if (status === 'in-progress') return <Loader2 size={14} className="animate-spin text-blue-400" />;
    
    switch (type) {
      case 'create':
        return <FileText size={14} className="text-gray-400" />;
      case 'modify':
        return <Code size={14} className="text-gray-400" />;
      default:
        return <Clock size={14} className="text-gray-400" />;
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <div key={i} className={line.startsWith('```') ? 'font-mono bg-gray-800 p-2 rounded mt-2' : ''}>
        {line}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Chat</h2>
        <p className="text-sm text-gray-400">Describe what you want to build</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-purple-600' 
                    : 'bg-gradient-to-br from-purple-500 to-blue-600'
                }`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 border border-gray-700'
                }`}>
                  <div className="text-sm">
                    {formatMessage(message.content)}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* File Actions Progress */}
        {fileActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Bot size={16} className="text-purple-400" />
              <span className="text-sm font-medium">Working on your project...</span>
            </div>
            <div className="space-y-2">
              {fileActions.slice(-5).map((action) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3 text-sm"
                >
                  {getActionIcon(action.type, action.status)}
                  <span className={`${
                    action.status === 'completed' ? 'text-green-400' : 
                    action.status === 'in-progress' ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {action.type === 'create' ? 'Creating' : 
                     action.type === 'modify' ? 'Modifying' : 'Processing'} {action.path}
                  </span>
                  {action.status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-colors"
          >
            <Send size={16} />
          </motion.button>
        </form>
        <div className="text-xs text-gray-500 mt-2">
          SajWeb can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;