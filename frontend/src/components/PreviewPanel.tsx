import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor, MoreHorizontal } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

const PreviewPanel: React.FC = () => {
  const { editorContent } = useEditor();
  const [refreshKey, setRefreshKey] = useState(0);
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    const buildPreview = () => {
      if (!editorContent) {
        setPreviewContent(`
          <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-align: center; font-family: system-ui;">
            <div>
              <div style="font-size: 4rem; margin-bottom: 1rem;">⚡</div>
              <h1 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: bold;">SajWeb</h1>
              <p style="opacity: 0.9; font-size: 1.1rem;">AI-Powered Development Platform</p>
              <p style="opacity: 0.7; margin-top: 1rem;">Start coding to see your preview here</p>
            </div>
          </div>
        `);
        return;
      }

      if (editorContent.includes('function App') || editorContent.includes('const App')) {
        setPreviewContent(`
          <div style="padding: 2rem; font-family: system-ui; background: #f8fafc; min-height: 100vh;">
            <div style="background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto;">
              <div style="display: flex; align-items: center; margin-bottom: 2rem;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 1rem;">
                  <span style="color: white; font-weight: bold;">⚡</span>
                </div>
                <div>
                  <h1 style="color: #1f2937; margin: 0; font-size: 1.5rem;">Your React App</h1>
                  <p style="color: #6b7280; margin: 0; font-size: 0.875rem;">Live preview powered by SajWeb</p>
                </div>
              </div>
              <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #6366f1;">
                <h3 style="margin: 0 0 1rem 0; color: #374151;">Code Preview</h3>
                <pre style="margin: 0; font-family: 'Monaco', 'Menlo', monospace; font-size: 0.875rem; color: #4b5563; overflow-x: auto; white-space: pre-wrap;">${editorContent.slice(0, 300)}${editorContent.length > 300 ? '...' : ''}</pre>
              </div>
            </div>
          </div>
        `);
      } else {
        setPreviewContent(`
          <div style="padding: 2rem; font-family: system-ui; background: #111827; color: white; min-height: 100vh;">
            <div style="background: #1f2937; border-radius: 12px; padding: 2rem; border: 1px solid #374151;">
              <h2 style="margin: 0 0 1rem 0; color: #f3f4f6;">Live Preview</h2>
              <div style="background: #374151; padding: 1.5rem; border-radius: 8px; border: 1px solid #4b5563;">
                <pre style="margin: 0; font-family: 'Monaco', 'Menlo', monospace; font-size: 0.875rem; color: #d1d5db; overflow-x: auto; white-space: pre-wrap;">${editorContent || 'No content to preview'}</pre>
              </div>
            </div>
          </div>
        `);
      }
    };

    buildPreview();
  }, [editorContent, refreshKey]);

  const getDeviceClass = () => {
    switch (device) {
      case 'mobile':
        return 'w-80 h-[640px]';
      case 'tablet':
        return 'w-[640px] h-[480px]';
      default:
        return 'w-full h-full';
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
          <span className="text-sm font-medium text-gray-300">Preview</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-700 rounded-md p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded transition-colors ${
                device === 'mobile' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600 text-gray-400'
              }`}
              title="Mobile View"
            >
              <Smartphone size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded transition-colors ${
                device === 'tablet' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600 text-gray-400'
              }`}
              title="Tablet View"
            >
              <Tablet size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded transition-colors ${
                device === 'desktop' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600 text-gray-400'
              }`}
              title="Desktop View"
            >
              <Monitor size={14} />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-400"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-400"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
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

      <div className="flex-1 p-4 bg-gray-100 overflow-auto">
        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${getDeviceClass()}`}>
          <div className="w-full h-full">
            <iframe
              key={refreshKey}
              srcDoc={previewContent}
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>Live Preview • Auto-refresh enabled</span>
            <span className="text-purple-400">{device.charAt(0).toUpperCase() + device.slice(1)} View</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              editorContent ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
            <span className={editorContent ? 'text-green-400' : 'text-yellow-400'}>
              {editorContent ? 'Ready' : 'Waiting'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;