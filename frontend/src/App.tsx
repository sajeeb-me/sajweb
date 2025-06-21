import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import CodeEditor from './components/CodeEditor';
import PreviewPanel from './components/PreviewPanel';
import Terminal from './components/Terminal';
import { FileSystemProvider } from './context/FileSystemContext';
import { ChatProvider } from './context/ChatContext';
import { EditorProvider } from './context/EditorContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [layout, setLayout] = useState<'split' | 'preview' | 'code'>('split');

  return (
    <FileSystemProvider>
      <ChatProvider>
        <EditorProvider>
          <div className="h-screen bg-gray-900 text-white overflow-hidden">
            <Header 
              sidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              layout={layout}
              onLayoutChange={setLayout}
            />
            
            <div className="flex h-[calc(100vh-64px)]">
              {/* Chat Section - 1/3 width */}
              <div className="w-1/3 border-r border-gray-700 flex flex-col">
                <div className="flex-1">
                  <ChatInterface />
                </div>
                
                {/* File Explorer in Chat */}
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="border-t border-gray-700 max-h-80 overflow-hidden"
                    >
                      <Sidebar />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Code and Preview Section - 2/3 width */}
              <div className="w-2/3 flex flex-col">
                {layout === 'split' && (
                  <>
                    <div className="h-1/2 border-b border-gray-700">
                      <CodeEditor />
                    </div>
                    <div className="h-1/2">
                      <PreviewPanel />
                    </div>
                  </>
                )}
                {layout === 'preview' && (
                  <div className="h-full">
                    <PreviewPanel />
                  </div>
                )}
                {layout === 'code' && (
                  <div className="h-full">
                    <CodeEditor />
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {terminalOpen && (
                <motion.div
                  initial={{ y: 300 }}
                  animate={{ y: 0 }}
                  exit={{ y: 300 }}
                  transition={{ duration: 0.3 }}
                  className="fixed bottom-0 left-0 right-0 h-80 bg-gray-800 border-t border-gray-700 z-50"
                >
                  <Terminal onClose={() => setTerminalOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </EditorProvider>
      </ChatProvider>
    </FileSystemProvider>
  );
}

export default App;