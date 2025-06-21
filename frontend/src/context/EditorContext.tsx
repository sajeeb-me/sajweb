import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditorContextType {
  editorContent: string;
  setEditorContent: (content: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [editorContent, setEditorContent] = useState('');

  return (
    <EditorContext.Provider value={{ editorContent, setEditorContent }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};