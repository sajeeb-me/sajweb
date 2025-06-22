import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Check, Clock, FileText, Folder, Code, Eye } from 'lucide-react';
import { useChat } from '../context/ChatContext';
// import { useFileSystem } from '../context/FileSystemContext';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parser } from '../parser';

interface FileAction {
  id: string;
  type: 'create' | 'modify' | 'delete';
  path: string;
  status: 'pending' | 'in-progress' | 'completed';
  timestamp: Date;
}

const ChatInterface: React.FC = ({ setFiles, setIsUpdating }) => {
  const { messages, addMessage, isLoading } = useChat();
  // const { files } = useFileSystem();
  const [input, setInput] = useState('');
  const [fileActions, setFileActions] = useState<FileAction[]>([]);
  const [llmMessages, setLlmMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, fileActions]);

  // const oldMessages = [
  //   {
  //     "role": "user",
  //     "content": "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\n"
  //   },
  //   {
  //     "role": "user",
  //     "content": "Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n<boltArtifact id=\"project-import\" title=\"Project Files\"><boltAction type=\"file\" filePath=\"eslint.config.js\">import js from '@eslint/js';\nimport globals from 'globals';\nimport reactHooks from 'eslint-plugin-react-hooks';\nimport reactRefresh from 'eslint-plugin-react-refresh';\nimport tseslint from 'typescript-eslint';\n\nexport default tseslint.config(\n  { ignores: ['dist'] },\n  {\n    extends: [js.configs.recommended, ...tseslint.configs.recommended],\n    files: ['**/*.{ts,tsx}'],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n    },\n    plugins: {\n      'react-hooks': reactHooks,\n      'react-refresh': reactRefresh,\n    },\n    rules: {\n      ...reactHooks.configs.recommended.rules,\n      'react-refresh/only-export-components': [\n        'warn',\n        { allowConstantExport: true },\n      ],\n    },\n  }\n);\n</boltAction><boltAction type=\"file\" filePath=\"index.html\"><!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Vite + React + TS</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n</boltAction><boltAction type=\"file\" filePath=\"package.json\">{\n  \"name\": \"vite-react-typescript-starter\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"lint\": \"eslint .\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    \"lucide-react\": \"^0.344.0\",\n    \"react\": \"^18.3.1\",\n    \"react-dom\": \"^18.3.1\"\n  },\n  \"devDependencies\": {\n    \"@eslint/js\": \"^9.9.1\",\n    \"@types/react\": \"^18.3.5\",\n    \"@types/react-dom\": \"^18.3.0\",\n    \"@vitejs/plugin-react\": \"^4.3.1\",\n    \"autoprefixer\": \"^10.4.18\",\n    \"eslint\": \"^9.9.1\",\n    \"eslint-plugin-react-hooks\": \"^5.1.0-rc.0\",\n    \"eslint-plugin-react-refresh\": \"^0.4.11\",\n    \"globals\": \"^15.9.0\",\n    \"postcss\": \"^8.4.35\",\n    \"tailwindcss\": \"^3.4.1\",\n    \"typescript\": \"^5.5.3\",\n    \"typescript-eslint\": \"^8.3.0\",\n    \"vite\": \"^5.4.2\"\n  }\n}\n</boltAction><boltAction type=\"file\" filePath=\"postcss.config.js\">export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n</boltAction><boltAction type=\"file\" filePath=\"tailwind.config.js\">/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n</boltAction><boltAction type=\"file\" filePath=\"tsconfig.app.json\">{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",\n    \"useDefineForClassFields\": true,\n    \"lib\": [\"ES2020\", \"DOM\", \"DOM.Iterable\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"isolatedModules\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\",\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"noFallthroughCasesInSwitch\": true\n  },\n  \"include\": [\"src\"]\n}\n</boltAction><boltAction type=\"file\" filePath=\"tsconfig.json\">{\n  \"files\": [],\n  \"references\": [\n    { \"path\": \"./tsconfig.app.json\" },\n    { \"path\": \"./tsconfig.node.json\" }\n  ]\n}\n</boltAction><boltAction type=\"file\" filePath=\"tsconfig.node.json\">{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"lib\": [\"ES2023\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"isolatedModules\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"noFallthroughCasesInSwitch\": true\n  },\n  \"include\": [\"vite.config.ts\"]\n}\n</boltAction><boltAction type=\"file\" filePath=\"vite.config.ts\">import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n  optimizeDeps: {\n    exclude: ['lucide-react'],\n  },\n});\n</boltAction><boltAction type=\"file\" filePath=\"src/App.tsx\">import React from 'react';\n\nfunction App() {\n  return (\n    <div className=\"min-h-screen bg-gray-100 flex items-center justify-center\">\n      <p>Start prompting (or editing) to see magic happen :)</p>\n    </div>\n  );\n}\n\nexport default App;\n</boltAction><boltAction type=\"file\" filePath=\"src/index.css\">@tailwind base;\n@tailwind components;\n@tailwind utilities;\n</boltAction><boltAction type=\"file\" filePath=\"src/main.tsx\">import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.tsx';\nimport './index.css';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n</boltAction><boltAction type=\"file\" filePath=\"src/vite-env.d.ts\">/// <reference types=\"vite/client\" />\n</boltAction></boltArtifact>\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n"
  //   },
  // ]
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsUpdating(true);
      if (llmMessages.length < 1) {
        const firstResponse = await axios.post(`${BACKEND_URL}/template`, {
          prompt: input.trim(),
        });
        console.log("response from template endpoint: ", firstResponse);
        const { prompts, uiPrompts } = firstResponse.data;

        axios.post(`${BACKEND_URL}/chat`, {
          messages: [...prompts, input.trim()].map(content => ({
            role: 'user',
            content
          }))
        }).then(response => {
          setLlmMessages(x => [...x, ...prompts, input.trim()].map(content => ({
            role: 'user',
            content
          })));
          setLlmMessages(prev => [...prev, {
            role: 'assistant',
            content: response.data.response
          }]);

          console.log("response from chatInterface.tsx: ", response)
          const output = parser(response.data.response);
          setFiles(output); // Update files in the context
          console.log("output from parser: ", output);
          // const botMessage = response.data.response;
          // addMessage({
          //   id: Date.now().toString(),
          //   content: botMessage,
          //   role: 'bot',
          //   timestamp: new Date()
          // });
        }).catch(error => {
          console.error('Error sending message:', error);
        });
      } else {
        const newMessage = {
          role: "user",
          content: input.trim()
        };
        const stepResponse = await axios.post(`${BACKEND_URL}/chat`, {
          messages: [...llmMessages, newMessage]
        });

        console.log("response from chatInterface.tsx: ", stepResponse);
        const output = parser(stepResponse.data.response);
        setFiles(output); // Update files in the context
        console.log("output from parser: ", output);

        setLlmMessages(prev => [...prev, newMessage]);
        setLlmMessages(prev => [...prev, {
          role: 'assistant',
          content: stepResponse.data.response
        }]);

        // Simulate bot response  
        // addMessage({
        //   id: Date.now().toString(),
        //   content: botMessage,
        //   role: 'bot',
        //   timestamp: new Date()
        // });
      }

      console.log("llmMessages: ", llmMessages);


      addMessage({
        id: Date.now().toString(),
        content: input,
        role: 'user',
        timestamp: new Date()
      });

      // Simulate file actions based on user input
      simulateFileActions(input);
      setInput('');
      setIsUpdating(false);
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
              <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                  ? 'bg-purple-600'
                  : 'bg-gradient-to-br from-purple-500 to-blue-600'
                  }`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-lg ${message.role === 'user'
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
                  <span className={`${action.status === 'completed' ? 'text-green-400' :
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